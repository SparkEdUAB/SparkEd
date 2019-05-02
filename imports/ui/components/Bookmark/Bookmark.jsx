import React from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import M from 'materialize-css';
import { _Bookmark } from '../../../api/bookmarks/bookmarks';

export class Bookmark extends React.Component {
  constructor(props) {
    super(props);
    this.isDelete = false;
  }

  componentDidMount() {
    M.AutoInit();
  }
  showBookMark = (e, path) => {
    e.preventDefault();
    return FlowRouter.go(path);
  };
  removeBookMark(id) {
    this.isDelete = true;
    Meteor.call('removeBookmark', id, err => {
      err
        ? M.toast({ html: err.reason, classes: 'error-toast' })
        : M.toast({ html: 'Deleted Bookmark', classes: 'success-toast' });
    });
  }

  renderPageData() {
    const { bookmarksCount, bookmarks } = this.props;
    if (bookmarksCount === 0) {
      return (
        <tr>
          <td>You have not bookmarked any page</td>
        </tr>
      );
    }

    return bookmarks.map(bookmark => (
      <tr
        onClick={e => this.showBookMark(e, bookmark.path)}
        key={bookmark._id}
        className="pointer"
        style={{ backgroundColor: bookmark.color }}
      >
        <td>{bookmark.title} </td>
        <td>{bookmark.description}</td>
        <td>{new Date(bookmark.createdAt).toString()}</td>
        <td
          onClick={this.removeBookMark.bind(this, bookmark._id)}
          className="fa fa-times red darken-3"
        />
      </tr>
    ));
  }
  render() {
    return (
      <div className="row">
        <div className="col">
          <table className="highlight">
            <thead>
              <tr>
                <th />
                <th />
                <th />
                <th />
              </tr>
            </thead>

            <tbody>{this.renderPageData()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}
Bookmark.propTypes = {
  bookmarks: PropTypes.array,
  bookmarksCount: PropTypes.number,
};
export default withTracker(() => {
  Meteor.subscribe('bookmarks');
  Meteor.subscribe('allUsers');
  return {
    bookmarks: _Bookmark
      .find({ user: Meteor.userId() }, { sort: { color: 1 } })
      .fetch(),
    bookmarksCount: _Bookmark
      .find({ user: Meteor.userId() }, { sort: { color: 1 } })
      .count(),
  };
})(Bookmark);
