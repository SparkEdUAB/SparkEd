import { mount } from 'react-mounter';
import React from 'react';
import Home from '../imports/ui/components/Home.jsx';
import Unit from '../imports/ui/components/Dashboard/Unit.jsx';
import AutoSync from '../imports/ui/components/Sync/AutoSync.jsx';
import ManageUnits from '../imports/ui/components/Dashboard/ManageUnits.jsx';
import ViewResourceApp from '../imports/ui/components/content/ViewResourceApp.jsx';
import Register from '../imports/ui/components/Accounts/Register.jsx';
import Login from '../imports/ui/components/Accounts/Login.jsx';
import ContentsApp from '../imports/ui/components/content/ContentsApp.jsx';
import CourseContent from '../imports/ui/components/content/CourseContent.jsx';
import SearchResults from '../imports/ui/components/Search/SearchResults.jsx';
import ManageAccounts from '../imports/ui/components/Accounts/ManageAccounts.jsx';
import EditUnit from '../imports/ui/components/Dashboard/EditUnit.jsx';
import EditResources from '../imports/ui/components/Dashboard/EditResources.jsx';
import NotFound from '../imports/ui/components/layouts/NotFound.jsx';
import OverView from '../imports/ui/components/Dashboard/Statistics/Overview.jsx';
import UserStatistics from '../imports/ui/components/Dashboard/Statistics/UserStatistics.jsx';
import Stats from '../imports/ui/components/Dashboard/Statistics/Stats.jsx';
import AllTopics from '../imports/ui/components/Dashboard/AllTopics.jsx';
import Feedback from '../imports/ui/components/Dashboard/Feedback.jsx';
import Additional from '../imports/ui/components/Dashboard/Additional.jsx';
import Courses from '../imports/ui/components/Dashboard/Courses.jsx';
import DisplayResource from '../imports/ui/components/Dashboard/DisplayResource.jsx';
import Notifications from '../imports/ui/components/Notifications/Notifications.jsx';
import ManageSlides from '../imports/ui/components/Dashboard/Settings/ManageSlides.jsx';
import ReferenceLibrary from '../imports/ui/components/content/ReferenceLibrary.jsx';
import Landing from '../imports/ui/components/Landing.jsx';
import AppWrapper from '../imports/ui/containers/AppWrapper.jsx';
import FileUploadComponent from '../imports/ui/containers/FileUploadComponent.jsx';
import WrappedSidenav from '../imports/ui/components/Dashboard/Sidenav.jsx';
import SetUp from '../imports/ui/components/WalkThrough/Setup.jsx';
import ExternalLinks from '../imports/ui/components/ExternalLink/ExternalLinks.jsx';
import ExternalLinksPage from '../imports/ui/components/ExternalLink/ListExternalLinkPage.jsx';
import SyncUpdates from '../imports/ui/components/Sync/SyncUpdates.jsx';
import Backup from '../imports/ui/components/Dashboard/Backup/Backup.jsx';
import UnitsTopics from '../imports/ui/components/content/UnitsTopics.jsx';

const config = require('../config.json');

const exposed = FlowRouter.group({});

const loggedIn = FlowRouter.group({
  triggersEnter: [
    () => {
      if (!(Meteor.loggingIn() || Meteor.userId())) {
        return FlowRouter.go('/login');
      }
    },
  ],
});

const adminRoutes = FlowRouter.group({
  triggersEnter: [
    () => {
      if (!(Meteor.loggingIn() || Meteor.userId())) {
        return FlowRouter.go('/login');
      } else if (
        !Roles.userIsInRole(Meteor.userId(), ['content-manager', 'admin'])
      ) {
        return FlowRouter.go('/');
      }
    },
  ],
});

export default function isAuthRequired() {
  if (config.isUserAuth) {
    return loggedIn;
  }
  return exposed;
}

adminRoutes.route('/setup', {
  name: 'WalkThrough',
  action() {
    mount(WrappedSidenav, { yield: <SetUp />, isAtSetup: true });
  },
});

isAuthRequired().route('/', {
  name: 'Home',
  action() {
    mount(AppWrapper, { children: <Home /> });
  },
});

exposed.route('/register', {
  name: 'Register',
  action() {
    mount(Register, {});
  },
});

exposed.route('/login', {
  name: 'Login',
  action() {
    mount(Login, {});
  },
});

isAuthRequired().route('/view_resource/:_id', {
  name: 'Home',
  action() {
    mount(AppWrapper, { children: <ViewResourceApp /> });
  },
});

isAuthRequired().route('/extra/view_resource/:_id', {
  name: 'ViewExtraResource',
  action() {
    mount(AppWrapper, { children: <DisplayResource /> });
  },
});

isAuthRequired().route('/contents/:_id', {
  name: 'Contents',
  action() {
    mount(AppWrapper, { children: <ContentsApp /> });
  },
});

isAuthRequired().route('/contents/', {
  name: 'Contents',
  action() {
    mount(AppWrapper, { children: <ContentsApp /> });
  },
});

isAuthRequired().route('/course_content/:_id', {
  name: 'CourseContent',
  action() {
    mount(AppWrapper, { children: <CourseContent /> });
  },
});

isAuthRequired().route('/course_content/', {
  name: 'CourseContent',
  action() {
    mount(AppWrapper, { children: <CourseContent /> });
  },
});

isAuthRequired().route('/results', {
  name: 'Results',
  action() {
    mount(AppWrapper, { children: <SearchResults /> });
  },
});

