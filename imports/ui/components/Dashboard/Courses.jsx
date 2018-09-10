// TODO:  properly route back to the programs, can do this by setting the id in session
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import i18n from 'meteor/universe:i18n';
import { withTracker } from 'meteor/react-meteor-data';
import { _Courses } from '../../../api/courses/courses';
import { Titles } from '../../../api/settings/titles';
import {
  handleCheckboxChange,
  handleCheckAll,
  getCheckBoxValues,
} from '../Utilities/CheckBoxHandler.jsx';
import MainModal from '../../../ui/modals/MainModal.jsx';
import { closeModal } from '../../../ui/modals/methods.js';
import * as config from '../../../../config.json';
import { formatText } from '../../utils/utils';

export const T = i18n.createComponent();

export class Courses extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isOpen: false,
      modalIdentifier: '', // Course Id
      modalType: '', // Add or Edit
      title: '', // Add Course or Edit Course
      confirm: '',
      reject: '',
      year: '',
      name: '',
      owner: '',
      ids: [],
      table_title: 'Course',
      sub_title: 'Unit',
    };
  }

  componentDidMount() {
    Session.set('course', ' active');
    window.scrollTo(0, 0);
  }
  componentWillUnmount() {
    Session.set('course', '');
  }
  // close the modal, close the modal, and clear the states;
  close = () => {
    this.setState(closeModal);
  };

  // ide => modalType, id=> courseId
  toggleEditModal = (ide, yr = '', id = '', name = '', code = '', owner = '') => {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'content-manager'])) {
      Materialize.toast('Only Admins and Content-Manager can edit Courses', 3000, 'error-toast');
      return;
    }
    this.name = name;
    this.code = code;
    this.year = yr;
    this.owner = owner;
    switch (ide) {
      case 'edit':
        this.setState({
          modalIdentifier: id,
          modalType: ide,
          title: `Edit ${Session.get('course_title')}`,
          confirm: <T>common.actions.save</T>,
          reject: <T>common.actions.close</T>,
          name: this.name,
          code: this.code,
          year: this.year,
          owner: this.owner,
        });
        break;
      case 'add':
        this.setState({
          modalIdentifier: id,
          modalType: ide,
          title: `Add ${Session.get('course_title')}`,
          confirm: <T>common.actions.save</T>,
          reject: <T>common.actions.close</T>,
        });
        break;
      case 'del':
        const course = getCheckBoxValues('chk');
        const count = course.length;
        const name = count > 1 ? 'courses' : 'course';
        if (count < 1) {
          Materialize.toast('Please check atleast one course', 3000, 'error-toast');
          return;
        }
        this.setState({
          modalIdentifier: 'id',
          modalType: ide,
          title: `Are you sure to delete ${count} ${name}`,
          confirm: <T>common.actions.yes</T>,
          reject: <T>common.actions.no</T>,
          ids: course,
        });
        break;
      case 'field':
        this.setState({
          title: 'Edit Table titles on this page',
          confirm: <T>common.actions.save</T>,
          reject: <T>common.actions.close</T>,
          modalType: ide,
          table_title: yr,
          sub_title: id,
        });
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  // route to whats contained in the course
  static handleUrl(id, year, event) {
    event.preventDefault();
    Session.setPersistent('courseIde', id);
    FlowRouter.go(`/dashboard/units/${id}?y=${year}`);
  }

  // Adding new Course
  handleSubmit(e) {
    e.preventDefault();
    let course;
    let courseCode;
    let year;
    let details;
    const { target } = e;
    const { modalType, modalIdentifier, ids, owner, table_title, sub_title } = this.state;

    switch (modalType) {
      case 'add':
        course = target.course.value;
        courseCode = target.courseCode.value;
        year = target.year.value;
        details = { year };
        const reference = config.isHighSchool ? 'subject' : 'course';
        const courseId = new Meteor.Collection.ObjectID().valueOf();
        Meteor.call('course.add', courseId, course, courseCode, details, (err, res) => {
          err
            ? (Materialize.toast(err.reason, 3000, 'error-toast'),
              Meteor.call(
                'logger',
                formatText(err.message, Meteor.userId(), 'course-add'),
                'error',
              ))
            : Meteor.call('insert.search', courseId, { courseId }, course, reference, err => {
                err
                  ? Materialize.toast(err.reason, 3000, 'error-toast')
                  : Materialize.toast(`Successfully added ${course} `, 3000, 'success-toast');
              });
        });

        break;

      case 'edit':
        course = target.course.value;
        courseCode = target.courseCode.value;
        year = target.year.value;
        Meteor.call('course.edit', modalIdentifier, course, courseCode, year, owner, err => {
          err
            ? (Materialize.toast(err.reason, 3000, 'error-toast'),
              Meteor.call(
                'logger',
                formatText(err.message, Meteor.userId(), 'course-edit'),
                'error',
              ))
            : Meteor.call('updateSearch', modalIdentifier, course, err => {
                err
                  ? Materialize.toast(err.reason, 3000, 'error-toast')
                  : Materialize.toast(`${course} Successfully updated`, 3000, 'success-toast');
              });
        });
        break;

      case 'del':
        let count = 0;
        const courses = ids;
        courses.forEach((v, k, arra) => {
          count += 1;
          const name = count > 1 ? 'courses' : 'course';
          Meteor.call('course.remove', v, err => {
            err
              ? (Materialize.toast(err.reason, 3000, 'error-toast'),
                Meteor.call(
                  'logger',
                  formatText(err.message, Meteor.userId(), 'course-remove'),
                  'error',
                ))
              : Meteor.call('removeSearchData', v),
              err => {
                err
                  ? Materialize.toast(err.reason, 3000, 'error-toast')
                  : Meteor.call('insertDeleted', v, err => {
                      err
                        ? Materialize.toast(err.reason, 3000, 'error-toast')
                        : Materialize.toast(
                            `${count} ${name} successfully deleted`,
                            3000,
                            'success-toast',
                          );
                    });
              };
          });
        });
        break;

      case 'field':
        const name = target.course.value;
        const title_id = Session.get('title_id');
        // update.title'(id, title, sub)
        Meteor.call('update.title', title_id, table_title, sub_title, err => {
          err
            ? (Materialize.toast(err.reason, 3000, 'error-toast'),
              Meteor.call(
                'logger',
                formatText(err.message, Meteor.userId(), 'update-title'),
                'error',
              ))
            : Materialize.toast('Successfully updated the titles', 3000, 'success-toast');
        });
    }
    // close modal when done;
    this.setState({
      isOpen: false,
    });
  }

  saveTitle = ({ target: { value } }, type) => {
    switch (type) {
      case 'sub':
        this.setState({
          sub_title: value,
        });
        break;

      default:
        this.setState({
          table_title: value,
        });
        break;
    }
  };

  renderCourses() {
    let count = 1;
    const { courses } = this.props;
    if (!courses) {
      return '';
    }
    return courses.map(course => (
      <tr key={course._id} className="link-section">
        <td>{count++}</td>
        <td onClick={Courses.handleUrl.bind(this, course._id, course.details.year)}>
          {course.name}
        </td>
        <td>{course.createdAt.toDateString()}</td>
        <td>
          <a
            href=""
            className="fa fa-pencil"
            onClick={e =>
              this.toggleEditModal(
                'edit',
                course.details.year,
                course._id,
                course.name,
                course.code,
                course.createdBy,
                e,
              )
            }
          />
        </td>
        <td>
          <a
            href={`/dashboard/units/${course._id}&y=${course.details.year}`}
            className="fa fa-pencil"
          />
        </td>
        <td onClick={handleCheckboxChange.bind(this, course._id)}>
          <input type="checkbox" className={`filled-in chk chk${course._id}`} id={course._id} />
          <label />
        </td>
      </tr>
    ));
  }

  render() {
    const {
      isOpen,
      title,
      confirm,
      reject,
      modalType,
      name,
      code,
      year,
      table_title,
      sub_title,
    } = this.state;
    const { titles } = this.props;
    let new_title = '';
    let new_sub_title = '';
    if (titles) {
      new_title = titles.title;
      new_sub_title = titles.sub_title;
      Session.setPersistent({
        title_id: titles._id,
        course_title: new_title,
      });
    }
    return (
      <div>
        <MainModal
          show={isOpen}
          onClose={this.close}
          subFunc={this.handleSubmit}
          title={title}
          confirm={confirm}
          reject={reject}
        >
          {modalType === 'del' ? (
            <span />
          ) : modalType === 'field' ? (
            <div className="row">
              <div className="row">
                <div className="input-field col s12 m4">
                  <input
                    value={table_title}
                    placeholder={table_title}
                    name="course"
                    type="text"
                    className="validate"
                    onChange={e => this.saveTitle(e, 'title')}
                  />
                </div>
                <div className="input-field col s12 m4">
                  <input
                    value={`Edit ${table_title}`}
                    name="edit_course"
                    type="text"
                    className="validate"
                    readOnly
                  />
                </div>
                <div className="input-field col s12 m4">
                  <input
                    value={sub_title}
                    name="edit_course"
                    type="text"
                    className="validate"
                    onChange={e => this.saveTitle(e, 'sub')}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="input-field">
              <input
                placeholder={`Name of ${new_title}`}
                defaultValue={name}
                type="text"
                className="validate clear"
                required
                name="course"
              />
              <input
                placeholder={`${new_title} Code`}
                defaultValue={code}
                type="text"
                className="validate clear"
                required
                name="courseCode"
              />
              <input
                placeholder={`${new_title} Year eg: 1-12`}
                defaultValue={year}
                id="year"
                type="text"
                pattern="[1-9]"
                className="validate clear"
                required
                name="year"
                title={`${new_title} Year eg: 1-12`}
              />
            </div>
          )}
        </MainModal>

        <div className="col m9 s11">
          <div className="">
            <h4>
              {' '}
              <T>common.manage.manage</T> {new_title}
            </h4>{' '}
            {/* Add */}
          </div>
          <div className="row">
            <div className="col m3">
              <button
                className="btn red darken-3 fa fa-remove"
                onClick={e => this.toggleEditModal('del', e)}
              >
                {' '}
                <T>common.actions.delete</T>
              </button>
            </div>
            <div className="col m3">
              <a href="">
                <button
                  className="btn green darken-4 fa fa-plus"
                  onClick={e => this.toggleEditModal('add', e)}
                >
                  {' '}
                  <T>common.actions.new</T>
                </button>
              </a>
            </div>
          </div>

          <table className="highlight">
            <thead>
              <tr>
                <th>#</th>
                <th>{new_title}</th>
                <th>
                  {' '}
                  <T>common.actions.createdAt</T>
                </th>
                <th>{`Edit ${new_title}`}</th>
                <th>{new_sub_title}</th>
                <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                  <input type="checkbox" className="filled-in chk-all" readOnly />
                  <label>
                    {' '}
                    <T>common.actions.check</T>
                  </label>
                </th>
                <th>
                  <a
                    href=""
                    onClick={e => this.toggleEditModal('field', new_title, new_sub_title, e)}
                    className="fa fa-pencil"
                  />
                </th>
              </tr>
            </thead>
            <tbody>{this.renderCourses()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

Courses.propTypes = {
  courses: PropTypes.array.isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('searchdata');
  Meteor.subscribe('deleted');
  Meteor.subscribe('titles');
  Meteor.subscribe('courses');
  return {
    courses: _Courses.find({ createdBy: Meteor.userId() }).fetch(),
    titles: Titles.findOne({}),
  };
})(Courses);
