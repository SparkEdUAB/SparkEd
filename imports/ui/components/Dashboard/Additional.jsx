/* eslint default-case: 0, no-case-declarations: 0, no-unused-expressions: 0, no-shadow: 0 */
import React, { Component, Fragment } from "react";
import { PropTypes } from "prop-types";
import ReactPaginate from "react-paginate";
import { withTracker } from "meteor/react-meteor-data";
import i18n from "meteor/universe:i18n";
import { Session } from "meteor/session";
import M from "materialize-css";
import { _Courses } from "../../../api/courses/courses";
import { References } from "../../../api/resources/resources";
import {
  handleCheckboxChange,
  handleCheckAll,
  getCheckBoxValues
} from "../Utilities/CheckBoxHandler.jsx";
import UploadWrapper from "../../../ui/modals/UploadWrapper.jsx";
import MainModal from "../../../ui/modals/MainModal"; // eslint-disable-line
import { closeModal } from "../../../ui/modals/methods.js";
import { formatText } from "../../utils/utils";
import { ThemeContext } from "../../containers/AppWrapper"; // eslint-disable-line

export const T = i18n.createComponent();

export class Additional extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isOpen: false,
      modalIdentifier: "",
      modalType: "",
      title: "",
      confirm: "",
      reject: "",
      ids: [],
      name: "",
      code: "",
      perPage: 2,
      offset: 0
    };
    Session.set("limit", 10);
  }

  componentWillUnmount() {
    Session.set({
      limit: 0,
      skip: 0
    });
  }

  closeModal = () => {
    this.setState(closeModal);
  };

  // ide => modalType, id=> schoolId
  toggleEditModal = (ide, id = "", name = "") => {
    // check if the user has full rights
    if (!Roles.userIsInRole(Meteor.userId(), ["admin"])) {
      M.toast({
        html: "<span>Only Admins can edit the resource</span>",
        classes: "red"
      });
      return;
    }

    this.name = name;
    this.id = id;

    switch (ide) {
      case "edit":
        this.setState({
          modalIdentifier: this.id,
          modalType: ide,
          title: "Edit Resource",
          confirm: "Save",
          reject: "Close",
          name: this.name
        });

        break;

      case "del":
        const resources = getCheckBoxValues("chk");
        const count = resources.length;
        const name = count > 1 ? "resource" : "resources";

        if (count < 1) {
          M.toast({
            html: "<span>Please check atleast one resource</span>",
            classes: "red"
          });
          return;
        }
        this.setState({
          modalIdentifier: "id",
          modalType: ide,
          title: `Are you sure to delete ${count} ${name}`,
          confirm: "Yes",
          reject: "No",
          ids: resources
        });
        break;
      case "upload":
        this.setState({
          modalIdentifier: "",
          modalType: ide,
          title: "Upload a Reference",
          confirm: "Save",
          reject: "Close"
        });
        break;
    }
    this.setState({ isOpen: true });
  };

  handleSubmit(e) {
    e.preventDefault();
    const { modalType, ids, modalIdentifier } = this.state;

    switch (modalType) {
      case "edit":
        const reference = e.target.res.value;
        Meteor.call("updateReference", modalIdentifier, reference, err => {
          err
            ? (M.toast({ html: `<span>${err.reason}</span>`, classes: "red" }),
              Meteor.call(
                "logger",
                formatText(err.message, Meteor.userId(), "reference-edit"),
                "error"
              ))
            : Meteor.call("updateSearch", modalIdentifier, reference, err => {
                err
                  ? M.toast({
                      html: `<span>${err.reason}</span>`,
                      classes: "red"
                    })
                  : M.toast({
                      html: "<span>Successfully Updated</span>",
                      classes: "green darken-1"
                    });
              });
        });
        break;
      case "del":
        let count = 0;

        ids.map(res => {
          count += 1;
          const name = count > 1 ? "references" : "reference";
          Meteor.call("removeReference", res, err => {
            err
              ? (M.toast({
                  html: `<span>${err.reason}</span>`,
                  classes: "red"
                }),
                Meteor.call(
                  "logger",
                  formatText(err.message, Meteor.userId(), "reference-remove"),
                  "error"
                ))
              : Meteor.call("removeSearchData", res, err => {
                  err
                    ? M.toast({
                        html: `<span>${err.reason}</span>`,
                        classes: "red"
                      })
                    : M.toast({
                        html: `<span>${count} ${name} successfully deleted</span>`,
                        classes: "green darken-1"
                      });
                });
          });
        });

        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  /**
   * @param { String} id
   */
  static handleUrl(id) {
    FlowRouter.go(`/dashboard/view_resource/${id}`);
  }

  /**
   * @param {String} courseId
   * @returns The name of the course or anonymous if its an extra resource
   */
  static renderCourseName(courseId) {
    // this should be reactive
    const course = _Courses.findOne({ _id: courseId });
    // show anonymous on references that don't belong to any course
    if (!course) {
      return "Anonymous";
    }
    return course.name;
  }

  renderExtra() {
    let count = 1;
    const { extras } = this.props;
    if (!extras) {
      return null;
    }
    return extras.map(extra => (
      <tr className="link-section" key={extra._id}>
        <td>{count++}</td>
        <td onClick={Additional.handleUrl.bind(this, extra._id)}>
          {extra.name.replace(/\.[^/.]+$/, "")}
        </td>
        <td>
          <a
            href=""
            className="fa fa-pencil"
            onClick={e =>
              this.toggleEditModal("edit", extra._id, extra.name, e)
            }
          />
        </td>
        <td>
          {/* don't route a resource if it doesn't belong to any course */}
          <a
            href={
              extra.courseId === null
                ? ""
                : `/dashboard/units/${extra.programId}?cs=${extra.courseId}`
            }
          >
            {Additional.renderCourseName(extra.courseId)}
          </a>
        </td>
        <td onClick={handleCheckboxChange.bind(this, extra._id)}>
          <label htmlFor={extra._id}>
            <input
              type="checkbox"
              id={extra._id}
              className={`chk chk${extra._id}`}
            />
            <span />
          </label>
        </td>
      </tr>
    ));
  }

  getPageCount() {
    const { count } = this.props;
    return count === 0 || Session.get("limit") === 0
      ? 0
      : Math.ceil(count / Session.get("limit"));
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
    if (!count) {
      return <span />;
    }
    if (count <= Session.get("limit")) {
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

  render() {
    const { modalType, isOpen, title, confirm, reject, name } = this.state;
    return (
      <ThemeContext.Consumer>
        {/* Modals for Deleting  */}
        {({ state }) => (
          <Fragment>
            <Fragment>
              {modalType === "upload" ? (
                <UploadWrapper
                  show={isOpen}
                  close={this.closeModal}
                  title={title}
                />
              ) : (
                <MainModal
                  show={isOpen}
                  onClose={this.closeModal}
                  subFunc={this.handleSubmit}
                  title={title}
                  confirm={confirm}
                  reject={reject}
                >
                  {modalType === "del" ? (
                    <span />
                  ) : (
                    <div className="input-field">
                      <input
                        placeholder="Name of Unit"
                        type="text"
                        defaultValue={name}
                        className="validate clear"
                        style={{ color: state.isDark ? "#F5FAF8" : "#000000" }}
                        required
                        name="res"
                      />
                    </div>
                  )}
                </MainModal>
              )}
            </Fragment>
            <div
              className="col m9 s11"
              style={{
                backgroundColor: state.isDark ? state.mainDark : "#FFFFFF",
                color: state.isDark ? "#F5FAF8" : "#000000"
              }}
            >
              <div className="">
                <h4>
                  <T>common.sidenav.resourceLibrary</T>{" "}
                </h4>
              </div>
              <div className="row">
                <div className="col m4">
                  <button
                    className="btn red darken-3"
                    onClick={e => this.toggleEditModal("del", e)}
                  >
                    {" "}
                    <T>common.actions.delete</T>
                  </button>
                </div>
                <div className="col m4">
                  <button
                    className="btn fa fa-upload green darken-4 "
                    onClick={e => this.toggleEditModal("upload", e)}
                  >
                    {" "}
                    Add Reference
                  </button>
                </div>
                <div className="col m4">
                  <T>common.titles.referenceDisplaced</T>
                  <div className="row">
                    <a
                      className="col s2 link"
                      onClick={e => this.getEntriesCount(e, 5)}
                    >
                      <u>{Session.get("limit") === 5 ? <b>5</b> : 5}</u>
                    </a>
                    <a
                      className="col s2 link"
                      onClick={e => this.getEntriesCount(e, 10)}
                    >
                      <u>{Session.get("limit") === 10 ? <b>10</b> : 10}</u>
                    </a>
                    <a
                      className="col s2 link"
                      onClick={e => this.getEntriesCount(e, 20)}
                    >
                      <u>{Session.get("limit") === 20 ? <b>20</b> : 20}</u>
                    </a>
                  </div>
                </div>
              </div>

              <table className="highlight">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>
                      <T>common.manage.reference</T>
                    </th>
                    <th>
                      <T>common.actions.edit</T> <T>common.manage.reference</T>
                    </th>
                    <th>Course Name</th>
                    <th onClick={handleCheckAll.bind(this, "chk-all", "chk")}>
                      <label>
                        <input type="checkbox" className=" chk-all" readOnly />
                        <T>common.actions.check</T>
                      </label>
                    </th>
                  </tr>
                </thead>
                <tbody>{this.renderExtra()}</tbody>
              </table>
              {this.renderPagination()}
            </div>
          </Fragment>
        )}
      </ThemeContext.Consumer>
    );
  }
}

Additional.propTypes = {
  extras: PropTypes.array,
  count: PropTypes.number
};

export default withTracker(() => {
  Meteor.subscribe("courses");
  Meteor.subscribe("references");

  return {
    extras: References.find(
      {},
      { skip: Session.get("skip"), limit: Session.get("limit") }
    ).fetch(),
    count: References.find().count()
  };
})(Additional);
