import React, { Component } from 'react';
import i18n from 'meteor/universe:i18n';
import { Meteor } from 'meteor/meteor';

const T = i18n.createComponent();

export default class Languages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      languages: [],
    };
  }

  componentDidMount() {
    Meteor.call('getLanguages', (error, languages) => {
      if (!error) {
        this.setState({ languages });
      }
    });
  }
  // change the language
  changeLangauge = (e, lang) => {
    switch (lang) {
      case 'fr':
        i18n.setLocale('fr-FR');
        break;
      case 'en':
        i18n.setLocale('en-US');
        break;
      case 'es':
        i18n.setLocale('es-Es');
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div className="row">
        <a href="" onClick={e => this.changeLangauge(e, 'en')}>
          <T>common.accounts.enUS</T>
        </a>
        {' |'}
        <a href="" onClick={e => this.changeLangauge(e, 'fr')}>
          {' '}
          <T>common.accounts.frFr</T>
        </a>
        |
        <a href="" onClick={e => this.changeLangauge(e, 'es')}>
          {' '}
          <T>common.accounts.esES</T>
        </a>
      </div>
    );
  }
}
