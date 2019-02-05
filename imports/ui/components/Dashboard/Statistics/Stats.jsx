import React from 'react';

export function Stats() {
  return (
    <div className="col m9 s11">
      <StatView />
      <StatView />
      <StatView />
    </div>
  );
}

function StatView() {
  return (
    <div className="col s6 m4">
      <div className="card-panel teal">
        <h1 className="white-text center-align">100</h1>
        <br />
        <h5 className="white-text center-align">users</h5>
      </div>
    </div>
  );
}

export default Stats;
