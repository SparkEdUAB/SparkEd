import React from 'react';
import PropTypes from 'prop-types';

export default class Collection extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
  };
  state = {
    list: {},
    isLoading: false,
    count: 0,
  };

  _fetch = async () => {
    const baseUrl = 'http://13.232.61.192/api/';
    const { name } = this.props;
    const res = await fetch(`${baseUrl}${name}`);
    const json = await res.json();
    switch (name) {
      case 'course':
        this.setState({
          list: { course: json },
          count: json.data.length,
          isLoading: false,
        });
        break;

      default:
        break;
    }
  };

  componentDidMount() {
    this.setState({ isLoading: true }, this._fetch);
  }

  render() {
    const { isLoading, count, list } = this.state;
    const { name } = this.props;
    return (
      <li className="collection-item">
        <div>
          {name}
          <a href="#!" className="secondary-content">
            <span className="blue-text">{}</span>
          </a>
        </div>
      </li>
    );
  }
}
