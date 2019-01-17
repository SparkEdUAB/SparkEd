import { Meteor } from 'meteor/meteor';

/** isLoggedIn
checks if user is logged in.else redirect the user  to the
login page if not logged in
@return null
* */
export function isLoggedIn() {
  if (!Meteor.userId()) {
    FlowRouter.go('/login');
  }
}

/** isLoggedOut
 * checks if user is logged out. redirect the user  to the
 * home page if  logged in
 * @return null

 */
export function isLoggedOut() {
  if (Meteor.userId()) {
    FlowRouter.go('/');
  }
}

/**
 *
 * @param {* String } password
 * @param {* String } password2
 * @method Compare the 2 strings to check if they are equal and length longer than 5 characters
 * @returns object with msg and status
 */
export function checkPassword(password, password2) {
  if (password.trim() !== password2.trim()) {
    return {
      msg: 'Passowrds do not match',
      status: false,
    };
  } else if (password.length < 6) {
    return {
      msg: 'Password length must be greater five(5)',
      status: false,
    };
  }
  return {
    msg: 'Passowrd ok',
    status: true,
  };
}
