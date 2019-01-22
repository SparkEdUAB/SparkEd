import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ReactPaginate from 'react-paginate';
import i18n from 'meteor/universe:i18n';
import { References } from '../../../api/resources/resources';
import { _Courses } from '../../../api/courses/courses';
import { ExtraResource } from './Unit.jsx';

export const T = i18n.createComponent();

export class ReferenceLibrary extends Component {
  renderCourses() {
    if (this.props.courses === undefined) {
      return null;
    }
    return this.props.courses.map(course => (
      <SideMenu key={course._id} address={`/reference/${course._id}`} name={course.name} />
    ));
  }

  static renderResources(coll) {
    if (!coll) {
      return null;
    }
    return coll.map(res => (
      <ExtraResource
        key={res._id}
        resourceId={res._id}
        courseId={res.meta.courseId || 'extra'}
        name={res.name}
        fileType={res.ext}
      />
    ));
  }
  // eslint-disable-next-line
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
    const { selected } = data;
    const offset = Math.ceil(selected * Session.get('limit'));
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
    Session.set('limit', 10);
    return (
      <Fragment>
        <div className="row">
          <div className="col m2 s12 menu_simple">
            <ul className="item-container">
              <li className="hide-on-med-and-down">
                <a id="dashtweek" href="/reference" className="center">
                  <T>common.sidenav.resourceLibrary</T>
                </a>
              </li>
              {this.renderCourses()}
              {this.renderPagination()}
            </ul>
          </div>

          <div className="col m10 s12">
            {FlowRouter.getParam('_id') === undefined
              ? ReferenceLibrary.renderResources(this.props.extraResources)
              : ReferenceLibrary.renderResources(this.props.resources)}
          </div>
        </div>
      </Fragment>
    );
  }
}
// list item
export class SideMenu extends Component {
  render() {
    return (
      <li className={'link topic'}>
        <a className="side-list" href={this.props.address}>
          <i className="" />
          &nbsp; {this.props.name}
        </a>
      </li>
    );
  }
}

ReferenceLibrary.propTypes = {
  courses: PropTypes.array,
  extraResources: PropTypes.array,
  resources: PropTypes.array,
  count: PropTypes.number,
};
SideMenu.propTypes = {
  address: PropTypes.string,
  name: PropTypes.string,
};

export function getCourseId() {
  const courseId = FlowRouter.getParam('_id');

  return courseId;
}

export default withTracker(() => {
  Meteor.subscribe('programs');
  Meteor.subscribe('resources');
  Meteor.subscribe('courses');
  Meteor.subscribe('references');
  return {
    courses: _Courses.find({}, { skip: Session.get('skip'), limit: Session.get('limit') }).fetch(),
    resources: References.find({ 'meta.courseId': getCourseId() }).fetch(),
    extraResources: References.find({ 'meta.courseId': null }).fetch(),
    count: _Courses.find().count(),
  };
})(ReferenceLibrary);
