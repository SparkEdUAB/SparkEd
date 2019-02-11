/* eslint-disable no-unused-expressions */
/* eslint default-case: 0, no-case-declarations: 0 */
import React, { Component, Fragment } from 'react';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import { withTracker } from 'meteor/react-meteor-data';
import ReactPaginate from 'react-paginate';
import M from 'materialize-css';
import { _Units } from '../../../api/units/units';
import { _Topics } from '../../../api/topics/topics';
import {
  handleCheckboxChange,
  handleCheckAll,
  getCheckBoxValues,
} from '../Utilities/CheckBoxHandler.jsx';
import MainModal from '../../../ui/modals/MainModal'; // eslint-disable-line
import { formatText } from '../../utils/utils';
import { ThemeContext } from '../../containers/AppWrapper'; // eslint-disable-line

export const T = i18n.createComponent();
export class EditUnits extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isOpen: false,
      modalIdentifier: '', // Topic Id
      modalType: '', // Add or Edit
      title: '', // Add Topic or Edit Topic
      name: '',
      confirm: '',
      reject: '',
      ids: [],
    };
    Session.set('limit', 5);
    Session.set('skip', 0);
  }

  // close the modal, this was separate to ease the reusability of the modal
  closeModal = () => {
    this.setState({
      isOpen: false,
      modalIdentifier: '', // Topic Id
      modalType: '', // Add or Edit
      title: '', // Add Topic or Edit Topic
      name: '',
      confirm: '',
      reject: '',
    });
  };

  // ide => modalType, id=> courseId

  toggleEditModal = (ide, id = '', name = '') => {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'content-manager'])) {
      M.toast({
        html: '<span>Only Admins and Content-Manager can edit Topics</span>',
        classes: 'red',
      });
      return;
    }
    this.name = name;
    switch (ide) {
      case 'edit':
        this.setState({
          modalIdentifier: id,
          modalType: ide,
          title: 'Edit The Topic',
          name: this.name,
          confirm: 'Save',
          reject: 'Close',
        });
        break;

      case 'add':
        this.setState({
          modalIdentifier: id,
          modalType: ide,
          title: 'Add New Topic',
          confirm: 'Save',
          reject: 'Close',
        });
        break;

      case 'del':
        const topics = getCheckBoxValues('chk');
        const count = topics.length;
        const name = count > 1 ? 'topics' : 'topic';
        if (count < 1) {
          M.toast({
            html: '<span>Please check at least one topic</span>',
            classes: 'red',
          });
          return;
        }
        this.setState({
          modalIdentifier: id,
          modalType: ide,
          title: `Are you sure to delete ${count} ${name}`,
          confirm: 'Yes',
          reject: 'No',
          ids: topics,
        });

        break;
    }
    // close the modal;
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  };

  handleUrl(id) {
    Session.setPersistent('topicId', id);
    FlowRouter.go(`/dashboard/edit_resources/${id}`);
  }

  renderTopics() {
    let count = 1;
    const { topics } = this.props;
    // const unitId = FlowRouter.getParam('_id');
    if (!topics) {
      return null;
    }
    return topics.map(topic => (
      <tr key={topic._id} className="link-section">
        <td>{count++}</td>
        <td onClick={this.handleUrl.bind(this, topic._id)}>{topic.name}</td>
        <td>{topic.createdAt.toDateString()}</td>
        <td>
          <a
            href=""
            onClick={e =>
              this.toggleEditModal('edit', topic._id, topic.name, e)
            }
            className="fa fa-pencil"
          />
        </td>
        <td>
          <a
            className="fa fa-pencil"
            href={`/dashboard/edit_resources/${topic._id}`}
          />
        </td>
        <td onClick={handleCheckboxChange.bind(this, topic._id)}>
          <label htmlFor={topic._id}>
            <input
              type="checkbox"
              id={topic._id}
              className={`chk chk${topic._id}`}
            />
            <span />
          </label>
        </td>
      </tr>
    ));
  }

  handleSubmit(event) {
    event.preventDefault();
    const { modalIdentifier, modalType, ids } = this.state;
    const unitId = FlowRouter.getParam('_id');
    const _id = new Meteor.Collection.ObjectID().valueOf();
    const {
      unit: { name },
    } = this.props;
    let newTopic;
    const topics = [
      {
        name: newTopic,
        _id: modalIdentifier,
      },
    ];
    // insert search index

    switch (modalType) {
      case 'add':
        // insert a topic
        newTopic = event.target.topic.value;
        Meteor.call('singletopic.insert', _id, unitId, newTopic, name, err => {
          err
            ? (M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' }),
            Meteor.call(
              'logger',
              formatText(err.message, Meteor.userId(), 'topic-add'),
              'error',
            ))
            : Meteor.call(
              'insert.search',
              _id,
              {
                unitId,
              },
              newTopic,
              'topic',
              err => {
                  // eslint-disable-line
                err
                  ? M.toast({
                    html: `<span>${err.reason}</span>`,
                    classes: 'red',
                  })
                  : M.toast({ html: `Successfully added ${newTopic}` });
              },
            );
        });

        // Meteor.call('generateSyncTopics', topics);
        break;
      case 'edit':
        newTopic = event.target.topic.value;
        // update the topic
        Meteor.call('topic.update', modalIdentifier, newTopic, err => {
          err
            ? (M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' }),
            Meteor.call(
              'logger',
              formatText(err.message, Meteor.userId(), 'topic-edit'),
              'error',
            ))
            : Meteor.call('updateSearch', modalIdentifier, newTopic, err => {
              err
                ? M.toast({
                  html: `<span>${err.reason}</span>`,
                  classes: 'red',
                })
                : M.toast({
                  html: `<span>Successfully updated ${newTopic}</span>`,
                });
            });
        });
        break;
      // delete topic
      case 'del':
        let count = 0;
        const topics = ids;
        topics.forEach((v, k, arra) => {
          count += 1;
          Meteor.call('topic.remove', v, err => {
            err
              ? (M.toast({
                html: `<span>${err.reason}</span>`,
                classes: 'red',
              }),
              Meteor.call(
                'logger',
                formatText(err.message, Meteor.userId(), 'topic-remove'),
                'error',
              ))
              : Meteor.call('removeSearchData', v, err => {
                err
                  ? M.toast({
                    html: `<span>${err.reason}</span>`,
                    classes: 'red',
                  })
                  : Meteor.call('removeSearchData', v, err => {
                    err
                      ? M.toast({
                        html: `<span>${err.reason}</span>`,
                        classes: 'red',
                      })
                      : M.toast({
                        html: `<span>${count} topics successfully deleted</span>`,
                      });
                  });
              });
          });
        });

        break;
    }
    // close the modal when done;
    this.closeModal();
  }

  backToUnits = (programId, courseId) => {
    // event.preventDefault();
    FlowRouter.go(`/dashboard/units/${programId}?cs=${courseId}`);
  };

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
    if (!count || count <= Session.get('limit')) {
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
    let { unit } = this.props;
    const limit = Session.get('limit');
    if (!unit) {
      return null;
    }
    unit = unit;
    const {
      details: { courseId, programId },
    } = unit;

    return (
      <ThemeContext.Consumer>
        {
          ({ state }) => (
            <Fragment>
                <MainModal
                  show={this.state.isOpen}
                  onClose={this.closeModal}
                  subFunc={this.handleSubmit}
                  title={this.state.title}
                  confirm={this.state.confirm}
                  reject={this.state.reject}
                >
                  {this.state.modalType === 'del' ? (
                    ''
                  ) : (
                    <div className="input-field">
                      <input
                        placeholder="Name of Topic"
                        type="text"
                        defaultValue={this.state.name}
                        className="validate clear"
                        style={{
                          color: state.isDark ? '#F5FAF8' : '#000000',
                        }}
                        required
                        name="topic"
                      />
                    </div>
                  )}
                </MainModal>
                <div className="m1" />
                <div className="col m9 s11"
                      style={{
                        backgroundColor: state.isDark ? state.mainDark : '#FFFFFF',
                        color: state.isDark ? '#F5FAF8' : '#000000',
                      }}
                  >
                  <div className="">
                    <h4>{unit.name}</h4>
                  </div>
                  <div className="row ">
                    <div className="col m3 ">
                      <button
                        className="btn grey darken-3 fa fa-angle-left"
                        onClick={e => this.backToUnits(programId, courseId, e)}
                      >
                        <a href={''} className="white-text">
                          {` ${Session.get('unit_title') || 'Back'}`}
                        </a>
                      </button>
                    </div>
                    <div className="col m3 ">
                      <button
                        className="btn red darken-3  "
                        onClick={e => this.toggleEditModal('del', e)}
                      >
                        {' '}
                        <T>common.actions.delete</T>
                      </button>
                    </div>
                    <div className="col m3">
                      <a href="">
                        <button
                          className="btn green darken-4  "
                          onClick={e => this.toggleEditModal('add', e)}
                        >
                          {' '}
                          <T>common.actions.add</T>
                        </button>
                      </a>
                    </div>
                    <div className="col m3">
                      Units displayed
                      <div className="row">
                        <a
                          className="col s2 link"
                          onClick={e => this.getEntriesCount(e, 5)}
                        >
                          <u>{limit === 5 ? <b>5</b> : 5}</u>
                        </a>
                        <a
                          className="col s2 link"
                          onClick={e => this.getEntriesCount(e, 10)}
                        >
                          <u>{limit === 10 ? <b>10</b> : 10}</u>
                        </a>
                        <a
                          className="col s2 link"
                          onClick={e => this.getEntriesCount(e, 20)}
                        >
                          <u>{limit === 20 ? <b>20</b> : 20}</u>
                        </a>
                      </div>
                    </div>
                  </div>

                  <table className="highlight">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{`${Session.get('sub_unit_title') || 'Topics'}`}</th>
                        <th>
                          {' '}
                          <T>common.actions.createdAt</T>
                        </th>
                        <th>Edit Topics</th>
                        <th>
                          {' '}
                          <T>common.manage.resources</T>
                        </th>
                        <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                          <label>
                            <input type="checkbox" className=" chk-all" readOnly />{' '}
                            <T>common.actions.check</T>
                          </label>
                        </th>
                      </tr>
                    </thead>
                    <tbody>{this.renderTopics()}</tbody>
                  </table>
                  {/* {this.renderPagination()} */}
                </div>
            </Fragment>
          )
        }
      </ThemeContext.Consumer>
    );
  }
}

export function getUnitId() {
  const unitId = FlowRouter.getParam('_id');
  return unitId;
}

export default withTracker(() => {
  Meteor.subscribe('units');
  Meteor.subscribe('topics');
  return {
    topics: _Topics
      .find(
        {
          unitId: getUnitId(),
        },
        { skip: Session.get('skip'), limit: Session.get('limit') },
      )
      .fetch(),
    unit: _Units.findOne({ _id: getUnitId() }),
    count: _Topics
      .find({
        unitId: getUnitId(),
      })
      .count(),
  };
})(EditUnits);
