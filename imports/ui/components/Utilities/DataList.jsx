import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export default class DataList extends Component {
  renderOptions() {
    return this.props.options.map(item => (
      <DataOption
        key={item._id}
        showData={this.props.showData}
        val={item.name}
        id={item._id}
        clas={this.props.id}
        data={item}
      />
      // note that parent's id it passed as  a className for children
    ));
  }

  componentDidMount() {
    $(`#${this.props.id}`).bind('change', this.props.change);
    $('select').material_select();
  }

  render() {
    return (
      <div className="input-fields col s12">
        <label>{this.props.title}:</label>
        <select className="data-list browser-default" id={this.props.id} name={this.props.name}>
          <option value="" />
          {this.renderOptions()}
        </select>
      </div>
    );
  }
}

export const DataOption = ({
  showData, data, id, clas, val,
}) => {
  const content = showData ? JSON.stringify(data) : '';
  return (
    <option value={id} className={`dt dt${clas}`} data={content}>
      {val}
    </option>
  );
};

DataOption.propTypes = {
  showData: PropTypes.bool,
  data: PropTypes.object,
  id: PropTypes.string,
  clas: PropTypes.string,
  val: PropTypes.string,
};

DataList.propTypes = {
  title: PropTypes.string.isRequired, // label title
  id: PropTypes.string.isRequired, // input id matching the DataList Dom
  name: PropTypes.string.isRequired, // value for name attribute
  options: PropTypes.array.isRequired, // json dataobject with _id & name as required keys
  showData: PropTypes.bool.isRequired, // json dataobject with _id & name as required keys
  change: PropTypes.func.isRequired,
};
