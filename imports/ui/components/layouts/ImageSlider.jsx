/* eslint class-methods-use-this: "off" */
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import M from 'materialize-css';
import { PropTypes } from 'prop-types';
import { Slides } from '../../../api/settings/slides';

let timeOut;
export class ImgSlider extends Component {
  componentWillUnmount() {
    Meteor.clearTimeout(timeOut);
  }

  componentDidMount() {
    const elem = document.querySelector('.slider');
    const instance = M.Slider.init(elem, {});
    timeOut = Meteor.setTimeout(() => instance.start(), 200);
  }
  renderSlider(slides) {
    if (!slides || !slides.length) {
      return (
        <li>
          <div
            className="center"
            style={{
              marginTop: 120,
            }}
          >
            <h4 className="light white-text text-lighten-1">
              Welcome To SparkEd
            </h4>
            <h5 className="light white-text text-lighten-1">
              Upload images From the Dashboard to show as slides here
            </h5>
          </div>
        </li>
      );
    }
    return slides.map(slide => (
      <li key={slide._id}>
        <img src={`/uploads/slides/${slide._id}.${slide.ext}`} />
      </li>
    ));
  }
  render() {
    const { isDark, slides } = this.props;
    return (
      <div
        className="slider"
        style={{
          marginTop: '-21px',
        }}
      >
        <ul
          className="slides"
          style={{
            backgroundColor: isDark ? '#0c0c0c' : '#9e9e9e',
          }}
        >
          {this.renderSlider(slides)}
        </ul>
      </div>
    );
  }
}

ImgSlider.propTypes = {
  slides: PropTypes.array,
  isDark: PropTypes.bool,
};

export default withTracker(() => {
  Meteor.subscribe('slides');
  return {
    slides: Slides.find({}).fetch(),
  };
})(ImgSlider);
