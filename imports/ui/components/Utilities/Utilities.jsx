/* eslint-disable no-case-declarations */
import React, { Component, Fragment, PureComponent } from "react";
import { PropTypes } from "prop-types";
import { Meteor } from "meteor/meteor";
import M from "materialize-css";
import MainModal from "../../modals/MainModal.jsx";
import { _Bookmark } from "../../../api/bookmarks/bookmarks";

export class SearchView extends Component {
  getQuery() {
    let query = FlowRouter.getQueryParam(this.props.query);
    query = query === undefined ? null : query;
    return query;
  }
  submit = e => {
    e.preventDefault();
    const { value } = e.target.g_search;
    return FlowRouter.go(`${this.props.action}?q=${value}`);
  };
  render() {
    return (
      <form
        action={this.props.action}
        onSubmit={this.submit}
        name={this.props.formName}
        method="get"
      >
        <div className="row">
          <input
            className={`col input ${this.props.sClass}`}
            name={"g_search"}
            type="search"
            defaultValue={this.getQuery()}
            id="search"
            placeholder={this.props.placeholder}
            autoComplete="off"
          />
          <input id="submit" type="submit" className="hidden" hidden />
        </div>
      </form>
    );
  }
}

SearchView.propTypes = {
  action: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  sClass: PropTypes.string,
  formName: PropTypes.string
};

export class SearchField extends Component {
  getQuery() {
    let query = FlowRouter.getQueryParam(this.props.query);
    query = query === undefined ? null : query;
    return query;
  }
  submit = e => {
    e.preventDefault();
    const value = e.target.search.value;
    return FlowRouter.go(`${this.props.action}?q=${value}`);
  };
  render() {
    return (
      <form
        action={this.props.action}
        onSubmit={this.submit}
        name={this.props.formName}
        method="get"
      >
        <div className="row">
          <input
            className={this.props.query}
            name={"search"}
            type="search"
            defaultValue={this.getQuery()}
            style={{ color: this.props.color }}
            id="searchField"
            placeholder={this.props.placeholder}
          />
          <input id="submit" type="submit" className="hidden" hidden />
        </div>
      </form>
    );
  }
}

SearchField.propTypes = {
  action: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  formName: PropTypes.string,
  color: PropTypes.string
};

export function initInput() {
  $(document).ready(() => {
    M.updateTextFields();
  });
}
export function filterUrl(filter) {
  const path = `${location.pathname}?${filter}=${true}`;
  location.href = path;
}

export function setActiveItem(id, items, clas) {
  $(`.${items}`).each((k, v) => {
    $(v)
      .removeClass("active-item")
      .addClass(clas);
  });
  $(`#${id}`)
    .addClass("active-item")
    .removeClass(clas);
}

