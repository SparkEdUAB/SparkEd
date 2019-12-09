import React from 'react';
import './searchpage.css';

export default function SearchPage() {
  return (
        <div className="search-page">
            <div className="row">
                <div className="input-field col s12">
                    <input style={{
                        fontSize: '1.8em',
                        color: '#838383',
                        padding: 20,
                    }} placeholder="Search here" type="text" className="validate" autoFocus />
                </div>
            </div>
        </div>
  );
}
