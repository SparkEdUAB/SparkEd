import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Meteor } from 'meteor/meteor';
import * as config from '../../../../config.json';
import AppWrapper from '../../containers/AppWrapper'; // eslint-disable-line
import i18n from 'meteor/universe:i18n'; // eslint-disable-line
import '../../stylesheets/overlay.css';
import { ThemeContext } from '../../containers/AppWrapper'; // eslint-disable-line

const T = i18n.createComponent();

const Sidenav = props => (
  <AppWrapper>
    <ThemeContext.Consumer>
      {({ state }) => (
        <div className="row">
          <Fragment>
            <div
              className="col m2 s1 menu_simple"
              id={!config.isConfigured ? 'outer-box' : ''}
              style={{
                backgroundColor: state.isDark ? state.mainDark : state.main,
              }}
            >
              {/* begin list */}
              <ul className="item-container">
                <li className="hide-on-med-and-down">
                  <a
                    id="dashtweek"
                    href="/dashboard/accounts"
                    className="center"
                  >
                    <T>common.sidenav.dashboard</T>
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/stats"
                    className={`  side-list ${props.stats}`}
                  >
                    <span className="hide-on-small-only">&nbsp; Stats</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/accounts"
                    className={`  side-list ${props.accounts}`}
                  >
                    <span className="hide-on-small-only">
                      &nbsp; <T>common.sidenav.accounts</T>
                    </span>
                  </a>
                </li>

                {config.isHighSchool ? (
                  <li>
                    <a
                      href="/dashboard/course"
                      className={`  side-list ${props.course}`}
                    >
                      <span className="hide-on-small-only">
                        &nbsp; <T>common.sidenav.subjects</T>
                      </span>
                    </a>
                  </li>
                ) : (
                  <Fragment>
                    <li>
                      <a
                        href="/dashboard/course"
                        className={`  side-list ${props.course}`}
                      >
                        <span className="hide-on-small-only">
                          &nbsp; <T>common.sidenav.courses</T>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/dashboard/list_topics"
                        className={`  side-list ${props.topics}`}
                      >
                        <span className="hide-on-small-only">
                          &nbsp; <T>common.sidenav.alltopics</T>
                        </span>
                      </a>
                    </li>
                  </Fragment>
                )}
                <li>
                  <a
                    href="/dashboard/extra"
                    className={`  side-list ${props.extra}`}
                  >
                    <span className="hide-on-small-only">
                      &nbsp; <T>common.sidenav.resourceLibrary</T>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/externallinks"
                    className={`side-list ${props.externallinks}`}
                  >
                    <span className="hide-on-small-only">
                      &nbsp; <T>common.sidenav.externalLinks</T>
                    </span>
                  </a>
                </li>
                {config.isUserAuth ? (
                  <li>
                    <a
                      href="/dashboard/overview"
                      className={`  side-list ${props.stats}`}
                    >
                      <span className="hide-on-small-only">
                        &nbsp; <T>common.sidenav.stats</T>
                      </span>
                    </a>
                  </li>
                ) : (
                  <span />
                )}
                <li>
                  <a
                    href="/dashboard/feedback"
                    className={`  side-list ${props.feedback}`}
                  >
                    <span className="hide-on-small-only">
                      &nbsp; <T>common.sidenav.feedback</T>
                    </span>
                  </a>
                </li>

                {/* only show settings, sliders for admin only */}
                {Roles.userIsInRole(Meteor.userId(), ['admin']) ? (
                  <Fragment>
                    <li>
                      <a
                        href="/setup"
                        className={`  side-list ${props.settings}`}
                      >
                        <span className="hide-on-small-only">
                          &nbsp; <T>common.sidenav.setup</T>
                        </span>
                      </a>
                    </li>

                    <li>
                      <a
                        href="/dashboard/slides"
                        className={`  side-list ${props.slides}`}
                      >
                        <span className="hide-on-small-only">
                          &nbsp; <T>common.sidenav.changeSlides</T>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/dashboard/updates"
                        className={`  side-list ${props.slides}`}
                      >
                        <span className="hide-on-small-only">
                          &nbsp; <T>common.sidenav.updates</T>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/dashboard/backup"
                        className={`  side-list ${props.slides}`}
                      >
                        <span className="hide-on-small-only">
                          &nbsp; <T>common.sidenav.backup</T>
                        </span>
                      </a>
                    </li>
                  </Fragment>
                ) : (
                  <span />
                )}
                <li>
                  <a href="#" className="small">
                    <span className="sideHide item">
                      <code>version 1.7.5</code>
                    </span>
                  </a>
                </li>
              </ul>
              {/* end list (ul) */}
              {!config.isConfigured ? (
                <div id="inner-box">
                  <p>Finish Set up</p>
                </div>
              ) : (
                <span />
              )}
            </div>
          </Fragment>
          <Fragment>{props.yield}</Fragment>
        </div>
      )}
    </ThemeContext.Consumer>
  </AppWrapper>
);

Sidenav.propTypes = {
  accounts: PropTypes.string,
  extra: PropTypes.string,
  stats: PropTypes.string,
  feedback: PropTypes.string,
  topics: PropTypes.string,
  resources: PropTypes.string,
  settings: PropTypes.string,
  sliding: PropTypes.string,
  course: PropTypes.string,
  externallinks: PropTypes.string,
  setup: PropTypes.string,
  theme: PropTypes.string,
  yield: PropTypes.node,
};

export default Sidenav;
