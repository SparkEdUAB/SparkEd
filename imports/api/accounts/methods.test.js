import { Accounts } from 'meteor/accounts-base';
import { expect } from 'meteor/practicalmeteor:chai'; // eslint-disable-line
import { resetDatabase } from 'meteor/xolvio:cleaner'; // eslint-disable-line

describe('Accounts', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('should be able to create a user', () => {
    const createUser = new Promise(() => {
      Accounts.createUser({
        username: 'demo',
        email: 'demo@demo.com',
        password: 'demopassword',
      });
    });
    return createUser
      .then((newUser) => {
        expect(newUser).to.not.be.undefined; // eslint-disable-line
        expect(newUser.username).to.equal('demo');
      })
      .done();
  });
});
