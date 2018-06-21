import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, AutoComplete } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

/**
 * Search input component
 */
export default class HeaderSearch extends PureComponent {
  static propTypes = {
    /** Enter key handler */
    onPressEnter: PropTypes.func.isRequired,
    /** Search input type handler */
    onChange: PropTypes.func.isRequired,
    /** Component style class */
    className: PropTypes.string,
    /** Input placeholder text */
    placeholder: PropTypes.string,
    /** Search data source */
    dataSource: PropTypes.array,
    /** Expand search input by default */
    defaultOpen: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    placeholder: '',
    dataSource: [],
    defaultOpen: false
  };

  state = {
    searchMode: this.props.defaultOpen,
    value: ''
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.timeout = setTimeout(() => {
        this
          .props
          .onPressEnter(this.state.value); // Fix duplicate onPressEnter
      }, 0);
    }
  };

  onChange = (value) => {
    this.setState({ value });
    if (this.props.onChange) {
      this
        .props
        .onChange();
    }
  };

  enterSearchMode = () => {
    this.setState({
      searchMode: true
    }, () => {
      if (this.state.searchMode) {
        this
          .input
          .focus();
      }
    });
  };

  leaveSearchMode = () => {
    this.setState({ searchMode: false, value: '' });
  };

  render() {
    const {
      className,
      placeholder,
      ...restProps
    } = this.props;

    delete restProps.defaultOpen; // for rc-select not affected

    const inputClass = classNames(styles.input, {
      [styles.show]: this.state.searchMode
    });

    return (
      <span
        className={ classNames(className, styles.headerSearch) }
        onClick={ this.enterSearchMode }
        role='none'>
        <Icon type='search' key='Icon' />
        <AutoComplete
          key='AutoComplete'
          { ...restProps }
          className={ inputClass }
          value={ this.state.value }
          onChange={ this.onChange }>
          <Input
            placeholder={ placeholder }
            ref={ (node) => {
              this.input = node;
            } }
            onKeyDown={ this.onKeyDown }
            onBlur={ this.leaveSearchMode } />
        </AutoComplete>
      </span>
    );
  }
}
