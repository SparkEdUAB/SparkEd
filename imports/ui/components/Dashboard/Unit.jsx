import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { _Units } from '../../../api/units/units';
import * as config from '../../../../config.json';

export class Unit extends Component {
  constructor() {
    super();
    this.state = {
      topics: [{ name: '' }],
      description: '',
      unitName: '',
    };
  }

  addTopic = () => {
    this.setState({
      topics: this.state.topics.concat([{ name: '' }]),
    });
  };

  removeTopic = index => () => {
    if (index === 0) {
      return false;
    }
    this.setState({
      topics: this.state.topics.filter((s, sidx) => index !== sidx),
    });
  };

  handleTopicChange = index => e => {
    const newTopics = this.state.topics.map((topic, sidx) => {
      if (index !== sidx) return topic;
      return { ...topic, name: e.target.value };
    });

    this.setState({
      topics: newTopics,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const courseId = FlowRouter.getParam('_id');
    const year = FlowRouter.getQueryParam('y');
    const unitId = new Meteor.Collection.ObjectID().valueOf();
    let count = 0;
    let details = {};
    const { topics, description, unitName } = this.state;
    details = {
      year,
      courseId,
    };
    // insert topic in collection from here 1 * 1

    const msg = `new course unit named ${unitName} has been added with ${count} topics`;
    Meteor.call(
      'unit.insert',
      unitId,
      unitName,
      count,
      description,
      details,
      err => {
        err
          ? Materialize.toast(err.reason, 4000, 'error-toast')
          : Meteor.call('insert.search', unitId, {}, unitName, 'unit', err => {
            err
              ? Materialize.toast(err.reason, 4000, 'error-toast')
              : Meteor.call(
                'insertNotification',
                msg,
                'unit',
                unitId,
                err => {
                  // eslint-disable-next-line
                      err
                    ? Materialize.toast(err.reason, 4000, 'error-toast')
                    : (this.setState({
                      topics: [{ name: '' }],
                      description: '',
                      unitName: '',
                    }),
                    Materialize.toast(
                      `Added ${unitName} successfully and ${count} topics`,
                      5000,
                      'success-toast',
                    ));
                },
              );
          });
      },
    );
    if (!topics.length) {
      return;
    }
    if (!config.isHighSchool) {
      // eslint-disable-next-line no-restricted-syntax
      for (const topic of topics) {
        // eslint-disable-line
        const { name } = topic;
        const _id = new Meteor.Collection.ObjectID().valueOf();

        Meteor.call(
          'topic.insert',
          _id,
          unitId,
          name,
          unitName,
          // details, this is temporaly removed
          err => {
            err
              ? Materialize.toast(err.reason, 4000, 'error-toast')
              : Meteor.call(
                'insert.search',
                _id,
                { unitId },
                name,
                'topic',
                err => {
                  // eslint-disable-next-line
                    err
                    ? Materialize.toast(err.reason, 4000, 'error-toast')
                    : '';
                },
              );
          },
        );
        count++;
      }
    }
  };

  getUnitName = ({ target: { value } }) => {
    this.setState({
      unitName: value,
    });
  };
  getDescription = ({ target: { value } }) => {
    this.setState({
      description: value,
    });
  };
  backToUnits = e => {
    e.preventDefault();
    return FlowRouter.go(`/dashboard/units/${FlowRouter.getParam('_id')}`);
  };
  render() {
    const { topics, description, unitName } = this.state;
    const name = Session.get('sub_unit_title');
    return (
      <Fragment>
        <div className="col m9 s11 ">
          <div className="card">
            <div className="card-panel">
              <div className="">
                <button
                  className="btn fa fa-arrow-left"
                  onClick={this.backToUnits}
                >
                  {` ${name}`}
                </button>
                <h5 className="center large">{`Add New ${name}`}</h5>
              </div>

              <form
                className="new-topic"
                name="new-topic"
                onSubmit={e => this.handleSubmit(e)}
              >
                <div className="input-field">
                  <input
                    type="text"
                    name="topic[]"
                    className="unit clear"
                    placeholder={`Add ${name}`}
                    value={unitName}
                    onChange={e => this.getUnitName(e)}
                    required
                  />
                </div>

                <div className="input-field">
                  <textarea
                    name="descr"
                    className="unitdesc clear materialize-textarea"
                    placeholder={`Add ${name} Description`}
                    value={description}
                    onChange={e => this.getDescription(e)}
                    required
                  />
                </div>
                {config.isHighSchool ? (
                  <span />
                ) : (
                  topics.map((topic, index) => (
                    <div className="topic " key={index}>
                      <input
                        type="text"
                        id={index}
                        placeholder={'Add Topic'}
                        value={topic.name}
                        onChange={this.handleTopicChange(index)}
                        className={`${index}`}
                        name="topic"
                        required
                      />
                    </div>
                  ))
                )}

                {config.isHighSchool ? (
                  <div className="row">
                    <span className="input-group-btn">
                      <button
                        className="btn fa fa-floppy-o pull-right s12"
                        role="submit"
                      >
                        {' '}
                        Save{' '}
                      </button>
                    </span>
                  </div>
                ) : (
                  <div className="row">
                    <span className="input-group-btn">
                      <button
                        type="button"
                        onClick={this.removeTopic(topics.length - 1)}
                        className="btn red darken-4 fa fa-minus s12"
                      />
                    </span>
                    <span className="input-group-btn">
                      <button
                        type="button"
                        onClick={this.addTopic}
                        className="btn green darken-4 fa fa-plus s12"
                      />
                    </span>
                    <span className="input-group-btn">
                      <button
                        className="btn fa fa-floppy-o pull-right s12"
                        role="submit"
                      >
                        {' '}
                        Save{' '}
                      </button>
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('topics');
  return { units: _Units.find({}).fetch() };
})(Unit);
