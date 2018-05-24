import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { _Units } from '../../../api/units/units';
import { _Topics } from '../../../api/topics/topics';
import Topics from './Topics.jsx';
import Resourcesss from './Resources.jsx';
import { insertStatistics } from '../Statistics/Statistics.jsx';
import { FloatingButton } from '../Utilities/Utilities.jsx';
import * as config from '../../../../config.json';
import { Titles } from '../../../api/settings/titles';

export class ContentsApp extends Component {
  constructor(props) {
    super(props);
    this.computation = '';
  }

  saveUsage() {
    const ref = FlowRouter.getQueryParam('ref');
    if (!ref || this.props.unit === undefined) {
      return;
    }
    if (!Meteor.user()) {
      return;
    }
    const user = Meteor.user();
    const { _id } = user;
    const id = FlowRouter.getParam('_id');
    const material = this.props.unit.name;
    const urlData = FlowRouter.current();
    const url = urlData.path;
    const date = new Date();
    const page = 'UNIT';
    const {
      profile: { stats },
    } = user;
    const data = {
      id,
      material,
      url,
      page,
      user: _id,
      date,
      stats,
    };
    insertStatistics(data);
  }

  componentWillUnmount() {
    this.computation.stop();
    this._mounted = false;
  }

  componentDidMount() {
    this._mounted = true;
    this.saveUsage(); // set
    Session.set('sectionId', FlowRouter.getParam('_id'));
    const self = this;
    this.computation = Tracker.autorun(() => {
      FlowRouter.watchPathChange();
      if (!this._mounted) {
        self.forceUpdate();
      }
    });
    window.scrollTo(0, 0);
  }

  render() {
    let unitName = '';
    let topicName = '';
    let desc = '';
    let title = '';
    const { unit, topic, titles } = this.props;
    if (unit && titles) {
      unitName = unit.name;
      desc = unit.unitDesc;
      title = titles.title;
    }
    return (
      <Fragment>
        <div className="row">
          <div className=" unit-container">
            <h4 className="center unit-name">{unitName}</h4>
            <div className="container">
              <p className="center">{desc}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col s12 m4 l3 topics-container">
            <h6 className="center">{config.isHighScool ? title : 'Topics'}</h6>
            <Topics unitId={getUnitId()} />
          </div>
          <div className="col s12 m8 l9">
            <h5 className="center">{topicName}</h5>
            <Resourcesss topicId={getTopicId()} />
          </div>
        </div>
        <>
          <FloatingButton />
        </>
      </Fragment>
    );
  }
}
ContentsApp.propTypes = {
  unit: PropTypes.object,
  topic: PropTypes.object,
};

export function getUnitId() {
  return FlowRouter.getParam('_id');
}

// in high-isHighScool grab the unitId
export function getTopicId() {
  if (config.isHighScool) {
    topicId = FlowRouter.getQueryParam('rs');
    topics = _Units.findOne({ 'details.courseId': FlowRouter.getParam('_id') });
  } else {
    topicId = FlowRouter.getQueryParam('rs');
    topics = _Topics.findOne({ unitId: FlowRouter.getParam('_id') });
  }

  if (topicId === undefined && topics !== undefined) {
    return topics._id;
  } else if (topics === undefined) {
    return '1';
  }
  return topicId;
}

export default withTracker(() => {
  Meteor.subscribe('units');
  Meteor.subscribe('resourcess');
  Meteor.subscribe('topics');
  Meteor.subscribe('titles');
  if (config.isHighScool) {
    return {
      unit: _Units.findOne({ _id: getTopicId() }),
      titles: Titles.findOne({}),
    };
  }
  return {
    titles: Titles.findOne({}),
    unit: _Units.findOne({ _id: getUnitId() }),
    topic: _Topics.findOne({ _id: getTopicId(), unitId: getUnitId() }),
  };
})(ContentsApp);
