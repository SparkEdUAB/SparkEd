/* eslint class-methods-use-this: "off" */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// const ThemeContext = React.createContext('light');
export const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};

export const ThemeContext = React.createContext(
  themes.dark, // default value
);
