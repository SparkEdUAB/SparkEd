import React, { Component } from 'react';
import i18n from 'meteor/universe:i18n';
import { Session } from 'meteor/session';

export const T = i18n.createComponent();

export default class Languages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      languages: [],
    };
    i18n.setLocale(localStorage.getItem('locale'));
  }

  // the folloowing languages will need to be named properly
  changeLangauge = (e, lang) => {
    switch (lang) {
      case 'fr':
        i18n.setLocale('fr-FR');
        localStorage.setItem('locale', 'fr-FR');
        Session.set('language', 'french');
        break;
      case 'en':
        i18n.setLocale('en-US');
        localStorage.setItem('locale', 'en-US');
        Session.set('language', 'english');
        break;
      case 'es':
        i18n.setLocale('es-Es');
        localStorage.setItem('locale', 'es-ES');
        Session.set('language', 'ethiopian');
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div className="row">
        <a href="" onClick={e => this.changeLangauge(e, 'en')}>
          <T>common.language.enUS</T>
        </a>
        {' |'}
        <a href="" onClick={e => this.changeLangauge(e, 'fr')}>
          {' '}
          <T>common.language.frFr</T>
        </a>
        |
        <a href="" onClick={e => this.changeLangauge(e, 'es')}>
          {' '}
          <T>common.language.esES</T>
        </a>
      </div>
    );
  }
}
