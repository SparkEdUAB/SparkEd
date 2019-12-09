import React from 'react';
import './searchpage.css';

export default function SearchPage() {
  return (
        <div className="search-page">
            <div className="row">
                <div className="input-field col s12">
                    <input placeholder="Search here" type="text" className="validate" />
                </div>
            </div>
        </div>
  );
}
