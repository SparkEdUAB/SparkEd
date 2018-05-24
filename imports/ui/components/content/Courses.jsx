import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _Courses } from '../../../api/courses/courses';
import { _Programs } from '../../../api/programs/programs';
import { _Units } from '../../../api/units/units';
import * as config from '../../../../config.json';

export class Courses extends Component {
  countUnits() {
    const { units } = this.props;
    if (units === undefined) {
      return null;
    }
    return units;
  }

  ProgramName() {
    const { programs } = this.props;
    if (programs === undefined) {
      return null;
    }
    return programs.name;
  }

  static redirectToUnits(id, event) {
    event.preventDefault();
    if (config.isHighScool) {
      FlowRouter.go(`/contents/${id}?ref=home`);
    } else {
      FlowRouter.go(`/course_content/${id}?ref=home`);
    }
  }
  // improve card
  render() {
    const {
      course: { _id, name },
    } = this.props;
    return (
      <div className={'col m6 s12 l4 '}>
        <div className="card blue darken-2 homeCardColor">
          <div className="card-content">
            <span className={'card-title '}>
              <h5>
                <a href={''} onClick={Courses.redirectToUnits.bind(this, _id)} id="cardListTitle">
                  {name}
                </a>
              </h5>
            </span>
            {checkPermissions() === undefined ? (
              <span>
                <span className="" />
                <span className="">
                  <a href="" id="cardListTitle">
                    &#8667; # of Units : {this.countUnits()}
                  </a>
                </span>
              </span>
            ) : (
              <span>
                <span className="" />
                <span className="">
                  <a href="" id="cardListTitle">
                    &#8667; # of Units : {this.countUnits()}
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

Courses.propTypes = {
  course: PropTypes.object.isRequired,
  units: PropTypes.number,
  programs: PropTypes.object,
};

export function checkPermissions() {
  return Meteor.user() ? Meteor.user().roles : undefined;
}

export default withTracker((params) => {
  Meteor.subscribe('programs');
  Meteor.subscribe('courses');
  Meteor.subscribe('searchUnits', params.course._id);

  return {
    courses: _Courses.findOne({}),
    units: _Units.find({ 'details.courseId': params.course._id }).count(),
    programs: _Programs.findOne({ _id: params.course.details.programId }),
  };
})(Courses);
