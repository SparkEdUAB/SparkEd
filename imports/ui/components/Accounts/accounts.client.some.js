import checkPassword from './accounts.client'; // eslint-disable-line

test('The two passwords should be equal', () => {
  expect(checkPassword('olivier', 'oliier')).toHaveProperty('msg', 'Passowrds do not match');
  expect(checkPassword('iver', 'iver')).toHaveProperty(
    'msg',
    'Passowrd length must be greater five(5)',
  );
  expect(checkPassword('123456', '123456')).toHaveProperty('status', true);
});
