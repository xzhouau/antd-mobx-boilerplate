import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './index.less';

/**
 * The global footer area with links and copyright messages
 */
const GlobalFooter = ({ className, links, copyright }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <div className={ clsString }>
      {links && (
        <div className={ styles.links }>
          {links.map(link => (
            <a
              key={ link.key }
              target={ link.blankTarget
                ? '_blank'
                : '_self' }
              href={ link.href }>
              {link.title}
            </a>
          ))}
        </div>
      )}
      {copyright && <div className={ styles.copyright }>{copyright}</div>}
    </div>
  );
};

GlobalFooter.propTypes = {
  /** Component style class */
  className: PropTypes.string,
  /** Hyperlinks */
  links: PropTypes.array,
  /** Copyright message element */
  copyright: PropTypes.element
};

GlobalFooter.defaultProps = {
  className: '',
  links: [],
  copyright: ''
};

export default GlobalFooter;
