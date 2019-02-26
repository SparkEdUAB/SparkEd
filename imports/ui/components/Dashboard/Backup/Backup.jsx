import React from 'react';
import { ThemeContext } from '../../../containers/AppWrapper'; // eslint-disable-line

function Backup() {
  return (
    <ThemeContext.Consumer>
      {({ state }) => (
        <div
          className="col m9 s11"
          style={{ color: state.isDark ? '#F5FAF8' : '#000000' }}
        >
          Download the latest backup here <br />
          <a href="dump.tar.gz" download>
            Download{' '}
          </a>
        </div>
      )}
    </ThemeContext.Consumer>
  );
}
export default Backup;
