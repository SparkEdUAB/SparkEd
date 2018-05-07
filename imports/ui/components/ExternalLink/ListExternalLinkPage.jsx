import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import ReactPaginate from 'react-paginate';
import { _ExternalLink } from '../../../api/externallink/externallink';
import MainModal from '../../../ui/modals/MainModal.jsx';
import { relative } from 'path';

export class ExternalLinkPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      modalType: '', // remove all or remove read
      title: '', // remove all notifications
      confirm: '',
      reject: '',
    };
    Session.set('limit', 10);
  }

  componentWillUnmount() {
    Session.set({
      limit: 0,
      skip: 0,
    });
  }
  getPageCount() {
    const { externallinksCount } = this.props;
    return Math.ceil(externallinksCount / Session.get('limit'));
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
    const { externallinksCount } = this.props;
    if (!externallinksCount) {
      return <span />;
    }
    if (externallinksCount <= Session.get('limit')) {
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
  handleExternalLinkUrl = (event, url) => {
    window.open(url, '_blank');
  };

  renderExternalLinks() {
    const { externallinks } = this.props;
    if (externallinks === undefined) {
      return null;
    } else if (externallinks === 0) {
      return (
        <li className="collection-item col m12 s12">
          <a className="notification-item" href="#" style={{ fontSize: '16px' }}>
            You don't have any external links
          </a>
        </li>
      );
    }
    return externallinks.map(externallink => (
      <li key={externallink._id}>
        <ul>
          <li
            style={{ backgroundColor: 'white', padding: '1px 10px 5px', cursor: 'pointer' }}
            onClick={e => this.handleExternalLinkUrl(this, externallink.url)}
          >
            <span>
              {externallink.name} <br />
              <span className="fa fa-link fa-2x" style={{ fontSize: '12px', color: '#90949c' }}>
                {' '}
                <b> {externallink.url}</b>
              </span>
            </span>
          </li>
        </ul>
        <hr />
      </li>
    ));
  }
  // clear read notifications for the current user

  close = () => {
    this.setState({
      isOpen: !this.state.isOpen,
      modalType: '',
      title: '',
      confirm: '',
      reject: '',
    });
  };

  render() {
    const { isOpen, title, confirm, reject } = this.state;
    return (
      <Fragment>
        <MainModal
          show={isOpen}
          onClose={this.close}
          subFunc={this.handleSubmit}
          title={title}
          confirm={confirm}
          reject={reject}
        />
        <div className="container">
          <div className="row">
            <div className="col s12 ">
              <h3 className="center blue-text">All External Links</h3>

              <ul className="collection " style={{ position: 'inherit' }}>
                {this.renderExternalLinks()}
              </ul>
              {this.renderPagination()}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export function getuserId() {
  let user = Meteor.user();
  if (user) {
    return user._id;
  } else {
    return '';
  }
}

ExternalLinkPage.propTypes = {
  externallinks: PropTypes.array,
  externallinksCount: PropTypes.number,
};

export default withTracker(() => {
  Meteor.subscribe('externallinks');

  return {
    // Show the newly created N notifications

    externallinks: _ExternalLink.find({},{ skip: Session.get('skip'), limit: Session.get('limit')}).fetch(),
      externallinksCount: _ExternalLink.find({}).count(),
  };
})(ExternalLinkPage);
