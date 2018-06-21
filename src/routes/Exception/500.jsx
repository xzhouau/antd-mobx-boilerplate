import React from 'react';
import { Link } from 'react-router-dom';
import Exception from 'components/Exception';

const ServerError = () => (<Exception
  type='500'
  style={ {
    minHeight: 500,
    height: '80%'
  } }
  linkElement={ Link } />);

export default ServerError;
