import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const Loading = () => {
  const clsString = classNames([ styles.loadingSpinner, styles.loadingSpinnerStyle1 ]);
  return (<div className={ clsString } />);
};

export default Loading;
