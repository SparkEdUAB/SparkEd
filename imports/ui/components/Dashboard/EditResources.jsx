import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import i18n from 'meteor/universe:i18n';
import ReactPaginate from 'react-paginate';
import { _Topics } from '../../../api/topics/topics';
import {
  handleCheckboxChange,
  handleCheckAll,
  getCheckBoxValues,
} from '../Utilities/CheckBoxHandler.jsx';
import UploadWrapper from '../../../ui/modals/UploadWrapper.jsx';
import MainModal from '../../../ui/modals/MainModal.jsx';
import { Resources } from '../../../api/resources/resources';
import * as config from '../../../../config.json';
import { _Units } from '../../../api/units/units';
import { formatText } from '../../utils/utils';

export const T = i18n.createComponent();

export class EditResources extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isOpen: false,
      modalIdentifier: '',
      modalType: '',
      title: '',
      name: '',
      confirm: '',
      reject: '',
      ids: [],
    };
    Session.set('limit', 10);
  }

  // close the modal, and clear the states;
  closeModal = () => {
    this.setState({
      isOpen: false,
      modalIdentifier: '', // Topic Id
      modalType: '', // Add or Edit
      title: '', // Add Topic or Edit Topic
      name: '',
      confirm: '',
      reject: '',
    });
  };

  // ide => modalType, id=> courseId
  /**
   * @param { String } ide - Type of the modal
   * @param { String } id - resource Id,
   * @param { String } name - Name of the resource
   * @default { id, name } - can be optional
   * Testing the documentation
   */

  toggleEditModal = (ide, id = '', name = '') => {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'content-manager'])) {
      Materialize.toast('Only Admins and Content-Manager can edit the Topic', 4000, 'error-toast');
      return;
    }
    this.name = name;
    switch (ide) {
      case 'edit':
        this.setState({
          modalIdentifier: id,
          modalType: ide,
          title: 'Edit The Resource',
          name: this.name,
          confirm: 'Save',
          reject: 'Close',
        });
        break;
      case 'upload':
        this.setState({
          modalIdentifier: '',
          modalType: ide,
          title: `Upload resource for ${Session.get('unitName')}`,
          confirm: 'Save',
          reject: 'Close',
        });
        break;
      case 'del':
        const resources = getCheckBoxValues('chk');
        const count = resources.length;
        const name = count > 1 ? 'resources' : 'resource';
        if (count < 1) {
          Materialize.toast('Please check at least one resource', 4000, 'error-toast');
          return;
        }
        this.setState({
          modalIdentifier: id,
          modalType: ide,
          title: `Are you sure to delete ${count} ${name}`,
          confirm: 'Yes',
          reject: 'No',
          ids: id,
        });
        break;
    }
    // if the modal was open close it
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  getBack = e => {
    // event.preventDefault();
    if (config.isHighSchool) {
      FlowRouter.go(`/dashboard/units/?cs=${Session.get('courseIde')}`);
    } else {
      return FlowRouter.go(`/dashboard/edit_unit/${Session.get('unitId')}`);
    }
  };

  // callback for the modal ( When it is add, save or Yes )
  handleSubmit(event) {
    event.preventDefault();
    const topicId = FlowRouter.getParam('_id');
    const { modalIdentifier, modalType } = this.state;
    // updating
    switch (modalType) {
      case 'edit':
        const resourceName = event.target.resource.value;
        Meteor.call('updateResource', modalIdentifier, resourceName, err => {
          err
            ? (Materialize.toast(err.reason, 3000, 'error-toast'),
              Meteor.call(
                'logger',
                formatText(err.message, Meteor.userId(), 'resource-update'),
                'error',
              ))
            : Meteor.call('updateSearch', modalIdentifier, resourceName, err => {
                err
                  ? Materialize.toast(err.reason, 'error-toast')
                  : Materialize.toast(
                      `successfully updated ${resourceName} `,
                      4000,
                      'success-toast',
                    );
              });
        });
        break;
      // deleting (Yes)
      case 'del':
        let count = 0;
        const resources = getCheckBoxValues('chk');
        resources.forEach((v, k, arra) => {
          count += 1;
          const name = count > 1 ? 'resources' : 'resource';
          Meteor.call('removeResource', v, err => {
            err
              ? (Materialize.toast(err.reason, 3000, 'error-toast'),
                Meteor.call(
                  'logger',
                  formatText(err.message, Meteor.userId(), 'resource-remove'),
                  'error',
                ))
              : Meteor.call('removeSearchData', v, err => {
                  err
                    ? Materialize.toast(err.reason)
                    : Meteor.call('insertDeleted', v, 'resource', err => {
                        err
                          ? Materialize.toast(err.reason, 3000, 'error-toast')
                          : Materialize.toast(
                              `${count} ${name} successfully deleted`,
                              4000,
                              'success-toast',
                            );
                      });
                });
            // });
          });
        });
        break;
    }
    // close the modal when done submitting
    this.closeModal();
  }

  renderResources() {
    const { topic, resources } = this.props;

    if (!topic && !resources) {
      return null;
    }
    if (!resources || resources.length === 0) {
      return null;
    }
    let count = 1;
    return resources.map(resource => (
      <tr key={resource._id}>
        <td>{count++}</td>
        <td>{resource.name.replace(/\.[^/.]+$/, '')}</td>
        <td>
          <a
            href=""
            className="fa fa-pencil"
            onClick={e => this.toggleEditModal('edit', resource._id, resource.name, e)}
          />
        </td>
        <td>{resource.ext}</td>
        <td onClick={handleCheckboxChange.bind(this, resource._id)}>
          <input
            type="checkbox"
            value={resource.name}
            className={` filled-in chk chk${resource._id}`}
            id={resource._id}
          />
          <label />
        </td>
        {Session.set('filename', resource.name)}
      </tr>
    ));
  }

  getName() {
    const { topic, unit } = this.props;
    // let nam
    if (topic) {
      Session.setPersistent({
        unitId: topic.unitId,
        unitName: topic.name,
      });
      return topic.name;
    } else if (unit) {
      return unit.name;
    }
  }

  componentWillUnmount() {
    Session.set({
      limit: 0,
      skip: 0,
    });
  }
  getPageCount() {
    const { count } = this.props;
    return Math.ceil(count / Session.get('limit'));
  }

  handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * Session.get('limit'));
    Session.set('skip', offset);
  };
  getEntriesCount = (e, count) => {
    Session.set('limit', count);
  };

  renderPagination() {
    const { count } = this.props;
    if (!count || count <= Session.get('limit')) {
      return <span />;
    }
    return (
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={<a href="">...</a>}
        breakClassName={'break-me'}
        pageCount={this.getPageCount()}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination '}
        activeClassName={'active blue'}
        pageLinkClassName={'link'}
      />
    );
  }
  render() {
    const { isOpen, title, confirm, reject, modalType, name } = this.state;
    const limit = Session.get('limit');
    return (
      <>
        {modalType === 'upload' ? (
          <UploadWrapper
            show={isOpen}
            close={this.closeModal}
            title={title}
            submit={this.submitFile}
          />
        ) : (
          <MainModal
            show={isOpen}
            onClose={this.closeModal}
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
                  placeholder="Name of Resource"
                  type="text"
                  defaultValue={name}
                  className="validate clear"
                  required
                  name="resource"
                />
              </div>
            )}
          </MainModal>
        )}
        <div className="col m9 s11">
          <div className="">
            <h4>{this.getName()}</h4>
          </div>
          <div className="row ">
            <div className="col s4 m3">
              <button className="btn grey darken-3 fa fa-angle-left" onClick={e => this.getBack(e)}>
                {' '}
                {config.isHighSchool ? Session.get('sub_unit_title') || ' Units' : ' Topics'}
              </button>
            </div>
            <div className="col s4 m3">
              <button
                className="btn red darken-3 fa fa-remove "
                onClick={e => this.toggleEditModal('del', e)}
              >
                {' '}
                <T>common.actions.delete</T>
              </button>
            </div>

            <div className="col s4 m3">
              <button
                className="btn fa fa-upload green darken-4 "
                onClick={e => this.toggleEditModal('upload', e)}
              >
                {' '}
                Upload New
              </button>
            </div>
            <div className="col m3">
              Resources displayed
              <div className="row">
                <a className="col s2 link" onClick={e => this.getEntriesCount(e, 5)}>
                  <u>{limit === 5 ? <b>5</b> : 5}</u>
                </a>
                <a className="col s2 link" onClick={e => this.getEntriesCount(e, 10)}>
                  <u>{limit === 10 ? <b>10</b> : 10}</u>
                </a>
                <a className="col s2 link" onClick={e => this.getEntriesCount(e, 20)}>
                  <u>{limit === 20 ? <b>20</b> : 20}</u>
                </a>
              </div>
            </div>
          </div>

          <table className="striped">
            <thead>
              <tr>
                <th>#</th>
                <th>
                  <T>common.manage.resources</T>
                </th>
                <th>
                  <T>common.actions.edit</T> <T>common.manage.resources</T>
                </th>
                <th>Type</th>
                <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                  <input type="checkbox" className="filled-in chk-all" readOnly />
                  <label>
                    <T>common.actions.check</T>
                  </label>
                </th>
              </tr>
            </thead>
            <tbody>{this.renderResources()}</tbody>
          </table>
          {this.renderPagination()}
        </div>
      </>
    );
  }
}
EditResources.propTypes = {
  topic: PropTypes.object,
};
export function getId() {
  return FlowRouter.getParam('_id');
}
export default withTracker(() => {
  Meteor.subscribe('resourcess');
  if (config.isHighSchool) {
    Meteor.subscribe('isHighSchool.units', getId());
    return {
      resources: Resources.find(
        { 'meta.unitId': getId() },
        { skip: Session.get('skip'), limit: Session.get('limit') },
      ).fetch(),
      count: Resources.find({ 'meta.unitId': getId() }).count(),
      unit: _Units.findOne({}),
    };
  }
  Meteor.subscribe('topics');
  return {
    topic: _Topics.findOne({ _id: getId() }),
    resources: Resources.find(
      { 'meta.topicId': getId() },
      { skip: Session.get('skip'), limit: Session.get('limit') },
    ).fetch(),
    count: Resources.find({ 'meta.topicId': getId() }).count(),
  };
})(EditResources);
