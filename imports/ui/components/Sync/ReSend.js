import React from 'react';
import PropTypes from 'prop-types';

export class List extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
  };

  state = {
    list: [],
    isLoading: false,
  };

  _fetch = async () => {
    const res = await fetch(this.props.url);
    const json = await res.json();
    this.setState({
      list: json,
      count: json.data.length,
      isLoading: false,
    });
  };

  componentDidMount() {
    this.setState({ isLoading: true }, this._fetch);
  }

  render() {
    return this.props.render(this.state);
  }
}
