// TODO:  properly route back to the programs, can do this by setting the id in session
import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _ExternalLink } from '../../../api/externallink/externallink';
import {
  handleCheckboxChange,
  handleCheckAll,
  getCheckBoxValues,
} from '../Utilities/CheckBoxHandler.jsx';
import MainModal from '../../../ui/modals/MainModal.jsx';
import { closeModal } from '../../../ui/modals/methods.js';

export class ExternalLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      modalIdentifier: '',
      modalType: '',
      title: '',
      confirm: '',
      reject: '',
      ids: [],
      externalLinkTitle: '',
      url: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // close the modal, and clear the states;
  close = () => {
    this.setState(closeModal);
  };

  // ide => modalType, id=> courseId
  /**
   * @param { String } ide - Type of the modal
   * @param { String } id - resource Id,
   * @param { String } name - Name of the resource
   * @default { id, name } - can be optional
   * Testing the documentation
   */
  toggleEditModal = (ide, id = '', externalLinkTitle = '', url = '') => {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'content-manager'])) {
      Materialize.toast(
        'Only Admins can edit the External links',
        4000,
        'error-toast',
      );
      return;
    }
    this.externalLinkTitle = externalLinkTitle;
    this.url = url;
    switch (ide) {
      case 'edit':
        this.setState({
          modalIdentifier: id,
          modalType: ide,
          title: `Edit ${this.externalLinkTitle}`,
          confirm: 'Save',
          reject: 'Close',
          externalLinkTitle: this.externalLinkTitle,
          url: this.url,
          // owner: this.owner,
        });
        break;
      case 'add':
        // this.setState(ide, 'Add External Link', 'Save', 'Close',);
        this.setState({
          modalIdentifier: id,
          modalType: ide,
          title: 'Add External Link',
          confirm: 'Save',
          reject: 'Close',
        });
        break;

      case 'del':
        const externallink = getCheckBoxValues('chk');
        const count = externallink.length;
        const name = count > 1 ? 'external links' : 'links';
        if (count < 1) {
          Materialize.toast('Please check atleast one ex', 4000, 'error-toast');
          return;
        }
        this.setState({
          modalIdentifier: 'id',
          modalType: ide,
          title: `Are you sure to delete ${count} ${name}`,
          confirm: 'Yes',
          reject: 'No',
          ids: externallink,
        });
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  handleExternalLinkUrl = (event, url) => {
    window.open(url, '_blank');
  };

  renderExternalLinks() {
    let count = 1;
    if (this.props.externallinks === undefined) {
      return null;
    }
    return this.props.externallinks.map(externallink => (
      <tr className="link-section" key={externallink._id}>
        <td>{count++}</td>
        <td>{externallink.name}</td>
        <td
          className="blue-text"
          onClick={e => this.handleExternalLinkUrl(this, externallink.url)}
        >
          {externallink.url}
        </td>
        <td>{externallink.createdAt.toDateString()}</td>

        <td>
          <a
            href=""
            className="fa fa-pencil"
            onClick={e =>
              this.toggleEditModal(
                'edit',
                externallink._id,
                externallink.name,
                externallink.url,
                // externallink.createdBy,
                e,
              )
            }
          />
        </td>
        <td onClick={handleCheckboxChange.bind(this, externallink._id)}>
          <input
            type="checkbox"
            className={` filled-in chk chk${externallink._id}`}
            id={externallink._id}
          />
          <label />
        </td>
      </tr>
    ));
  }

  handleSubmit(e) {
    e.preventDefault();

    let externalLinkTitle;
    let url;
    const id = new Meteor.Collection.ObjectID().valueOf();
    const { modalType, ids, modalIdentifier } = this.state;
    switch (modalType) {
      case 'add':
        externalLinkTitle = e.target.externalLinkTitle.value;
        url = e.target.url.value;
        Meteor.call('externallink.add', id, externalLinkTitle, url, err => {
          err
            ? Materialize.toast(err.reason, 4000, 'error-toast')
            : Materialize.toast(
              `Successfully added ${externalLinkTitle} web address`,
              4000,
              'success-toast',
            );
        });

        break;

      case 'edit':
        externalLinkTitle = e.target.externalLinkTitle.value;
        url = e.target.url.value;
        Meteor.call(
          'externallink.edit',
          modalIdentifier,
          externalLinkTitle,
          url,
          err => {
            err
              ? Materialize.toast(err.reason, 4000, 'error-toast')
              : Materialize.toast(
                `Successfully updated ${externalLinkTitle}`,
                4000,
                'success-toast',
              );
          },
        );
        break;

      case 'del':
        let count = 0;
        const externallinks = ids;
        externallinks.forEach((v, k, arra) => {
          count += 1;
          const name = count > 1 ? 'external links' : 'external link';
          Meteor.call('externallink.remove', v, err => {
            err
              ? Materialize.toast(err.reason, 4000, 'error-toast')
              : Materialize.toast(
                `${count} ${name} successfully deleted`,
                4000,
                'success-toast',
              );
          });
        });

        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const {
      isOpen,
      title,
      confirm,
      reject,
      modalType,
      externalLinkTitle,
      url,
    } = this.state;
    return (
      <Fragment>
        <MainModal
          show={isOpen}
          onClose={this.close}
          subFunc={this.handleSubmit}
          title={title}
          confirm={confirm}
          reject={reject}
        >
          {modalType === 'del' ? (
            ''
          ) : (
            <div className="input-field">
              <input
                placeholder="Name of the Link"
                type="text"
                defaultValue={externalLinkTitle}
                className="validate clear"
                required
                name="externalLinkTitle"
              />
              <input
                placeholder="url"
                type="url"
                defaultValue={url}
                className="validate clear"
                required
                name="url"
              />
            </div>
          )}
        </MainModal>
        <div className="col m9 s11">
          <div className="">
            <h4>Manage External Links</h4>
          </div>
          <div className="row">
            <div className="col m3">
              <button
                className="btn red darken-3 "
                onClick={e => this.toggleEditModal('del', e)}
              >
                {' '}
                Delete
              </button>
            </div>
            <div className="col m3">
              <a href="">
                <button
                  className="btn green darken-4 "
                  onClick={e => this.toggleEditModal('add', e)}
                >
                  {' '}
                  New
                </button>
              </a>
            </div>
          </div>

          <table className="highlight bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Link Name</th>
                <th>Link URL</th>
                <th>Created At</th>
                <th>Edit External Link</th>
                <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                  <input
                    type="checkbox"
                    className="filled-in chk-all"
                    readOnly
                  />
                  <label>Check All</label>
                </th>
              </tr>
            </thead>
            <tbody>{this.renderExternalLinks()}</tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

ExternalLinks.propTypes = {
  externallinks: PropTypes.array,
};

export default withTracker(() => {
  Meteor.subscribe('externallinks');
  Meteor.subscribe('deleted');
  Meteor.subscribe('searchdata');
  return {
    externallinks: _ExternalLink.find({}).fetch(),
  };
})(ExternalLinks);
