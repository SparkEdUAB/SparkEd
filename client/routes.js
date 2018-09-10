/* eslint-disable */
import { mount } from 'react-mounter';
import React from 'react';
import Home from '../imports/ui/components/Home.jsx';
import Unit from '../imports/ui/components/Dashboard/Unit.jsx';
import AutoSync from '../imports/ui/components/Sync/AutoSync.jsx';
import ManageUnits from '../imports/ui/components/Dashboard/ManageUnits.jsx';
import ViewResourceApp from '../imports/ui/components/content/ViewResourceApp.jsx';
import Register from '../imports/ui/components/Accounts/Register';
import Login from '../imports/ui/components/Accounts/Login';
import ContentsApp from '../imports/ui/components/content/ContentsApp.jsx';
import CourseContent from '../imports/ui/components/content/CourseContent.jsx';
import SearchResults from '../imports/ui/components/Search/SearchResults.jsx';
import ManageAccounts from '../imports/ui/components/Accounts/ManageAccounts.jsx';
import EditUnit from '../imports/ui/components/Dashboard/EditUnit.jsx';
import EditResources from '../imports/ui/components/Dashboard/EditResources.jsx';
import NotFound from '../imports/ui/components/layouts/NotFound';
import OverView from '../imports/ui/components/Dashboard/Statistics/Overview.jsx';
import UserStatistics from '../imports/ui/components/Dashboard/Statistics/UserStatistics';
import AllTopics from '../imports/ui/components/Dashboard/AllTopics.jsx';
import Feedback from '../imports/ui/components/Dashboard/Feedback.jsx';
import Additional from '../imports/ui/components/Dashboard/Additional.jsx';
import Courses from '../imports/ui/components/Dashboard/Courses.jsx';
import DisplayResource from '../imports/ui/components/Dashboard/DisplayResource.jsx';
import Institution from '../imports/ui/components/Dashboard/Settings/Institution.jsx';
import Notifications from '../imports/ui/components/Notifications/Notifications.jsx';
import ManageSlides from '../imports/ui/components/Dashboard/Settings/ManageSlides.jsx';
import ReferenceLibrary from '../imports/ui/components/content/ReferenceLibrary.jsx';
import Landing from '../imports/ui/components/Landing.jsx';
import AppWrapper from '../imports/ui/containers/AppWrapper';
import FileUploadComponent from '../imports/ui/containers/FileUploadComponent';
import WrappedSidenav from '../imports/ui/components/Dashboard/Sidenav';
import SetUp from '../imports/ui/components/WalkThrough/Setup';
import ExternalLinks from '../imports/ui/components/ExternalLink/ExternalLinks.jsx';
import ExternalLinksPage from '../imports/ui/components/ExternalLink/ListExternalLinkPage.jsx';
import SyncUpdates from '../imports/ui/components/Sync/SyncUpdates';
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
      } else if (!Roles.userIsInRole(Meteor.userId(), ['content-manager', 'admin'])) {
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
    mount(WrappedSidenav, { yield: <SetUp /> });
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
  action(params, queryParams) {
    mount(AppWrapper, { children: <ViewResourceApp /> });
  },
});

isAuthRequired().route('/extra/view_resource/:_id', {
  name: 'ViewExtraResource',
  action(queryParams) {
    mount(AppWrapper, { children: <DisplayResource /> });
  },
});

isAuthRequired().route('/contents/:_id', {
  name: 'Contents',
  action(params, queryParams) {
    mount(AppWrapper, { children: <ContentsApp /> });
    // console.log("This is my blog post:", params);
  },
});

isAuthRequired().route('/contents/', {
  name: 'Contents',
  action(params, queryParams) {
    mount(AppWrapper, { children: <ContentsApp /> });
  },
});

isAuthRequired().route('/course_content/:_id', {
  name: 'CourseContent',
  action(params, queryParams) {
    mount(AppWrapper, { children: <CourseContent /> });
  },
});

isAuthRequired().route('/course_content/', {
  name: 'CourseContent',
  action(params, queryParams) {
    mount(AppWrapper, { children: <CourseContent /> });
  },
});

