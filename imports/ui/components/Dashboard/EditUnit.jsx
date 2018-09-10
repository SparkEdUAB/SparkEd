import React, { Component } from 'react';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import ReactPaginate from 'react-paginate';
import { _Units } from '../../../api/units/units';
import { _Topics } from '../../../api/topics/topics';
import { withTracker } from 'meteor/react-meteor-data';
import {
  handleCheckboxChange,
  handleCheckAll,
  getCheckBoxValues,
} from '../Utilities/CheckBoxHandler.jsx';
import MainModal from '../../../ui/modals/MainModal';
import { formatText } from '../../utils/utils';

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
      Materialize.toast('Only Admins and Content-Manager can edit Topics', 4000);
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
          Materialize.toast('Please check at least one topic', 4000);
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
    const topics = this.props.topics;
    const unitId = FlowRouter.getParam('_id');
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
            onClick={e => this.toggleEditModal('edit', topic._id, topic.name, e)}
            className="fa fa-pencil"
          />
        </td>
        <td>
          <a className="fa fa-pencil" href={`/dashboard/edit_resources/${topic._id}`} />
        </td>
        <td onClick={handleCheckboxChange.bind(this, topic._id)}>
          <input type="checkbox" className={' filled-in chk chk' + topic._id} id={topic._id} />
          <label />
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
    //insert search index

    switch (modalType) {
      case 'add':
        // insert a topic
        newTopic = event.target.topic.value;
        Meteor.call('singletopic.insert', _id, unitId, newTopic, name, err => {
          err
            ? (Materialize.toast(err.reason, 3000, 'error-toast'),
              Meteor.call('logger', formatText(err.message, Meteor.userId(), 'topic-add'), 'error'))
            : Meteor.call(
                'insert.search',
                _id,
                {
                  unitId,
                },
                newTopic,
                'topic',
                err => {
                  err
                    ? Materialize.toast(err.reason, 4000, 'error-toast')
                    : Materialize.toast(`Successfully added ${newTopic}`, 4000, 'success-toast');
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
            ? (Materialize.toast(err.reason, 3000, 'error-toast'),
              Meteor.call(
                'logger',
                formatText(err.message, Meteor.userId(), 'topic-edit'),
                'error',
              ))
            : Meteor.call('updateSearch', modalIdentifier, newTopic, err => {
                err
                  ? Materialize.toast(err.reason, 4000, 'error-toast')
                  : Materialize.toast(`Successfully updated ${newTopic}`, 4000, 'success-toast');
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
              ? (Materialize.toast(err.reason, 3000, 'error-toast'),
                Meteor.call(
                  'logger',
                  formatText(err.message, Meteor.userId(), 'topic-remove'),
                  'error',
                ))
              : Meteor.call('removeSearchData', v, err => {
                  err
                    ? Materialize.toast(err.reason, 4000, 'error-toast')
                    : Meteor.call('removeSearchData', v, err => {
                        err
                          ? Materialize.toast(err.reason, 4000, 'error-toast')
                          : Materialize.toast(
                              `${count} topics successfully deleted`,
                              4000,
                              'success-toast',
                            );
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
    let selected = data.selected;
    let offset = Math.ceil(selected * Session.get('limit'));
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
    let {
      details: { courseId, programId },
    } = unit;

    return (
      <div>
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
                required
                name="topic"
              />
            </div>
          )}
        </MainModal>
        <div className="col m9 s11">
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
                className="btn red darken-3 fa fa-remove "
                onClick={e => this.toggleEditModal('del', e)}
              >
                {' '}
                <T>common.actions.delete</T>
              </button>
            </div>
            <div className="col m3">
              <a href="">
                <button
                  className="btn green darken-4 fa fa-plus "
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
                <a className="col s2 link" onClick={e => this.getEntriesCount(e, 5)}>
                  <u>{limit === 5 ? <b>5</b> : 5}</u>
                </a>
                <a className="col s2 link" onClick={e => this.getEntriesCount(e, 10)}>
                  <u>{limit === 10 ? <b>10</b> : 10}</u>
                </a>
                <a className="col s2 link" onClick={e => this.getEntriesCount(e, 20)}>
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
                  <input type="checkbox" className="filled-in chk-all" readOnly />
                  <label>
                    {' '}
                    <T>common.actions.check</T>
                  </label>
                </th>
              </tr>
            </thead>
            <tbody>{this.renderTopics()}</tbody>
          </table>
        {/* {this.renderPagination()} */}
        </div>
      </div>
    );
  }
}

export function getUnitId() {
  let unitId = FlowRouter.getParam('_id');
  return unitId;
}

export default withTracker(() => {
  Meteor.subscribe('units');
  Meteor.subscribe('topics');
  return {
    topics: _Topics
      .find({
        unitId: getUnitId(),
        createdBy: Meteor.userId(),
      },
      { skip: Session.get('skip'), limit: Session.get('limit') },
      )
      .fetch(),
    unit: _Units.findOne({ _id: getUnitId() }),
    count: _Topics
      .find({
        unitId: getUnitId(),
        createdBy: Meteor.userId(),
      }, )
      .count(),
  };
})(EditUnits);
