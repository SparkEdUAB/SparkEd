import React, { Component } from 'react';
import M from 'materialize-css';
import { checkPassword } from './AccountFunction.js';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    };
  }
  componentDidMount() {
    M.AutoInit();
  }
  registerUser = e => {
    e.preventDefault();
    const name = e.target.full_name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const passwordConfirm = e.target.passwordConfirm.value;
    const gender = e.target.gender.value;
    const pwdResults = checkPassword(password, passwordConfirm);

    // even if an error shows make sure the user doesn't get created when 2 passwords don't match
    if (pwdResults.status === false) {
      return;
    }

    Meteor.call('accountExist', email, (err, result) => {
      if (result) {
        this.setState({
          error: result,
        });
        return;
      }
      const profile = {
        gender,
        name,
        status: 0,
        stats: 1,
      };
      const userDetails = { email, password, profile };
      Meteor.call('user.insert', userDetails, error => {
        if (error !== undefined) {
          this.setState({
            error: error.reason,
          });
        } else {
          M.toast({
            html: '<span>Account created successfully</span>',
          });
          return FlowRouter.go('/login');
        }
      });
    });
  };

  checkEnteredPassword = ({ target: { value } }) => {
    const passwordConfirm = value;
    const { password } = this.state;
    Meteor.setTimeout(() => {
      if (password !== passwordConfirm) {
        this.setState({
          error: 'Passwords do not match',
        });
        return false;
      }
      this.setState({
        error: null,
      });
    }, 500);
  };

  setPassword = ({ target: { value } }) => {
    this.setState({
      password: value,
    });
  };

  render() {
    const { error } = this.state;
    return (
      <div>
        <div className="register-page">
          <div className="container account-container">
            <div className="row">
              <form
                className="col s12"
                id="reg-form"
                onSubmit={this.registerUser}
              >
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      id="first_name"
                      type="text"
                      className="validate"
                      required
                      name="full_name"
                    />
                    <label htmlFor="first_name">Full Name</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      id="email"
                      type="email"
                      className="validate"
                      required
                      name="email"
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s6">
                    <input
                      id="password"
                      type="password"
                      className="validate"
                      minLength="6"
                      required
                      name="password"
                      onChange={this.setPassword}
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                  <div className="input-field col s6">
                    <input
                      id="passwordConfirm"
                      type="password"
                      className="validate"
                      minLength="6"
                      required
                      name="passwordConfirm"
                      onChange={this.checkEnteredPassword}
                    />
                    <label htmlFor="passwordConfirm">Confirm Password</label>
                  </div>
                </div>
                <div className="row">
                  <div className="col s6">
                    <p className="gender-male">
                      <label>
                        <input
                          name="gender"
                          type="radio"
                          id="male"
                          value="male"
                          required
                        />
                        <span>Male</span>
                      </label>
                    </p>
                    <p className="gender-female">
                      <label>
                        <input
                          name="gender"
                          type="radio"
                          id="female"
                          value="female"
                          required
                        />
                        <span>Female</span>
                      </label>
                    </p>
                  </div>

                  <div className="input-field col s6">
                    <button
                      className="btn btn-large btn-register waves-effect waves-light"
                      type="submit"
                    >
                      Register
                      <i className="fa fa-send right" />
                    </button>
                  </div>
                </div>
                {error ? (
                  <div className="row">
                    <p className="red-text">{error}</p>
                  </div>
                ) : (
                  <span />
                )}
              </form>
            </div>
            <a
              title="Login"
              href="/login"
              className="ngl btn-floating btn-large waves-effect  waves-light"
            >
              <i className="fa fa-sign-in" />
            </a>
            <a href="/login">Login here </a> if you already have an account
          </div>
        </div>
      </div>
    );
  }
}
