import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _Courses } from '../../../api/courses/courses';
import { _Topics } from '../../../api/topics/topics';

export class Unit extends Component {
  countTopics() {
    const { topics } = this.props;
    if (topics === undefined) {
      return null;
    }
    return topics;
  }

  courseName() {
    const { courses } = this.props;
    if (courses === undefined) {
      return null;
    }
    return courses.name;
  }

  render() {
    const { details: { courseId, year, programId } } = this.props.unit;
    return (
      <div
        className={`col m6 s12 l4 cse-unit ${courseId}yr${year}${programId}`}
        id={`r${this.props.unit._id}`}
        name={this.props.topics}
      >
        <div className="card blue darken-2 homeCardColor">
          <div className="card-content">
            {/* if the screen size is smaller then redirect to small view components */}
            <span className={'card-title '}>
              <h5>
                <a href={`/contents/${this.props.unit._id}?ref=home`} id="cardListTitle">
                  {this.props.unit.name}
                </a>
              </h5>
            </span>

            {checkPermissions() === undefined ? (
              <span>
                <span className="">
                  <h6>
                    <a href="" id="cardListTitle">
                      {' '}
                      &#8667; Under Course <span> {this.courseName()}</span>
                    </a>
                  </h6>
                </span>
                <span className="">
                  <a href="" id="cardListTitle">
                    {' '}
                    &#8667; # of Topics : {this.countTopics()}{' '}
                  </a>
                </span>
              </span>
            ) : (
              <span>
                <span className="">
                  <h6>
                    {' '}
                    <a
                      href={`/dashboard/units/${programId}?cs=${courseId}&y=${year}`}
                      id="cardListTitle"
                    >
                      {' '}
                      &#8667; Under Course <u> {this.courseName()}</u>{' '}
                    </a>
                  </h6>
                </span>
                <span className="">
                  <a href={`/dashBoard/edit_unit/${this.props.unit._id}`} id="cardListTitle">
                    {' '}
                    &#8667; # of Topics : {this.countTopics()}{' '}
                  </a>
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

// consider moving this component elsewhere and make the whole card clickable
export class ExtraResource extends Component {
  // make the whole card clickable
  static handleClickCard(courseId, resourceId, event) {
    event.preventDefault();
    FlowRouter.go(`/extra/view_resource/${courseId}?rs=${resourceId}`);

    return false;
  }
  render() {
    return (
      <div
        className={'col m6 s12 l4 homeCards cse-unit link-unit '}
        title={this.props.fileType}
        onClick={ExtraResource.handleClickCard.bind(
          this,
          this.props.courseId,
          this.props.resourceId,
        )}
      >
        <div className="card-panel homeCardColor-2 green lighten">
          <span className={'card-title '}>
            <h5>
              <a
                href={`/extra/view_resource/${this.props.courseId}?rs=${this.props.resourceId}`}
                id="cardListTitle"
              >
                {this.props.name}
              </a>
            </h5>
          </span>

          <span className="">
            <a href="" id="cardListTitle">
              {' '}
              &#8667; Type : {this.props.fileType}{' '}
            </a>
          </span>
        </div>
      </div>
    );
  }
}

export function checkPermissions() {
  return Meteor.userId() || undefined;
}

Unit.propTypes = {
  unit: PropTypes.object.isRequired,
  topics: PropTypes.number,
  courses: PropTypes.object,
};

export default withTracker(params => {
  Meteor.subscribe('topics');
  Meteor.subscribe('courses');

  return {
    topics: _Topics.find({ unitId: params.unit._id }).count(),
    courses: _Courses.findOne({ _id: params.unit.details.courseId }),
  };
})(Unit);
