import React from 'react';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';

const withLanguages = defaultState => Component =>
  class WithSimpleState extends React.Component {
    constructor(props) {
      super(props);
      this.state = { languages: [] };
    }
    componentDidMount() {
      Meteor.call('getLanguages', (error, languages) => {
        if (!error) {
          this.setState({ languages });
        }
      });
    }

    render() {
      return (
        <Component {...this.props} stateValue={this.state.value} stateHandler={this.updateState} />
      );
    }
  };

export default withLanguages;
