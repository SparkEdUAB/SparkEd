/* eslint class-methods-use-this: "off" */
import React, { Component, Fragment } from 'react';
import { Session } from 'meteor/session';
import M from 'materialize-css';
import FileUploadComponent from '../../containers/FileUploadComponent';
import * as config from '../../../../config.json';
import { Button } from '../../utils/Buttons';
import { _Settings } from '../../../api/settings/settings';
import { ThemeContext } from '../../containers/AppWrapper';

export default class SetUp extends Component {
  state = {
    isOpen: false,
    confirm: '',
    reject: '',
    name: '',
    tag: '',
    auth: false,
    structure: '',
    error: '',
    server: '',
  };

  toggleModal = e => {
    e.preventDefault();
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };
  saveChange = ({ target: { value } }, type) => {
    this.setState({
      error: '',
    });
    switch (type) {
      case 'name':
        this.setState({
          name: value,
        });
        break;
      case 'tag':
        this.setState({
          tag: value,
        });
        break;
        // eslint-disable-next-line
      case 'auth':
        const isUserAuth = value === 'true';
        this.setState({
          auth: isUserAuth,
        });
        break;

      case 'structure':
        this.setState({
          structure: value,
        });
        break;
        // eslint-disable-next-line
      case 'server':
        const lastSubstring = value.slice(-1);
        const address =
          lastSubstring === '/' ? value.substring(0, value.length - 1) : value;
        this.setState({
          server: address,
        });
        break;
      default:
    }
  };

  saveConfig = e => {
    e.preventDefault();
    const {
      name, tag, structure, auth, server,
    } = this.state;
    let isHighSchool;
    const isSet = config.isConfigured;
    switch (structure) {
      case 'course':
        isHighSchool = false;
        break;
      case 'isHighSchool':
        isHighSchool = true;
        break;
      default:
        break;
    }
    if (!name || !name.trim().length) {
      this.setState({
        error: 'Institution name is needed',
      });
      return;
    } else if (!tag || !tag.trim().length) {
      this.setState({
        error: ' Institution Tag or Motto is needed',
      });
      return;
    } else if (!isSet && !structure) {
      this.setState({
        error: 'Institution structure is needed',
      });
      return;
    } else if (!server.includes('http')) {
      this.setState({
        error: "Check the server address, It should contain 'http' ",
      });
      return;
    }
    // save to session for later, when uploading the logo
    Session.setPersistent({
      name,
      tag,
      auth,
      isHighSchool,
      server,
    });
    Meteor.call('addConfig', name, tag, auth, isHighSchool, server, err => {
      err
        ? M.toast({ html: `<span>${err.reason}</span>` })
        : M.toast({
          html: '<span>Successfully saved the configurations</span>',
        });
    });
    const settings = _Settings.findOne();

    Meteor.call(
      'updateSettings',
      settings._id,
      name,
      tag,
      server,
      true,
      err => {
        err ? console.log(err.reason) : console.log('yep it is done'); // eslint-disable-line
      },
    );

    // open the upload modal
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };
  render() {
    const { error, name } = this.state;
    const isSet = config.isConfigured;
    return (
      <ThemeContext.Consumer>
        {color => (
          <Fragment>
            {/* <UploadWrapper show={isOpen} close={this.toggleModal} title={'Upload Logo'} /> */}
            <div className="col s11 m9">
              <form className="">
                <div className="row">
                  <div className="input-field col s12 m6">
                    <input
                      id="inst_name"
                      type="text"
                      className="validate"
                      required="true"
                      value={name}
                      onChange={e => this.saveChange(e, 'name')}
                    />
                    <label htmlFor="inst_name">
                      Institution Name <span className="red-text">*</span>{' '}
                    </label>
                  </div>
                  <div className="input-field col s12 m6">
                    <input
                      id="inst_tag"
                      type="text"
                      className="validate"
                      required
                      onChange={e => this.saveChange(e, 'tag')}
                    />
                    <label htmlFor="inst_tag">
                      Institution Tagline <span className="red-text">*</span>
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col m6 s12 input-field">
                    <input
                      id="server-address"
                      type="text"
                      className="validate"
                      required
                      onChange={e => this.saveChange(e, 'server')}
                    />
                    <label htmlFor="server-address">
                      Server Address <span className="red-text">*</span>
                    </label>
                  </div>
                </div>
                Authentication <span>(Defaults to False)</span>
                <div className="row">
                  <div
                    className="col s6"
                    onChange={e => this.saveChange(e, 'auth')}
                  >
                    <p className="gender-male">
                      <input
                        name="gender"
                        type="radio"
                        id="requred"
                        value={true}
                        required
                      />
                      <label htmlFor="requred">Required</label>
                    </p>
                    <p className="gender-female">
                      <input
                        name="gender"
                        type="radio"
                        id="not-required"
                        value={false}
                        required
                      />
                      <label htmlFor="not-required">Not Required</label>
                    </p>
                  </div>
                </div>
                {/* Hide the structure in case it has already been set */}
                {!isSet ? (
                  <Fragment>
                  <span>
                      Structure (Note: You won't be able to change this
                      afterwards)
                    </span>
                    <span className="red-text">*</span>
                    <div className="row">
                      <div
                        className="col s12"
                        onChange={e => this.saveChange(e, 'structure')}
                      >
                        <p className="gender-female">
                          <input
                            name="struct"
                            type="radio"
                            id="courses"
                            value="course"
                            required
                          />
                          <label htmlFor="courses">Courses</label>
                        </p>
                        <p className="gender-female">
                          <input
                            name="struct"
                            type="radio"
                            id="high-school"
                            value="isHighSchool"
                            required
                          />
                          <label htmlFor="high-school">High School</label>
                        </p>
                      </div>
                    </div>
                    </Fragment>
                ) : (
                  <span />
                )}
                {error ? <h6 className="red-text ">{error}</h6> : ''}
              </form>
              <p>Upload the logo (Not Required)</p>
              <FileUploadComponent />
              <Button
                actionFunc={e => this.saveConfig(e)}
                title={'Save and Upload the Institution Logo'}
                backgroundColor={color.main}
                name={'Save'}
                extraClass={'pulse'}
              />
            </div>
          </Fragment>
        )}
      </ThemeContext.Consumer>
    );
  }
}
