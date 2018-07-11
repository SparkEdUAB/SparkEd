const sum = require('./sum');

test('the sum of two numbers', () => {
  expect(sum(2, 3)).toBe(5);
});
