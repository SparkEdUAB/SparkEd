import React from 'react';
import Header from './Header';

const NotFound = () => (
    <div>
      <Header />
        <h1 className="notFoundHead">404 !</h1>
        <h3 className="notFound"> Oooops Page not Found Take me <a href="/">Home</a></h3>
      </div>
);
export default NotFound;
