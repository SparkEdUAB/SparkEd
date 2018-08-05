// Essential for the roles package to initialise and check if the user is in roles for real
import { Roles } from 'meteor/alanning:roles';
import '../imports/ui/stylesheets/wizard.css';
import '../imports/ui/stylesheets/loader.css';
import '../imports/ui/stylesheets/landing.css';
import '../imports/ui/stylesheets/header.css';
import '../imports/ui/stylesheets/overwrites.css';
import '../imports/ui/stylesheets/register.css';
import '../imports/ui/stylesheets/mainModal.css';
import '../imports/api/languages/language';
// import { La }

FlowRouter.wait();

Tracker.autorun(() => {
  if (Roles.subscription.ready() && !FlowRouter._initialized) {
    FlowRouter.initialize();
  }
});
