import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { Session } from 'meteor/session';
import M from 'materialize-css';
import { withTracker } from 'meteor/react-meteor-data';
import { _Courses } from '../../api/courses/courses';
import { _Units } from '../../api/units/units';
import Courses from './content/Courses.jsx';
import { FloatingButton } from './Utilities/Utilities.jsx';
import ImgSlider from "../components/layouts/ImageSlider"; // eslint-disable-line
import * as Config from '../../../config.json';
import { Loader } from "./Loader"; // eslint-disable-line
import ErrorBoundary from "./ErrorBoundary"; // eslint-disable-line
import { ThemeContext } from "../containers/AppWrapper"; // eslint-disable-line
import { Mongo } from 'meteor/mongo';

const Topics = new Mongo.Collection('aggregatedTopics');

export class Home extends PureComponent {
  componentDidMount() {
    if (!Config.isConfigured) {
      FlowRouter.go('/setup');
    }
    M.AutoInit();
    Session.set('language', 'english');
  }

  renderCourses() {
    let index = 0;
    const { courses } = this.props;
    if (!courses) {
      return <span> No Courses </span>;
    } else if (courses.length === 0) {
      return <p className="center"> There are no contents yet </p>;
    }
    return courses.map(cours => <Courses key={index++} course={cours} />);
  }

  render() {
    const { courseReady } = this.props;
    // Meteor.call('aggregateTopics', (error, data) => {
    //   if (!error) {
    //     //  self.resources.set(r);
    //     console.log(data);
    //   } else {
    //     console.log(error);
    //   }
    // });
    return (
      <ErrorBoundary>
        <ThemeContext.Consumer>
          {({ state }) => (
            <Fragment>
              <ImgSlider isDark={state.isDark} />
              <div className="container ">
                <div className="row ">
                  <div className="input-field col s12">
                    <select
                      onChange={e => {
                        Session.set('language', e.target.value);
                      }}
                    >
                      <option value="" disabled defaultValue>
                        Choose your Language
                      </option>
                      <option value="english">English</option>
                      <option value="french">French</option>
                      <option value="ethiopian">Ethiopian</option>
                    </select>
                    <label>Language Options</label>
                  </div>
                </div>
                <div className="row ">
                  {courseReady ? this.renderCourses() : <Loader />}
                </div>
                <FloatingButton />
              </div>
            </Fragment>
          )}
        </ThemeContext.Consumer>
      </ErrorBoundary>
    );
  }
}

Home.propTypes = {
  unit: PropTypes.array,
  courses: PropTypes.array,
  subsReady: PropTypes.bool,
  courseReady: PropTypes.bool,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('courses');
  Meteor.subscribe('slides');
  Meteor.subscribe('topics');
  Meteor.subscribe('units');

  return {
    courseReady: handle.ready(),
    unit: _Units.find().fetch(),
    courses: _Courses
      .find(
        { 'details.language': Session.get('language') },
        {
          fields: {
            name: 1,
            details: 1,
          },
        },
      )
      .fetch(),
  };
})(Home);
