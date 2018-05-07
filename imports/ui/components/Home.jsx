import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Header from './layouts/Header.jsx';
import { _Programs } from '../../api/programs/programs';
import { _Courses } from '../../api/courses/courses';
import { _Units } from '../../api/units/units';
import { _School } from '../../api/schools/school';
import Unit from './content/Unit.jsx';
import Courses from './content/Courses.jsx';
import { FloatingButton } from './Utilities/Utilities.jsx';
import DataList from './Utilities/DataList.jsx';
import ImgSlider from '../components/layouts/ImageSlider';
import * as Config from '../../../config.json'; // make use of this to to decide what shows on the Home Page
import { Loader } from './Loader';
import ErrorBoundary from './ErrorBoundary';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.filters = {};
    this.state = {
      programId: null,
    };
  }

componentWillMount(){
 const users = Meteor.users.find({}).fetch();
 if (!users || users.length === 0 ) {
   FlowRouter.go('/setup');
 } else if(!Config.set){
   FlowRouter.go('/setup');
 }
}

  showCourses(year) {
    Session.set('programId', this.state.programId);
    Session.set('year', year);
  }

  filter(filter, e) {
    switch (filter) {
      case 'school':
        Session.set('schId', e.target.value);
        break;

      case 'program':
        Session.set('progId', e.target.value);
        break;
    }
  }

  getDataList(filter, name) {
    let data = null;
    let isShowData = false; // don't show data parsed to datalist in browser
    // const filter = 'schools'
    if (filter === 'school') {
      data = this.props.schools;
    } else if (filter === 'program') {
      isShowData = true;
      data = this.props.programs;
    } else if (filter === 'year') {
      data = [];
    } else {
      data = [];
    }

    if (data === undefined) {
      return;
    }

    return (
      <DataList
        showData={isShowData}
        options={data}
        name={filter}
        title={name}
        id={filter}
        change={this.filter.bind(this, filter)}
      />
    );
  }

  renderUnits() {
    let index = 0;
    const unitData = this.props.unit;
    if (unitData === undefined) {
      return null;
    }
    return unitData.map(unit => <Unit key={index++} unit={unit} />);
  }

  renderCourses() {
    let index = 0;
    const { courses } = this.props;
    if (courses === undefined) {
      return <span> No Courses </span>;
    } else if (courses.length === 0) {
      return <p> There are no Contents yet </p>;
    }
    return courses.map(cours => <Courses key={index++} course={cours} />);
  }

  render() {
    return (
      <ErrorBoundary>
        <div className="home-main">
          <div>
            <Header />
          </div>
          <div>{<ImgSlider />}</div>
          <div className="container ">
            <div className="row ">
              {Config.sch === true ? (
                <>
                  <div className="col m6 s6">{this.getDataList('school', 'School')}</div>

                  <div className="col m6 s6">{this.getDataList('program', 'Program')}</div>
                </>
              ) : (
                <span />
              )}

              {this.renderCourses()}
            </div>
            <FloatingButton />
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

Home.propTypes = {
  programs: PropTypes.array,
  unit: PropTypes.array,
  course: PropTypes.array,
  courses: PropTypes.array,
  extras: PropTypes.array,
  schools: PropTypes.array,
  subsReady: PropTypes.bool,
};

/**
 * @name getQuery
 * @returns {Object} query to fetch data from collection
 */
export function getQuery() {
  let query = {};
  const schoolId = Session.get('schId');
  const programId = Session.get('progId');
  const config = Config.sch;

  if (config && schoolId && !programId) {
    return {
      'details.schoolId': schoolId,
    };
  } else if (config && schoolId && programId) {
    return {
      'details.schoolId': schoolId,
      'details.programId': programId,
    };
  }
  return {};
}

export default withTracker(() => {
  Meteor.subscribe('units');
  let handle = Meteor.subscribe('courses');
  Meteor.subscribe('programs');
  Meteor.subscribe('slides');
  Meteor.subscribe('resources');
  Meteor.subscribe('schools');
  Meteor.subscribe('titles');

  if (!Config.sch) {
    return {
      courses: _Courses.find({}).fetch(),
    };
  } else if (Config.sec) {
    return {
      courses: _Courses.find({}).fetch(),
    };
  }

  return {
    courseReady: handle.ready(),
    unit: _Units.find().fetch(),
    course: _Courses
      .find(
        {},
        {
          fields: {
            name: 1,
            details: 1,
          },
        },
      )
      .fetch(),

    courses: _Courses
      .find(getQuery(), {
        fields: {
          name: 1,
          details: 1,
        },
      })
      .fetch(),

    programs: _Programs
      .find(
        {
          'details.schoolId': Session.get('schId'),
        },
        {
          fields: {
            name: 1,
            details: 1,
          },
        },
      )
      .fetch(),

    schools: _School.find().fetch(),
  };
})(Home);
