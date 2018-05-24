/* eslint class-methods-use-this: "off" */
import React, { Component, Fragment } from 'react';
import { Session } from 'meteor/session';
import UploadWrapper from '../../modals/UploadWrapper';
import * as config from '../../../../config.json';

export default class SetUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      confirm: '',
      reject: '',
      name: '',
      tag: '',
      auth: false,
      structure: '',
      error: '',
    };
  }

  toggleModal = e => {
    e.preventDefault();
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };
  saveChange = ({ target: { value } }, type) => {
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

      case 'auth':
        const isUserAuth = value === 'true' ? true : false;
        this.setState({
          auth: isUserAuth,
        });
        break;

      case 'structure':
        this.setState({
          structure: value,
        });
        break;
      default:
        break;
    }
  };

  saveConfig = e => {
    e.preventDefault();
    const { name, tag, structure, auth } = this.state;
    let isHighScool;
    const isSet = config.set;
    switch (structure) {
      case 'course':
        isHighScool = false;
        break;
      case 'isHighScool':
        isHighScool = true;
        break;
      default:
        break;
    }
    if (!name || !name.trim().length) {
      this.setState({
        error: 'Please Enter the Institution name',
      });
      return;
    } else if (!tag || !tag.trim().length) {
      this.setState({
        error: 'Please Enter Institution Tag or Motto',
      });
      return;
    } else if (!isSet && !structure) {
      this.setState({
        error: 'Please select the institution structure',
      });
      return;
    }
    // save to session for later, when uploading the logo
    Session.set({
      name,
      tag,
      auth,
      isHighScool,
    });
    // open the upload modal
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };
  render() {
    const { isOpen, confirm, reject, error, name } = this.state;
    const isSet = config.set;
    return (
      <Fragment>
        <UploadWrapper show={isOpen} close={this.toggleModal} title={'Upload Logo'} />
        <div className="register-page">
          <div className="container setup-container">
            <div className="container">
              <div className="row" style={{ marginTop: 30 }}>
                <form className="col s12">
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
                  Authentication <span>(Defaults to False)</span>
                  <div className="row">
                    <div className="col s6" onChange={e => this.saveChange(e, 'auth')}>
                      <p className="gender-male">
                        <input name="gender" type="radio" id="requred" value={true} required />
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
                    <>
                      <span>Structure (Note: You won't be able to change this afterwards)</span>
                      <span className="red-text">*</span>
                      <div className="row">
                        <div className="col s12" onChange={e => this.saveChange(e, 'structure')}>
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
                              value="isHighScool"
                              required
                            />
                            <label htmlFor="high-school">High School</label>
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <span />
                  )}
                  <button
                    className="btn waves-effect waves-light center pulse"
                    role="submit"
                    onClick={e => this.saveConfig(e)}
                    title={'Save and Upload the Institution Logo'}
                  >
                    Save
                  </button>
                  <br />
                  <br />
                  {error ? <h6 className="red-text ">{error}</h6> : ''}
                </form>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
