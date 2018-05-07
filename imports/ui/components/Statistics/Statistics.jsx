import { Meteor } from 'meteor/meteor';

export function insertStatistics(data) {
  Meteor.call('insertUsage', data, (err, result) => {

  });
}