isAuthRequired().route('/sync', {
  name: 'Sync',
  action() {
    mount(AutoSync, {});
  },
});

adminRoutes.route('/dashboard/edit_resources/:_id', {
  name: 'EditResources',
  action() {
    mount(WrappedSidenav, { yield: <EditResources />, isAtCourse: true });
  },
});
adminRoutes.route('/dashboard/isHighSchool/edit_unit/:_id', {
  name: 'EditResources',
  action() {
    mount(WrappedSidenav, { yield: <EditResources />, isAtCourse: true });
  },
});

adminRoutes.route('/dashboard/edit_unit/:_id', {
  name: 'EditUnit',
  action() {
    mount(WrappedSidenav, { yield: <EditUnit />, isAtCourse: true });
  },
});

adminRoutes.route('/dashboard/units/:_id', {
  name: 'ManageUnits',
  action() {
    mount(WrappedSidenav, { yield: <ManageUnits />, isAtCourse: true });
  },
});

adminRoutes.route('/dashboard/units/prog/:_id', {
  name: 'SearchUnits',
  action() {
    mount(WrappedSidenav, { yield: <ManageUnits />, isAtCourse: true });
  },
});

isAuthRequired().route('/dashboard/units/', {
  name: 'SearchUnits',
  action() {
    mount(WrappedSidenav, { yield: <ManageUnits />, isAtCourse: true });
  },
});
adminRoutes.route('/dashboard/unit/:_id', {
  name: 'New Unit',
  action() {
    mount(WrappedSidenav, { yield: <Unit />, isAtCourse: true });
  },
});

adminRoutes.route('/dashboard/accounts', {
  name: 'ManageAccounts',
  action() {
    mount(WrappedSidenav, { yield: <ManageAccounts />, isAtAccounts: true });
  },
});
adminRoutes.route('/dashboard/extra', {
  name: 'Additional',
  action() {
    mount(WrappedSidenav, { yield: <Additional />, isAtExtra: true });
  },
});
adminRoutes.route('/dashboard/overview', {
  name: 'OverView',
  action() {
    mount(WrappedSidenav, { yield: <OverView />, isAtStats_: true });
  },
});

isAuthRequired().route('/dashboard/feedback', {
  name: 'Feedback',
  action() {
    mount(WrappedSidenav, { yield: <Feedback />, isAtFeedback: true });
  },
});

adminRoutes.route('/dashboard/list_topics', {
  name: 'AllTopics',
  action() {
    mount(WrappedSidenav, { yield: <AllTopics />, isAtTopics: true });
  },
});

adminRoutes.route('/dashboard/course/:_id', {
  name: 'Courses',
  action() {
    mount(WrappedSidenav, { yield: <Courses />, isAtCourse: true });
  },
});

adminRoutes.route('/dashboard/course', {
  name: 'Courses',
  action() {
    mount(WrappedSidenav, { yield: <Courses />, isAtCourse: true });
  },
});

adminRoutes.route('/dashboard/stats', {
  name: 'Stats',
  action() {
    mount(WrappedSidenav, { yield: <Stats />, isAtStats: true });
  },
});

adminRoutes.route('/dashboard/view_resource/:_id', {
  name: 'DisplayResource',
  action() {
    mount(WrappedSidenav, { yield: <DisplayResource />, isAtExtra: true });
  },
});

isAuthRequired().route('/dashboard/slides', {
  name: 'Slides',
  action() {
    mount(WrappedSidenav, { yield: <ManageSlides />, isAtSlides: true });
  },
});

isAuthRequired().route('/externallinks', {
  name: 'External',
  action() {
    mount(WrappedSidenav, {
      yield: <ExternalLinks />,
      isAtExternallinks: true,
    });
  },
});

isAuthRequired().route('/user_details/:_id', {
  name: 'UserStatistics',
  action() {
    mount(WrappedSidenav, { yield: <UserStatistics />, isAtStats_: true });
  },
});

isAuthRequired().route('/dashboard/updates', {
  name: 'Sync Updates',
  action() {
    mount(WrappedSidenav, { yield: <SyncUpdates />, isAtUpdates: true });
  },
});

FlowRouter.notFound = {
  action() {
    mount(NotFound, {});
  },
};

isAuthRequired().route('/reference', {
  name: 'ReferenceLibrary',
  action() {
    mount(AppWrapper, { children: <ReferenceLibrary /> });
  },
});

loggedIn.route('/notifications', {
  name: 'Notifications',
  action() {
    mount(AppWrapper, { children: <Notifications /> });
  },
});

loggedIn.route('/externallinkpages', {
  name: 'ExternalLinksPage',
  action() {
    mount(AppWrapper, { children: <ExternalLinksPage /> });
  },
});

isAuthRequired().route('/reference/:_id', {
  name: 'ReferenceLibrary',
  action() {
    mount(AppWrapper, { children: <ReferenceLibrary /> });
  },
});

// route for the landing page
FlowRouter.route('/home', {
  name: 'Landing',
  action() {
    mount(Landing, {});
  },
});
// FileUploadComponent

FlowRouter.route('/fileupload', {
  name: 'FileUploadComponent',
  action() {
    mount(FileUploadComponent, {});
  },
});

isAuthRequired().route('/dashboard/backup', {
  name: 'Backup',
  action() {
    mount(WrappedSidenav, { yield: <Backup />, isAtBackup: true });
  },
});
isAuthRequired().route('/testunits', {
  name: 'TestUnits',
  action() {
    mount(UnitsTopics);
  },
});
