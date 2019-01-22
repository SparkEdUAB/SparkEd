/* eslint-disable no-unused-expressions */
// TODO:  properly route back to the programs, can do this by setting the id in session
/* eslint default-case: 0, no-case-declarations: 0 */
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import i18n from 'meteor/universe:i18n';
import M from 'materialize-css';
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
      language: '',
      name: '',
      owner: '',
      ids: [],
      tableTitle: 'Course',
      subTitle: 'Unit',
      lang: 'English',
    };
    Session.set('language', 'english');
  }

  componentDidMount() {
    M.AutoInit();
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
  toggleEditModal = (
    ide,
    yr = '',
    id = '',
    name = '',
    code = '',
    owner = '',
  ) => {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'content-manager'])) {
      M.toast({
        html: '<span>Only Admins and Content-Manager can edit Courses</span>',
        classes: 'red',
      });
      return;
    }
    this.name = name;
    this.code = code;
    this.language = yr;
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
          language: this.language,
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
          M.toast({ html: '<span>Please check atleast one course</span>', classes: 'red' });
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
          tableTitle: yr,
          subTitle: id,
        });
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  // route to whats contained in the course
  static handleUrl(id, language, event) {
    event.preventDefault();
    Session.setPersistent('courseIde', id);
    FlowRouter.go(`/dashboard/units/${id}?y=${language}`);
  }

  // Adding new Course
  handleSubmit(e) {
    e.preventDefault();
    let course;
    let courseCode;
    let language;
    let details;
    const { target } = e;
    const {
      modalType,
      modalIdentifier,
      ids,
      owner,
      tableTitle,
      subTitle,
    } = this.state;

    switch (modalType) {
      case 'add':
        course = target.course.value;
        courseCode = target.courseCode.value;
        language = target.language.value;
        details = { language };
        const reference = config.isHighSchool ? 'subject' : 'course';
        const courseId = new Meteor.Collection.ObjectID().valueOf();
        Meteor.call(
          'course.add',
          courseId,
          course,
          courseCode,
          details,
          err => {
            err
              ? (M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' }),
              Meteor.call(
                'logger',
                formatText(err.message, Meteor.userId(), 'course-add'),
                'error',
              ))
              : Meteor.call(
                'insert.search',
                courseId,
                { courseId },
                course,
                reference,
                error => {
                  error
                    ? M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' })
                    : M.toast({ html: `<span>Successfully added ${course} </span>` });
                },
              );
          },
        );

        break;

      case 'edit':
        course = target.course.value;
        courseCode = target.courseCode.value;
        language = target.language.value;
        Meteor.call(
          'course.edit',
          modalIdentifier,
          course,
          courseCode,
          language,
          owner,
          err => {
            err
              ? (M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' }),
              Meteor.call(
                'logger',
                formatText(err.message, Meteor.userId(), 'course-edit'),
                'error',
              ))
              : Meteor.call('updateSearch', modalIdentifier, course, err => {
                err
                  ? M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' })
                  : M.toast({ html: `<span>${course} Successfully updated</span>` });
              });
          },
        );
        break;

      case 'del':
        let count = 0;
        const courses = ids;
        courses.forEach((v, k, arra) => {
          count += 1;
          const name = count > 1 ? 'courses' : 'course';
          Meteor.call('course.remove', v, err => {
            err
              ? (M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' }),
              Meteor.call(
                'logger',
                formatText(err.message, Meteor.userId(), 'course-remove'),
                'error',
              ))
              : Meteor.call(
                'removeSearchData', v,
                err => { // eslint-disable-line
                  err
                    ? M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' })
                    : Meteor.call('insertDeleted', v, err => {
                      err
                        ? M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' })
                        : M.toast({ html: `${count} ${name} successfully deleted` });
                    });
                },
              );
          });
        });
        break;
        // eslint-disable-next-line
      case 'field':
        const name = target.course.value;
        const title_id = Session.get('title_id');
        // update.title'(id, title, sub)
        Meteor.call('update.title', title_id, tableTitle, subTitle, err => {
          err
            ? (M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' }),
            Meteor.call(
              'logger',
              formatText(err.message, Meteor.userId(), 'update-title'),
              'error',
            ))
            : M.toast({ html: '<span>Successfully updated the titles</span>' });
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
          subTitle: value,
        });
        break;

      default:
        this.setState({
          tableTitle: value,
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
        <td
          onClick={Courses.handleUrl.bind(
            this,
            course._id,
            course.details.language,
          )}
        >
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
                course.details.language,
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
            href={`/dashboard/units/${course._id}&y=${course.details.language}`}
            className="fa fa-pencil"
          />
        </td>
        <td onClick={handleCheckboxChange.bind(this, course._id)}>
        <label htmlFor={course._id}>
          <input type="checkbox" id={course._id} className={`chk chk${course._id}`} />
          <span/>
        </label>
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
      language,
      tableTitle,
      subTitle,
      lang,
    } = this.state;
    const { titles } = this.props;
    let newTitle = '';
    let newSubTitle = '';
    if (titles) {
      newTitle = titles.title;
      newSubTitle = titles.sub_title;
      Session.setPersistent({
        title_id: titles._id,
        course_title: newTitle,
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
                    value={tableTitle}
                    placeholder={tableTitle}
                    name="course"
                    type="text"
                    className="validate"
                    onChange={e => this.saveTitle(e, 'title')}
                  />
                </div>
                <div className="input-field col s12 m4">
                  <input
                    value={`Edit ${tableTitle}`}
                    name="edit_course"
                    type="text"
                    className="validate"
                    readOnly
                  />
                </div>
                <div className="input-field col s12 m4">
                  <input
                    value={subTitle}
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
                placeholder={`Name of ${newTitle}`}
                defaultValue={name}
                type="text"
                className="validate clear"
                required
                name="course"
              />
              <input
                placeholder={`${newTitle} Code`}
                defaultValue={code}
                type="text"
                className="validate clear"
                required
                name="courseCode"
              />
              <input
                placeholder={`${newTitle} Language`}
                defaultValue={language}
                id="language"
                type="text"
                className="validate clear"
                required
                name="language"
              />
            </div>
          )}
        </MainModal>
        <div className='m1' />
        <div className="col m9 s11">
          <div className="">
            <h4>
              {' '}
              <T>common.manage.manage</T> {newTitle}
            </h4>{' '}
            {/* Add */}
          </div>
          <div className="row">
            <div className="col m2">
              <button
                className="btn red darken-4 "
                onClick={e => this.toggleEditModal('del', e)}
              >
                {' '}
                <T>common.actions.delete</T>
              </button>
            </div>
            <div className="col m2">
              <a href="">
                <button
                  className="btn green darken-4 "
                  onClick={e => this.toggleEditModal('add', e)}
                >
                  {' '}
                  <T>common.actions.new</T>
                </button>
              </a>
            </div>
            <div className="col m5">
            {/* <div className="row"> */}
              <div className="col s12">
                <ul className="tabs">
                  <li className="tab col s3"><a className="teal-text" href="#test1" onClick={() => Session.set('language', 'english') }> English</a></li>
                  <li className="tab col s3"><a className="teal-text" href="#test2" onClick={() => Session.set('language', 'french') }> French</a></li>
                  <li className="tab col s3"><a className="teal-text" href="#test4" onClick={() => Session.set('language', 'ethiopian') }> Ethiopia</a></li>
                </ul>
              </div>
            {/* </div> */}
            </div>
          </div>

          <table className="highlight">
            <thead>
              <tr>
                <th>#</th>
                <th>{newTitle}</th>
                <th>
                  {' '}
                  <T>common.actions.createdAt</T>
                </th>
                <th>{`Edit ${newTitle}`}</th>
                <th>{newSubTitle}</th>
                <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                <label>
                  <input
                    type="checkbox"
                    className=" chk-all"
                    readOnly
                  />
                    <T>common.actions.check</T>
                  </label>
                </th>
                <th>
                  <a
                    href=""
                    onClick={e =>
                      this.toggleEditModal('field', newTitle, newSubTitle, e)
                    }
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
  titles: PropTypes.object,
};

export default withTracker(() => {
  Meteor.subscribe('searchdata');
  Meteor.subscribe('deleted');
  Meteor.subscribe('titles');
  Meteor.subscribe('courses');
  return {
    courses: _Courses
      .find({ 'details.language': Session.get('language') })
      .fetch(),
    titles: Titles.findOne({}),
  };
})(Courses);
