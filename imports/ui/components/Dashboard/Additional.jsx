import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ReactPaginate from 'react-paginate';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { _Courses } from '../../../api/courses/courses';
import { References } from '../../../api/resources/resources';
import {
  handleCheckboxChange,
  handleCheckAll,
  getCheckBoxValues,
} from '../Utilities/CheckBoxHandler.jsx';
import UploadWrapper from '../../../ui/modals/UploadWrapper.jsx';
import MainModal from '../../../ui/modals/MainModal';
import { closeModal, schoolStates } from '../../../ui/modals/methods.js';

export class Additional extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isOpen: false,
      modalIdentifier: '',
      modalType: '',
      title: '',
      confirm: '',
      reject: '',
      ids: [],
      name: '',
      code: '',
      perPage: 2,
      offset: 0,
    };
    Session.set('limit', 10);
  }

  componentWillUnmount() {
    Session.set({
      limit: 0,
      skip: 0,
    });
  }

  closeModal = () => {
    this.setState(closeModal);
  };

  // ide => modalType, id=> schoolId
  toggleEditModal = (ide, id = '', name = '') => {
    // check if the user has full rights
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Materialize.toast('Only Admins can edit the resource', 3000, 'error-toast');
      return;
    }

    this.name = name;
    this.id = id;

    switch (ide) {
      case 'edit':
        this.setState({
          modalIdentifier: this.id,
          modalType: ide,
          title: 'Edit Resource',
          confirm: 'Save',
          reject: 'Close',
          name: this.name,
        });

        break;

      case 'del':
        const resources = getCheckBoxValues('chk');
        const count = resources.length;
        const name = count > 1 ? 'resource' : 'resources';

        if (count < 1) {
          Materialize.toast('Please check atleast one resource', 3000, 'error-toast');
          return;
        }
        this.setState({
          modalIdentifier: 'id',
          modalType: ide,
          title: `Are you sure to delete ${count} ${name}`,
          confirm: 'Yes',
          reject: 'No',
          ids: resources,
        });
        break;
      case 'upload':
        this.setState({
          modalIdentifier: '',
          modalType: ide,
          title: `Upload a Reference`,
          confirm: 'Save',
          reject: 'Close',
        });
        break;
    }
    this.setState({ isOpen: true });
  };

  handleSubmit(e) {
    e.preventDefault();
    const { modalType, ids, modalIdentifier } = this.state;

    switch (modalType) {
      case 'edit':
        const reference = e.target.res.value;
        Meteor.call('updateReference', modalIdentifier, reference, err => {
          err
            ? Materialize.toast(err.reason, 3000, 'error-toast')
            : Meteor.call('updateSearch', modalIdentifier, reference, err => {
                err
                  ? Materialize.toast(err.reason, 3000, 'error-toast')
                  : Materialize.toast('Successfully Updated', 3000, 'success-toast');
              });
        });
        break;
      case 'del':
        let count = 0;

        for (let res of ids) {
          count += 1;
          const name = count > 1 ? 'references' : 'reference';
          Meteor.call('removeReference', res, err => {
            err
              ? Materialize.toast(err.reason, 3000, 'error-toast')
              : Meteor.call('removeSearchData', res, err => {
                  err
                    ? Materialize.toast(err.reason, 3000, 'error-toast')
                    : Materialize.toast(
                        `${count} ${name} successfully deleted`,
                        3000,
                        'success-toast',
                      );
                });
          });
        }

        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  /**
   * @param { String} id
   */
  static handleUrl(id) {
    FlowRouter.go(`/dashboard/view_resource/${id}`);
  }

  /**
   * @param {String} courseId
   * @returns The name of the course or anonymous if its an extra resource
   */
  static renderCourseName(courseId) {
    // this should be reactive
    const course = _Courses.findOne({ _id: courseId });
    // show anonymous on references that don't belong to any course
    if (!course) {
      return 'Anonymous';
    }
    return course.name;
  }

  renderExtra() {
    let count = 1;
    const { extras } = this.props;
    if (!extras) {
      return null;
    }
    return extras.map(extra => (
      <tr className="link-section" key={extra._id}>
        <td>{count++}</td>
        <td onClick={Additional.handleUrl.bind(this, extra._id)}>
          {extra.name.replace(/\.[^/.]+$/, '')}
        </td>
        <td>
          <a
            href=""
            className="fa fa-pencil"
            onClick={e => this.toggleEditModal('edit', extra._id, extra.name, e)}
          />
        </td>
        <td>
          {/* don't route a resource if it doesn't belong to any course */}
          <a
            href={
              extra.courseId === null
                ? ''
                : `/dashboard/units/${extra.programId}?cs=${extra.courseId}`
            }
          >
            {Additional.renderCourseName(extra.courseId)}
          </a>
        </td>
        <td onClick={handleCheckboxChange.bind(this, extra._id)}>
          <input type="checkbox" className={` filled-in chk chk${extra._id}`} id={extra._id} />
          <label />
        </td>
      </tr>
    ));
  }

  getPageCount() {
    const { count } = this.props;
    return count === 0 || Session.get('limit') === 0 ? 0 : Math.ceil(count / Session.get('limit'));
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
    if (!count) {
      return <span />;
    }
    if (count <= Session.get('limit')) {
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
    const { modalType, isOpen, title, confirm, reject, name } = this.state;
    return (
      <div className="">
        {/* Modals for Deleting  */}
        <>
          {modalType === 'upload' ? (
            <UploadWrapper show={isOpen} close={this.closeModal} title={title} />
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
                <span />
              ) : (
                <div className="input-field">
                  <input
                    placeholder="Name of Unit"
                    type="text"
                    defaultValue={name}
                    className="validate clear"
                    required
                    name="res"
                  />
                </div>
              )}
            </MainModal>
          )}
        </>
        <div className="col m9 s11">
          <div className="">
            <h4>Reference Library </h4>
          </div>
          <div className="row">
            <div className="col m4">
              <button
                className="btn red darken-3 fa fa-remove"
                onClick={e => this.toggleEditModal('del', e)}
              >
                {' '}
                Delete
              </button>
            </div>
            <div className="col m4">
              <button
                className="btn fa fa-upload green darken-4 "
                onClick={e => this.toggleEditModal('upload', e)}
              >
                {' '}
                Add Reference
              </button>
            </div>
            <div className="col m4">
              Reference displayed
              <div className="row">
                <a className="col s2 link" onClick={e => this.getEntriesCount(e, 5)}>
                  <u>{Session.get('limit') === 5 ? <b>5</b> : 5}</u>
                </a>
                <a className="col s2 link" onClick={e => this.getEntriesCount(e, 10)}>
                  <u>{Session.get('limit') === 10 ? <b>10</b> : 10}</u>
                </a>
                <a className="col s2 link" onClick={e => this.getEntriesCount(e, 20)}>
                  <u>{Session.get('limit') === 20 ? <b>20</b> : 20}</u>
                </a>
              </div>
            </div>
          </div>

          <table className="highlight">
            <thead>
              <tr>
                <th>#</th>
                <th>Resource Name</th>
                <th>Edit the Reference</th>
                <th>Course Name</th>
                <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                  <input type="checkbox" className="filled-in chk-all" readOnly />
                  <label>Check All</label>
                </th>
              </tr>
            </thead>
            <tbody>{this.renderExtra()}</tbody>
          </table>
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

Additional.propTypes = {
  extras: PropTypes.array,
};

export default withTracker(() => {
  Meteor.subscribe('courses');
  Meteor.subscribe('references');

  return {
    extras: References.find({}, { skip: Session.get('skip'), limit: Session.get('limit') }).fetch(),
    count: References.find().count(),
  };
})(Additional);
