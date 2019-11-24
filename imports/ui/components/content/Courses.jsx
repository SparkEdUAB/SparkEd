import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';
import { _Courses } from '../../../api/courses/courses';
import { _Units } from '../../../api/units/units';
import { ThemeContext } from "../../containers/AppWrapper"; // eslint-disable-line

export const T = i18n.createComponent();

export class Courses extends Component {
  countUnits() {
    const { units } = this.props;
    if (!units) return null;
    return units;
  }
  static redirectToUnits(id, event) {
    event.preventDefault();
    FlowRouter.go(`/contents/${id}?ref=home`);
  }
  // improve card
  render() {
    const {
      course: { _id, name },
    } = this.props;
    return (
      <ThemeContext.Consumer>
        {({ state }) => (
          <div className={'col m6 s12 l4 '}>
            <div
              className="card darken-2 homeCardColor"
              style={{
                backgroundColor: state.isDark ? state.mainDark : state.main,
              }}
            >
              <div className="card-content">
                <span className={'card-title '}>
                  <h5>
                    <a
                      href={''}
                      onClick={Courses.redirectToUnits.bind(this, _id)}
                      id="cardListTitle"
                    >
                      {name}
                    </a>
                  </h5>
                </span>
                <span>
                  <span className="" />
                  <span className="">
                    <a href="" id="cardListTitle">
                      &#8667; # of <T>common.manage.unit</T> :{' '}
                      {this.countUnits()}
                    </a>
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}

Courses.propTypes = {
  course: PropTypes.object.isRequired,
  units: PropTypes.number,
};

export function checkPermissions() {
  return Meteor.user() ? Meteor.user().roles : undefined;
}

export default withTracker(params => {
  Meteor.subscribe('courses');
  Meteor.subscribe('units');

  return {
    courses: _Courses.findOne({}),
    units: _Units.find({ 'details.courseId': params.course._id }).count(),
  };
})(Courses);
