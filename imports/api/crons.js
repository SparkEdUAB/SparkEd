/* eslint no-undef: 0 */
SyncedCron.add({
  name: 'Delete Notifications that are older than 30days',
  schedule: parser => parser.text('every 24 hours'),
  job: () => {
    Meteor.call('dropNotifications');
  },
});

// start the cronjob
SyncedCron.start();