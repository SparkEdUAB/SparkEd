import React, { Component } from 'react';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Institution as _Institution } from '../../../../api/settings/institution.js';
import Header from '../../layouts/Header.jsx';
import Sidenav from '../Sidenav.jsx';
import UploadWrapper from '../../../../ui/modals/UploadWrapper.jsx';
import * as Config from '../../../../../config.json';

export class Institution extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      title: 'Upload Logo',
    };
  }

  // open the modal
  close = () => this.setState(prevState => ({ isOpen: !prevState.isOpen }));

  static handleSubmit(event) {
    event.preventDefault();
    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      const name = $('#Iname').val();
      const sub = $('#Tname').val();
      const isUserAuth = $('#loginCheck').val();
      Session.set({ name, sub, isUserAuth });
      $('.clear').val('');
      $('#modal-upload').modal('open');
    } else {
      Materialize.toast(
        'Oops, You are not allowed to Change Institution Name and Logo, Only Admins can do that!',
        4000,
      );
    }
  }

  static changeisUserAuth(event) {
    event.preventDefault();
    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      const auth = $('#auth').val();
      Meteor.call('updateConfig', auth);
      Materialize.toast('User authentication  has been successfully changed!');
    } else {
      Materialize.toast(
        'Oops, You are not allowed to Change User authentication, Only Admins can do that!',
        4000,
      );
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col m9" style={{ marginTop: 40 }}>
            <div className="col m4 ">
              <h5 className="blue-text lighten-3">Institution Configurations</h5>
              <form className="m6" onSubmit={Institution.handleSubmit.bind(this)}>
                <div className="row">
                  <div className="input-field ">
                    <input
                      id="Iname"
                      type="text"
                      required="required"
                      className="validate field clear"
                      placeholder="Add the Name of the Institution"
                    />
                  </div>
                  <div className="input-field ">
                    <input
                      id="Tname"
                      type="text"
                      required="required"
                      className="validate field clear"
                      placeholder="Add the Tagline of the Institution"
                    />
                  </div>
                </div>

                <button
                  className="btn waves-effect waves-light left fa fa-cloud-upload"
                  role="submit"
                >
                  {' '}
                  Save and Upload Logo
                </button>
                <br />
                <br />
              </form>
            </div>
            <div className="col m1" />
            <div className="col m4 ">
              <form className="m6" onSubmit={Institution.changeisUserAuth.bind(this)}>
                <h5 className="blue-text lighten-2">User Authentication method</h5>
                <span>Are users required to login to access a resource?</span>
                <div className="input-field">
                  <select id="auth" required="true" defaultValue={Config.isUserAuth}>
                    <option value="true">Users need to login</option>
                    <option value="false">Users are not required to login</option>
                  </select>
                </div>

                <br />
                <button
                  className="btn waves-effect waves-light left fa fa-refresh fa-lg"
                  role="submit"
                >
                  {' '}
                  Change
                </button>
              </form>
              <br />
              <br />
              <code>Note: This will trigger a reload</code>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('institution');
  return { institution: _Institution.find().fetch() };
})(Institution);
