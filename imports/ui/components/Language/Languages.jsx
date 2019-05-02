import React, { PureComponent } from 'react';
import i18n from 'meteor/universe:i18n';
import { Session } from 'meteor/session';

export const T = i18n.createComponent();

export default class Languages extends PureComponent {
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
        i18n.setLocale('fr-fr');
        localStorage.setItem('locale', 'fr-fr');
        Session.set('language', 'french');
        break;
      case 'en':
        i18n.setLocale('en-us');
        localStorage.setItem('locale', 'en-us');
        Session.set('language', 'english');
        break;
      case 'es':
        i18n.setLocale('es-es');
        localStorage.setItem('locale', 'es-us');
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
