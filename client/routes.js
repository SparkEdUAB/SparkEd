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
import AllResources from '../imports/ui/components/Dashboard/AllResources.jsx';
import Feedback from '../imports/ui/components/Dashboard/Feedback.jsx';
import School from '../imports/ui/components/Dashboard/School.jsx';
import Additional from '../imports/ui/components/Dashboard/Additional.jsx';
import Program from '../imports/ui/components/Dashboard/Program.jsx';
import Courses from '../imports/ui/components/Dashboard/Courses.jsx';
import DisplayResource from '../imports/ui/components/Dashboard/DisplayResource.jsx';
import Institution from '../imports/ui/components/Dashboard/Settings/Institution.jsx';
import SyncSettings from '../imports/ui/components/Dashboard/Settings/SyncSettings.jsx';
import Notifications from '../imports/ui/components/Notifications/Notifications.jsx';
import ManageSlides from '../imports/ui/components/Dashboard/Settings/ManageSlides.jsx';
import ReferenceLibrary from '../imports/ui/components/content/ReferenceLibrary.jsx';
import Landing from '../imports/ui/components/Landing.jsx';
import AppWrapper from '../imports/ui/containers/AppWrapper';
import FileUploadComponent from '../imports/ui/containers/FileUploadComponent';
import Sidenav from '../imports/ui/components/Dashboard/Sidenav';
import SetUp from '../imports/ui/components/WalkThrough/Setup';
import ExternalLinks from '../imports/ui/components/ExternalLink/ExternalLinks.jsx';
import ExternalLinksPage from '../imports/ui/components/ExternalLink/ListExternalLinkPage.jsx';
import SyncUpdates from '../imports/ui/components/Dashboard/SyncUpdates';
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
  if (config.userAuth) {
    return loggedIn;
  }
  return exposed;
}

adminRoutes.route('/setup', {
  name: 'WalkThrough',
  action() {
    mount(SetUp, {});
  },
});

isAuthRequired().route('/', {
  name: 'Home',
  action() {
    mount(Home, {});
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
    mount(AppWrapper, { yield: <ViewResourceApp /> });
  },
});

isAuthRequired().route('/extra/view_resource/:_id', {
  name: 'ViewExtraResource',
  action(queryParams) {
    mount(AppWrapper, { yield: <DisplayResource /> });
  },
});

isAuthRequired().route('/contents/:_id', {
  name: 'Contents',
  action(params, queryParams) {
    mount(AppWrapper, { yield: <ContentsApp /> });
    // console.log("This is my blog post:", params);
  },
});

isAuthRequired().route('/contents/', {
  name: 'Contents',
  action(params, queryParams) {
    mount(AppWrapper, { yield: <ContentsApp /> });
  },
});

isAuthRequired().route('/course_content/:_id', {
  name: 'CourseContent',
  action(params, queryParams) {
    mount(AppWrapper, { yield: <CourseContent /> });
  },
});

isAuthRequired().route('/course_content/', {
  name: 'CourseContent',
  action(params, queryParams) {
    mount(AppWrapper, { yield: <CourseContent /> });
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
    mount(Sidenav, { children: <EditResources /> });
  },
});
adminRoutes.route('/dashboard/sec/edit_unit/:_id', {
  name: 'EditResources',
  action(params, queryParams) {
    mount(Sidenav, { children: <EditResources /> });
  },
});

adminRoutes.route('/dashboard/setsync', {
  name: 'SyncSettings',
  action() {
    mount(Sidenav, { children: <SyncSettings /> });
  },
});

adminRoutes.route('/dashboard/edit_unit/:_id', {
  name: 'EditUnit',
  action() {
    mount(Sidenav, { children: <EditUnit /> });
  },
});

adminRoutes.route('/dashboard/units/:_id', {
  name: 'ManageUnits',
  action(params, queryParams) {
    mount(Sidenav, { children: <ManageUnits /> });
  },
});

adminRoutes.route('/dashboard/units/prog/:_id', {
  name: 'SearchUnits',
  action(params, queryParams) {
    mount(Sidenav, { children: <ManageUnits /> });
  },
});

isAuthRequired().route('/dashboard/units/', {
  name: 'SearchUnits',
  action(params, queryParams) {
    mount(Sidenav, { children: <ManageUnits /> });
  },
});
adminRoutes.route('/dashboard/unit/:_id', {
  name: 'New Unit',
  action(params, queryParams) {
    mount(Sidenav, { children: <Unit /> });
  },
});

adminRoutes.route('/dashboard/accounts', {
  name: 'ManageAccounts',
  action() {
    mount(Sidenav, { children: <ManageAccounts /> });
  },
});
adminRoutes.route('/dashboard/extra', {
  name: 'Additional',
  action() {
    mount(Sidenav, { children: <Additional /> });
  },
});
adminRoutes.route('/dashboard/overview', {
  name: 'OverView',
  action() {
    mount(Sidenav, { children: <OverView /> });
  },
});

isAuthRequired().route('/dashboard/feedback', {
  name: 'Feedback',
  action() {
    mount(Sidenav, { children: <Feedback /> });
  },
});

adminRoutes.route('/dashboard/list_topics', {
  name: 'AllTopics',
  action() {
    mount(Sidenav, { children: <AllTopics /> });
  },
});

adminRoutes.route('/dashboard/list_resources', {
  name: 'AllResources',
  action() {
    mount(Sidenav, { children: <AllResources /> });
  },
});

adminRoutes.route('/dashboard/school', {
  name: 'School',
  action() {
    mount(Sidenav, { children: <School /> });
  },
});

adminRoutes.route('/dashboard/program/:_id', {
  name: 'Program',
  action(params) {
    mount(Sidenav, { children: <Program /> });
  },
});

adminRoutes.route('/dashboard/course/:_id', {
  name: 'Courses',
  action(params, queryParams) {
    mount(Sidenav, { children: <Courses /> });
  },
});

adminRoutes.route('/dashboard/course', {
  name: 'Courses',
  action(params) {
    mount(Sidenav, { children: <Courses /> });
  },
});

adminRoutes.route('/dashboard/settings', {
  name: 'Institution',
  action() {
    mount(Sidenav, { children: <Institution /> });
  },
});

adminRoutes.route('/dashboard/view_resource/:_id', {
  name: 'DisplayResource',
  action(queryParams) {
    mount(Sidenav, { children: <DisplayResource /> });
  },
});

isAuthRequired().route('/dashboard/slides', {
  name: 'Slides',
  action() {
    mount(Sidenav, { children: <ManageSlides /> });
  },
});

isAuthRequired().route('/externallinks', {
  name: 'External',
  action() {
    mount(Sidenav, { children: <ExternalLinks /> });
  },
});

isAuthRequired().route('/user_details/:_id', {
  name: 'UserStatistics',
  action() {
    mount(Sidenav, { children: <UserStatistics /> });
  },
});

isAuthRequired().route('/dashboard/updates', {
  name: 'Sync Updates',
  action() {
    mount(Sidenav, { children: <SyncUpdates /> });
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
    mount(ReferenceLibrary, {});
  },
});

loggedIn.route('/notifications', {
  name: 'Notifications',
  action() {
    mount(AppWrapper, { yield: <Notifications /> });
  },
});

loggedIn.route('/externallinkpages', {
  name: 'ExternalLinksPage',
  action() {
    mount(AppWrapper, { yield: <ExternalLinksPage /> });
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
