import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import M from "materialize-css";
import ReactPaginate from "react-paginate";
import { Session } from "meteor/session";
import { _Topics } from "../../../api/topics/topics";
import { insertStatistics } from "../Statistics/Statistics.jsx";
import { setActiveItem } from "../Utilities/Utilities.jsx";
import * as config from "../../../../config.json";
import { _Units } from "../../../api/units/units";

export class Topics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topicName: "",
      units: []
    };
    Session.set("limit", 15);
  }

  componentWillUnmount() {
    Session.set({
      limit: 0,
      skip: 0
    });
  }
  getPageCount() {
    const { count } = this.props;
    return Math.ceil(count / Session.get("limit"));
  }

  handlePageClick = data => {
    const { selected } = data;
    const offset = Math.ceil(selected * Session.get("limit"));
    Session.set("skip", offset);
  };
  getEntriesCount = (e, count) => {
    Session.set("limit", count);
  };
  renderPagination() {
    const { count } = this.props;
    if (!count || !count <= Session.get("limit")) {
      return <span />;
    }
    return (
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={<a href="">...</a>}
        breakClassName={"break-me"}
        pageCount={this.getPageCount()}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination "}
        activeClassName={"active blue"}
        pageLinkClassName={"link"}
      />
    );
  }

  componentDidMount() {
    M.AutoInit();
    setActiveItem(Session.get("activetopic"), "topic", "cardListItem");
    Meteor.call(
      "aggregateTopics",
      FlowRouter.getParam("_id"),
      (error, data) => {
        if (!error) {
          this.setState({
            units: data
          });
        } else {
          console.log(error);
        }
      }
    );
  }

  saveUsage(id, name, url) {
    setActiveItem(id, "topic", "cardListItem");
    const material = name;
    const page = "TOPIC";
    const user = Meteor.userId();
    const date = new Date();
    const data = {
      id,
      material,
      url,
      page,
      user,
      date
    };
    insertStatistics(data);
    Session.set("activetopic", id);
    FlowRouter.go(url);
  }
  renderTopic() {
    const index = 0;
    const { topics, unitId } = this.props;
    const { units } = this.state;
    if (!topics || !units) {
      return null;
    }
    return units.map(unit => (
      <li key={unit._id}>
        <div className="collapsible-header">{unit.name}</div>
        <div className="collapsible-body">
          <ul className="collection">
            {unit.topics.length ? (
              unit.topics.map(topic => (
                <li
                  key={topic._id}
                  className="collection-item"
                  onClick={this.saveUsage.bind(
                    this,
                    topic._id,
                    topic.name,
                    `/contents/${unit._id}?rs=${topic._id}`
                  )}
                >
                  {topic.name}
                </li>
              ))
            ) : (
              <span>No topics for {unit.name}</span>
            )}
          </ul>
        </div>
      </li>
    ));
  }
  render() {
    return (
      <ul className="topic-item-container">
        <ul className="collapsible">{this.renderTopic()}</ul>
        {this.renderPagination()}
      </ul>
    );
  }
}

Topics.propTypes = {
  unitId: PropTypes.string.isRequired,
  topics: PropTypes.array,
  count: PropTypes.number
};

export default withTracker(param => {
  Meteor.subscribe("courseUnits", param.unitId);
  if (config.isHighSchool) {
    // Meteor.subscribe('units');

    return {
      topics: _Units
        .find(
          { "details.courseId": param.unitId },
          { skip: Session.get("skip"), limit: Session.get("limit") },
          { fields: { name: 1 } }
        )
        .fetch(),
      count: _Units.find({ "details.courseId": param.unitId }).count()
    };
  }
  Meteor.subscribe("topics");
  return {
    topics: _Topics
      .find(
        { unitId: param.unitId },
        { skip: Session.get("skip"), limit: Session.get("limit") },
        { fields: { name: 1 } }
      )
      .fetch(),
    count: _Topics.find({ unitId: param.unitId }).count()
  };
})(Topics);
