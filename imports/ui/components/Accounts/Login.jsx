import React, { Component } from 'react';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      languages: [],
    };
  }

  componentDidMount() {
    Meteor.call('getLanguages', (error, languages) => {
      if (!error) {
        this.setState({ languages });
      }
    });
  }

  loginUser = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    Meteor.call('account.check', email, (err, result) => {
      if (result) {
        this.setState({ error: result });
      } else {
        Meteor.loginWithPassword(email, password, error => {
          if (error) {
            this.setState({ error: error.reason });
          } else {
            // Don't use FlowRouter.go('/) to allow updating the admin details;
            if (localStorage.getItem('beenhere')) {
              //   window.location = '/';
              FlowRouter.go('/');
            } else {
              localStorage.setItem('beenhere', true);
              // setup is an admin route, normal users will be redirected to Home Page
              window.location = '/setup';
            }
          }
        });
      }
    });
  };

  // change the language
  changeLangauge = lang => {
    switch (lang) {
      case 'fr':
        i18n.setLocale('fr-FR');
        break;
      case 'en':
        i18n.setLocale('en-US');
        break;
      case 'es':
        i18n.setLocale('es-Es');
        break;
      default:
        break;
    }
  };
  render() {
    const { error } = this.state;
    return (
      <div className="register-page">
        <div className="container account-container">
          <div className="row">
            <form className="col s12" id="reg-form" onSubmit={this.loginUser}>
              <div className="row">
                <div className="input-field col s12">
                  <input id="email" type="email" className="validate field" required />
                  <label htmlFor="email">
                    <T>common.accounts.Email</T>
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="password"
                    type="password"
                    className="validate field"
                    minLength="6"
                    required
                  />
                  <label htmlFor="password">
                    <T>common.accounts.Password</T>
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s6">
                  <button
                    className="btn btn-large btn-register waves-effect waves-light"
                    type="submit"
                  >
                    {' '}
                    <T>common.accounts.Login</T>
                    <i className="fa fa-paper-plane right" />
                  </button>
                </div>
              </div>
              {error ? <div className="row">{error}</div> : <span />}
            </form>
            <a href="" onClick={e => this.changeLangauge('en')}>
              <T>common.accounts.enUS</T>
            </a>
            {' |'}
            <a href="" onClick={e => this.changeLangauge('fr')}>
              {' '}
              <T>common.accounts.frFr</T>
            </a>
            |
            <a href="" onClick={e => this.changeLangauge('es')}>
              {' '}
              <T>common.accounts.esES</T>
            </a>
          </div>
          <a
            title="Register"
            href="/register"
            className="ngl btn-floating btn-large waves-effect  waves-light"
            data-tooltip="Register"
          >
            <i className="fa fa-sign-in" />
          </a>
        </div>
      </div>
    );
  }
}
