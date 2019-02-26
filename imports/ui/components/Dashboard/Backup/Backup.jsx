import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ThemeContext } from '../../../containers/AppWrapper'; // eslint-disable-line

function Backup() {
  return (
    <ThemeContext.Consumer>
      {({ state }) => (
        <div
          className="col m9 s11"
          style={{ color: state.isDark ? '#F5FAF8' : '#000000' }}
        >
          Backup
          <button
            className="btn"
            onClick={() => Meteor.call('restoreDbChunks')}
          >
            Download backup
          </button>
        </div>
      )}
    </ThemeContext.Consumer>
  );
}
export default Backup;
