import React from 'react';
import { PropTypes } from 'prop-types';

const DataList = props => (
  <ul className="collection with-header">
    <li className="collection-header">
      <h5> {props.title}</h5>
    </li>
    <li className="collection-item">
      <div>
        Courses<a href="#!" className="secondary-content">
          <span className="blue-text">{props.count.courses}</span>
        </a>
      </div>
    </li>
    <li className="collection-item">
      <div>
        Units<a href="#!" className="secondary-content">
          <span className="blue-text">{props.count.units}</span>
        </a>
      </div>
    </li>
    <li className="collection-item">
      <div>
        Topics<a href="#!" className="secondary-content">
          <span className="blue-text">{props.count.topics}</span>
        </a>
      </div>
    </li>
    <li className="collection-item">
      <div>
        Resources<a href="#!" className="secondary-content">
          <span className="blue-text">{props.count.resources}</span>
        </a>
      </div>
    </li>
    <li className="collection-item">
      <div>
        References<a href="#!" className="secondary-content">
          <span className="blue-text">{props.count.references}</span>
        </a>
      </div>
    </li>
  </ul>
);

DataList.propTypes = {
  count: PropTypes.object,
  title: PropTypes.string,
};
export default DataList;