// todo: make a proper component for the floating button and remove jQuery
export class FloatingButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      modalIdentifier: "",
      modalType: "",
      title: "",
      confirm: "",
      reject: "",
      value: "",
      feedDesc: "",
      feedTitle: "",
      bookTitle: "",
      bookDesc: ""
    };
  }

  componentDidMount() {
    M.AutoInit();
  }
  handleSubmit = e => {
    e.preventDefault();
    const userName = !Meteor.user()
      ? "anonymous"
      : `${Meteor.user().profile.name} `;

    const { modalType, feedDesc, feedTitle, bookTitle, bookDesc } = this.state;

    const { pathname, href } = window.location;
    switch (modalType) {
      case "feedback":
        // const { href } = window.location;
        Meteor.call(
          "feedback.insert",
          feedTitle,
          feedDesc,
          href,
          userName,
          err => {
            if (err) {
              M.toast({ html: err.reason, classes: "error-toast" });
            } else {
              M.toast({
                html: "Your feedback has successfully been submitted",
                classes: "success-toast"
              });
            }
          }
        );
        break;
      case "bookmark":
        const { bookColor } = this.state;
        const bookmarkData = _Bookmark.findOne({ href });
        let bookmark = null;
        if (
          typeof bookmarkData === "object" &&
          Meteor.userId() === bookmarkData.user
        ) {
          bookmark = bookmarkData._id;
        }
        Meteor.call(
          "updateBookmark",
          bookmark,
          bookTitle,
          bookDesc,
          href,
          bookColor,
          pathname,
          err => {
            err
              ? M.toast({ html: err.reason, classes: "error-toast" })
              : M.toast({ html: "Updated Bookmark", classes: "success-toast" });
          }
        );
        break;
      default:
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  close = () => this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  toggleEditModal = (e, type) => {
    e.preventDefault();
    switch (type) {
      case "feedback":
        this.setState({
          modalType: type,
          title: "Submit Feedback",
          confirm: "Save",
          reject: "Close"
        });
        break;
      case "bookmark":
        this.setState({
          modalType: type,
          title: "Add Bookmarks",
          confirm: "Save",
          reject: "Close"
        });
        break;
      default:
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  setColor(color, event) {
    event.preventDefault();
    this.color = color;
    this.setState({
      bookColor: this.color
    });
  }

  grabText = ({ target: { value } }, field) => {
    switch (field) {
      case "feedTitle":
        this.setState({
          feedTitle: value
        });
        break;
      case "feedDesc":
        this.setState({
          feedDesc: value
        });
        break;
      case "bookTitle":
        this.setState({
          bookTitle: value
        });
        break;
      case "bookDesc":
        this.setState({
          bookDesc: value
        });
        break;
      default:
        break;
    }
  };
  render() {
    const { isOpen, title, confirm, reject, modalType } = this.state;
    return (
      <Fragment>
        <MainModal
          show={isOpen}
          onClose={this.close}
          subFunc={this.handleSubmit}
          title={title}
          confirm={confirm}
          reject={reject}
        >
          <div className="container-fluid">
            {modalType === "feedback" ? (
              <Fragment>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      id="name"
                      type="text"
                      className="clear validate"
                      placeholder="Title"
                      required
                      name="feedback_title"
                      onChange={e => this.grabText(e, "feedTitle")}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <textarea
                      id="textarea"
                      className="clear materialize-textarea"
                      required
                      placeholder="Your FeedBack"
                      name="feedback_content"
                      onChange={e => this.grabText(e, "feedDesc")}
                    />
                  </div>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className="row">
                  <div className="input-field col s12">
                    <span className="c-grey">Title</span>
                    <input
                      id="bmk-title"
                      maxLength="50"
                      type="text"
                      className="clear validate"
                      placeholder="Title"
                      required
                      onChange={e => this.grabText(e, "bookTitle")}
                    />
                    <input
                      type="color"
                      defaultValue="#008000"
                      onClick={this.setColor.bind(this, "#008000")}
                      id="bmk-color-green"
                    />
                    <input
                      type="color"
                      defaultValue="#ffeb3b"
                      onClick={this.setColor.bind(this, "#ffeb3b")}
                      id="bmk-color-yellow"
                    />
                    <input
                      type="color"
                      defaultValue="#f44336"
                      onClick={this.setColor.bind(this, "#f44336")}
                      id="bmk-color-red"
                    />
                    <input
                      type="color"
                      defaultValue="#9c27b0"
                      onClick={this.setColor.bind(this, "#9c27b0")}
                      id="bmk-color-purple"
                    />
                    <input
                      type="hidden"
                      defaultValue="#9c27b0"
                      disabled
                      id="bmk-color"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <span className="c-grey">Short Description</span>

                    <textarea
                      id="bmk-description"
                      className="clear materialize-textarea"
                      maxLength="70"
                      placeholder="short description"
                      onChange={e => this.grabText(e, "bookDesc")}
                    />
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        </MainModal>

        <div className="fixed-action-btn plus-icon">
          <a
            href=""
            className="btn-floating btn-large waves-effect waves-light teal darken-1"
          >
            <i className="fa fa-plus center more-items" />
          </a>
          <ul>
            <li>
              <a
                href="#"
                title="Provide feedback"
                className="btn-floating  waves-effect waves-light teal darken-1"
                onClick={e => this.toggleEditModal(e, "feedback")}
              >
                <i className="fa fa-comments center" />
              </a>
            </li>
            <li>
              <a
                onClick={e => this.toggleEditModal(e, "bookmark")}
                title="Bookmark"
                href="#"
                target="_blank"
                className="btn-floating teal darken-1"
              >
                <i className="fa fa-bookmark" />
              </a>
            </li>
          </ul>
        </div>
      </Fragment>
    );
  }
}
