import React, { useState } from 'react';
import './searchpage.css';

export default function SearchPage() {
  const [value, setValue] = useState('');
  function handleSubmit() {
    return FlowRouter.go(`/results?q=${value}`);
  }
  return (
        <div className="center-page">
            <form
                action={'/results'}
                onSubmit={handleSubmit}
                method="get"
            >
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            style={{
                                fontSize: '1.8em',
                                color: '#838383',
                                padding: 20,
                            }}
                            name={'search'}
                            type="search"
                            value={value}
                            placeholder="Type and Press enter to search"
                            onChange={e => setValue(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>
            </form>
        </div>
  );
}