isAuthRequired().route('/results', {
  name: 'Results',
  action() {
    mount(SearchResults, {});
  },
});

isAuthRequired().route('/sync', {
  name: 'Sync',
  action() {
    mount(AutoSync, {});
  },
});

isAuthRequired().route('/request', {
  name: 'Request',
  action() {
    mount(ProcessRequest, {});
  },
});
adminRoutes.route('/dashboard/edit_resources/:_id', {
  name: 'EditResources',
  action(params, queryParams) {
    mount(WrappedSidenav, { yield: <EditResources /> });
  },
});
adminRoutes.route('/dashboard/isHighSchool/edit_unit/:_id', {
  name: 'EditResources',
  action(params, queryParams) {
    mount(WrappedSidenav, { yield: <EditResources /> });
  },
});

adminRoutes.route('/dashboard/edit_unit/:_id', {
  name: 'EditUnit',
  action() {
    mount(WrappedSidenav, { yield: <EditUnit /> });
  },
});

adminRoutes.route('/dashboard/units/:_id', {
  name: 'ManageUnits',
  action(params, queryParams) {
    mount(WrappedSidenav, { yield: <ManageUnits /> });
  },
});

adminRoutes.route('/dashboard/units/prog/:_id', {
  name: 'SearchUnits',
  action(params, queryParams) {
    mount(WrappedSidenav, { yield: <ManageUnits /> });
  },
});

isAuthRequired().route('/dashboard/units/', {
  name: 'SearchUnits',
  action(params, queryParams) {
    mount(WrappedSidenav, { yield: <ManageUnits /> });
  },
});
adminRoutes.route('/dashboard/unit/:_id', {
  name: 'New Unit',
  action(params, queryParams) {
    mount(WrappedSidenav, { yield: <Unit /> });
  },
});

adminRoutes.route('/dashboard/accounts', {
  name: 'ManageAccounts',
  action() {
    mount(WrappedSidenav, { yield: <ManageAccounts /> });
  },
});
adminRoutes.route('/dashboard/extra', {
  name: 'Additional',
  action() {
    mount(WrappedSidenav, { yield: <Additional /> });
  },
});
adminRoutes.route('/dashboard/overview', {
  name: 'OverView',
  action() {
    mount(WrappedSidenav, { yield: <OverView /> });
  },
});

isAuthRequired().route('/dashboard/feedback', {
  name: 'Feedback',
  action() {
    mount(WrappedSidenav, { yield: <Feedback /> });
  },
});

adminRoutes.route('/dashboard/list_topics', {
  name: 'AllTopics',
  action() {
    mount(WrappedSidenav, { yield: <AllTopics /> });
  },
});

adminRoutes.route('/dashboard/course/:_id', {
  name: 'Courses',
  action(params, queryParams) {
    mount(WrappedSidenav, { yield: <Courses /> });
  },
});

adminRoutes.route('/dashboard/course', {
  name: 'Courses',
  action(params) {
    mount(WrappedSidenav, { yield: <Courses /> });
  },
});

adminRoutes.route('/dashboard/settings', {
  name: 'Institution',
  action() {
    mount(WrappedSidenav, { yield: <Institution /> });
  },
});

adminRoutes.route('/dashboard/view_resource/:_id', {
  name: 'DisplayResource',
  action(queryParams) {
    mount(WrappedSidenav, { yield: <DisplayResource /> });
  },
});

isAuthRequired().route('/dashboard/slides', {
  name: 'Slides',
  action() {
    mount(WrappedSidenav, { yield: <ManageSlides /> });
  },
});

isAuthRequired().route('/externallinks', {
  name: 'External',
  action() {
    mount(WrappedSidenav, { yield: <ExternalLinks /> });
  },
});

isAuthRequired().route('/user_details/:_id', {
  name: 'UserStatistics',
  action() {
    mount(WrappedSidenav, { yield: <UserStatistics /> });
  },
});

isAuthRequired().route('/dashboard/updates', {
  name: 'Sync Updates',
  action() {
    mount(WrappedSidenav, { yield: <SyncUpdates /> });
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
  action(queryParams) {
    mount(ReferenceLibrary, {});
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
