import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Resource from './Resource.jsx';
import { _Topics } from '../../../api/topics/topics';
import { getUnitId, getTopicId } from './ContentsApp.jsx';
import { _FileDetails } from '../../../api/resources/resources';
import { Resources } from '../../../api/resources/resources';
import * as config from '../../../../config.json';

// display Resources based on the topic clicked
export class Resourcesss extends Component {
  renderResources() {
    const { resourcess } = this.props;
    if (!resourcess) {
      return null;
    }

    const videos = [];
    const books = [];
    const images = [];
    const audio = [];
    const presentations = [];
    const allResources = resourcess;
    let topicId;
    const ppt = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

    allResources.map(resource => {
      const { type, ext } = resource;
      topicId = resource.topicId;
      if (type === 'video/mp4') {
        videos.push(resource);
      } else if (type === 'application/pdf') {
        books.push(resource);
      } else if (type === 'audio/mp3') {
        audio.push(resource);
      } else if (type === 'image/png' || type === 'image/jpeg' || type === 'image/jpg') {
        images.push(resource);
      } else if (type === ppt) {
        presentations.push(resource);
      }
    });

    return (
      <Fragment>
        <div className="col s12">
          {videos.map(vid => (
            <Resource
              key={vid._id}
              resource={vid.name}
              topicId={vid.meta.topicId || vid.meta.unitId}
              resourceId={vid._id}
              file={vid.type}
            />
          ))}
        </div>
        <div className="col s12">
          {books.map(book => (
            <Resource
              key={book._id}
              resource={book.name}
              topicId={book.meta.topicId || book.meta.unitId}
              resourceId={book._id}
              file={book.type}
            />
          ))}
        </div>
        <div className="col s12">
          {images.map(image => (
            <Resource
              key={image._id}
              resource={image.name}
              topicId={image.meta.topicId || image.meta.unitId}
              resourceId={image._id}
              file={image.type}
            />
          ))}
        </div>
        <div className="col s12">
          {audio.map(aud => (
            <Resource
              key={aud._id}
              resource={aud.name}
              topicId={aud.meta.topicId || aud.meta.unitId}
              resourceId={aud._id}
              file={aud.type}
            />
          ))}
        </div>
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        <div className="row">
          <div className="col s12">{this.renderResources()}</div>
        </div>
      </Fragment>
    );
  }
}

Resourcesss.propTypes = {
  topicId: PropTypes.string,
  resourcess: PropTypes.array,
};

export default withTracker(params => {
  Meteor.subscribe('topics');
  Meteor.subscribe('resourcess');
  if (config.sec) {
    return {
      resourcess: Resources.find(
        {
          'meta.unitId': params.topicId,
        },
        { sort: { type: 1 } },
      ).fetch(),
    };
  }
  return {
    resourcess: Resources.find(
      {
        'meta.topicId': getTopicId(),
        'meta.unitId': getUnitId(),
      },
      { sort: { type: 1 } },
    ).fetch(),
  };
})(Resourcesss);
