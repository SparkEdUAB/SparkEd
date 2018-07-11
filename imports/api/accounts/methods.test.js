import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { chai, expect } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

describe('Accounts', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('should be able to create a user', () => {
    const createUser = new Promise((resolve, reject) => {
      Accounts.createUser({
        username: 'demo',
        email: 'demo@demo.com',
        password: 'demopassword',
      });
    });
    return createUser
      .then((newUser) => {
        expect(newUser).to.not.be.undefined;
        expect(newUser.username).to.equal('demo');
      })
      .done();
  });
});
