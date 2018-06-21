import React, { createElement } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import config from './typeConfig';
import styles from './index.less';

/**
 * General exception handling page for http errors
 */
const Exception = ({
  className,
  linkElement,
  type,
  title,
  desc,
  img,
  actions,
  ...rest
}) => {
  const pageType = type in config
    ? type
    : '404';
  const clsString = classNames(styles.exception, className);
  return (
    <div className={ clsString } { ...rest }>
      <div className={ styles.imgBlock }>
        <div
          className={ styles.imgEle }
          style={ {
            backgroundImage: `url(${img || config[pageType].img})`
          } } />
      </div>
      <div className={ styles.content }>
        <h1>{title || config[pageType].title}</h1>
        <div className={ styles.desc }>{desc || config[pageType].desc}</div>
        <div className={ styles.actions }>
          {actions || createElement(linkElement, {
            to: '/',
            href: '/'
          }, <Button type='primary' > Return to Dashboard </Button>)}
        </div>
      </div>
    </div>
  );
};

Exception.propTypes = {
  /** Component style class */
  className: PropTypes.string,
  /** The DOM element of call to action */
  linkElement: PropTypes.string,
  /** Error type. e.g. 404, 500 */
  type: PropTypes.string,
  /** Errpr page title */
  title: PropTypes.string,
  /** Error description */
  desc: PropTypes.string,
  /** Background image url */
  img: PropTypes.string,
  /** Custom action React element */
  actions: PropTypes.element
};

Exception.defaultProps = {
  className: '',
  linkElement: 'a',
  type: '',
  title: '',
  desc: '',
  img: '',
  actions: null
};

export default Exception;
