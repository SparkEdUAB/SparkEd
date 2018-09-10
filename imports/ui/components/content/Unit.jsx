import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _Courses } from '../../../api/courses/courses';
import { _Topics } from '../../../api/topics/topics';
import { ThemeContext } from '../../containers/AppWrapper';

export class Unit extends Component {
  countTopics() {
    const { topics } = this.props;
    if (!topics) {
      return null;
    }
    return topics;
  }

  courseName() {
    const { courses } = this.props;
    if (!courses) {
      return null;
    }
    return courses.name;
  }

  render() {
    const {
      details: { courseId, year, programId },
      name,
      _id,
    } = this.props.unit;
    const { topics } = this.props;
    return (
      <ThemeContext.Consumer>
        {color => (
          <div
            className={`col m6 s12 l4 cse-unit ${courseId}yr${year}${programId}`}
            id={`r${_id}`}
            name={topics}
          >
            <div className="card darken-2 homeCardColor" style={{ backgroundColor: color.main }}>
              <div className="card-content">
                {/* if the screen size is smaller then redirect to small view components */}
                <span className={'card-title '}>
                  <h5>
                    <a href={`/contents/${_id}?ref=home`} id="cardListTitle">
                      {name}
                    </a>
                  </h5>
                </span>

                {!checkPermissions() ? (
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
                      <a href={`/dashBoard/edit_unit/${_id}`} id="cardListTitle">
                        {' '}
                        &#8667; # of Topics : {this.countTopics()}{' '}
                      </a>
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}

// consider moving this component elsewhere and make the whole card clickable
export class ExtraResource extends Component {
  static handleClickCard(courseId, resourceId, event) {
    event.preventDefault();
    FlowRouter.go(`/extra/view_resource/${courseId}?rs=${resourceId}`);
    return false;
  }
  render() {
    const {
      courseId, resourceId, name, fileType,
    } = this.props;
    return (
      <div
        className={'col m6 s12 l4 homeCards cse-unit link-unit '}
        title={fileType}
        onClick={ExtraResource.handleClickCard.bind(this, courseId, resourceId)}
      >
        <div className="card-panel homeCardColor-2 teal">
          <span className={'card-title '}>
            <h5>
              <a href={`/extra/view_resource/${courseId}?rs=${resourceId}`} id="cardListTitle">
                {name}
              </a>
            </h5>
          </span>

          <span className="">
            <a href="" id="cardListTitle">
              {' '}
              &#8667; Type : {fileType}{' '}
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

ExtraResource.propTypes = {
  courseId: PropTypes.string.isRequired,
  resourceId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
};

export default withTracker((params) => {
  Meteor.subscribe('topics');
  Meteor.subscribe('courses');

  return {
    topics: _Topics.find({ unitId: params.unit._id }).count(),
    courses: _Courses.findOne({ _id: params.unit.details.courseId }),
  };
})(Unit);
