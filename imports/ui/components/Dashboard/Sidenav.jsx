import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Meteor } from 'meteor/meteor';
import * as config from '../../../../config.json';
import Header from '../layouts/Header';

// currently disabled the sync and sync settings as they need to be tested and thoroughly reviewed
//  The code can remain here as both will be updated in the later release
export default class Sidenav extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <div className="row">
          <Fragment>
            <div className="col m3 s1 menu_simple">
              {/* begin list */}
              <ul className="item-container">
                <li className="hide-on-med-and-down">
                  <a id="dashtweek" href="/dashboard/accounts" className="center">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/dashboard/accounts" className={`  side-list ${this.props.accounts}`}>
                    <i className={`fa fa-user fa-lg icon-white `} />
                    <span className="hide-on-small-only">&nbsp;Accounts</span>
                  </a>
                </li>

                {/* Display  Courses if School doesn't exist */}
                {config.isSchool ? (
                  <Fragment>
                    <li>
                      <a href="/dashboard/school" className={`  side-list ${this.props.school}`}>
                        <i className={`fa fa-book fa-lg `} />
                        <span className="hide-on-small-only">&nbsp;School</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/dashboard/list_topics"
                        className={`  side-list ${this.props.topics}`}
                      >
                        <i className={`fa fa-text-width fa-lg `} />
                        <span className="hide-on-small-only">&nbsp; All Topics</span>
                      </a>
                    </li>
                  </Fragment>
                ) : config.isHighScool ? (
                  <li>
                    <a href="/dashboard/course" className={`  side-list ${this.props.course}`}>
                      <i className={`fa fa-book fa-lg `} />
                      <span className="hide-on-small-only">&nbsp;Subjects</span>
                    </a>
                  </li>
                ) : (
                  <Fragment>
                    <li>
                      <a href="/dashboard/course" className={`  side-list ${this.props.course}`}>
                        <i className={`fa fa-book fa-lg `} />
                        <span className="hide-on-small-only">&nbsp;Courses</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/dashboard/list_topics"
                        className={`  side-list ${this.props.topics}`}
                      >
                        <i className={`fa fa-text-width fa-lg `} />
                        <span className="hide-on-small-only">&nbsp; All Topics</span>
                      </a>
                    </li>
                  </Fragment>
                )}
                <li>
                  <a href="/dashboard/extra" className={`  side-list ${this.props.extra}`}>
                    <i className={`fa fa-th fa-lg `} />
                    <span className="hide-on-small-only">&nbsp;Resource Library</span>
                  </a>
                </li>
                <li>
                  <a href="/externallinks" className={`side-list ${this.props.externallinks}`}>
                    <i className={`fa fa-link `} />
                    <span className="hide-on-small-only">&nbsp; External Link</span>
                  </a>
                </li>
                <li>
                  <a href="/dashboard/overview" className={`  side-list ${this.props.stats}`}>
                    <i className={`fa fa-bar-chart fa-lg `} />
                    <span className="hide-on-small-only">&nbsp;Statistics</span>
                  </a>
                </li>
                <li>
                  <a href="/dashboard/feedback" className={`  side-list ${this.props.feedback}`}>
                    <i className={`fa fa-comments fa-lg `} />
                    <span className="hide-on-small-only">&nbsp;Feedback</span>
                  </a>
                </li>

                {/* only show settings, sliders for admin only */}
                {Roles.userIsInRole(Meteor.userId(), ['admin']) ? (
                  <>
                    <li>
                      <a href="/setup" className={`  side-list ${this.props.settings}`}>
                        <i className={`fa fa-gear fa-lg `} />
                        <span className="hide-on-small-only">&nbsp; Set Up</span>
                      </a>
                    </li>

                    <li>
                      <a href="/dashboard/slides" className={`  side-list ${this.props.slides}`}>
                        <i className={`fa fa-picture-o `} />
                        <span className="hide-on-small-only">&nbsp; Change Slides</span>
                      </a>
                    </li>
                    <li>
                      <a href="/dashboard/updates" className={`  side-list ${this.props.slides}`}>
                        <i className={`fa fa-picture-o `} />
                        <span className="hide-on-small-only">&nbsp; Updates</span>
                      </a>
                    </li>
                  </>
                ) : (
                  <span />
                )}
                <li>
                  <a href="#" className="small">
                    <span className="sideHide item">
                      <code>version 1.0</code>
                    </span>
                  </a>
                </li>
              </ul>
              {/* end list (ul) */}
            </div>
          </Fragment>
          <Fragment>{this.props.children}</Fragment>
        </div>
      </Fragment>
    );
  }
}
Sidenav.propTypes = {
  accounts: PropTypes.string,
  school: PropTypes.string,
  extra: PropTypes.string,
  stats: PropTypes.string,
  feedback: PropTypes.string,
  topics: PropTypes.string,
  resources: PropTypes.string,
  settings: PropTypes.string,
  sliding: PropTypes.string,
  course: PropTypes.string,
  externallinks: PropTypes.string,
};
