import React, { PureComponent } from 'react';
import { Popover, Icon, Tabs, Badge, Spin } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import List from './NoticeList';
import styles from './index.less';

const { TabPane } = Tabs;

/**
 * Notice icon that can show multiple NoticeList tabs
 */
export default class NoticeIcon extends PureComponent {
  static propTypes = {
    /** Popover menu item click handler */
    onItemClick: PropTypes.func.isRequired,
    /** Clear notice handler */
    onClear: PropTypes.func.isRequired,
    /** Number of notices to be displayed as badge */
    count: PropTypes.number,
    /** Component style class */
    className: PropTypes.string,
    /** Popover menu offset */
    popupAlign: PropTypes.object,
    /** Whether the popover menu is visible */
    popupVisible: PropTypes.bool,
    /** Callback when visibility of popover menu is changed */
    onPopupVisibleChange: PropTypes.func,
    /** Callback when popover menu tab is changed */
    onTabChange: PropTypes.func,
    /** Whether to show loading spinner */
    loading: PropTypes.bool,
    /** Popover content element
     * @ignore
    */
    children: PropTypes.array
  };

  static defaultProps = {
    onPopupVisibleChange: () => {},
    onTabChange: () => {},
    count: 0,
    popupAlign: {},
    className: '',
    children: [],
    popupVisible: false,
    loading: false
  };

  static Tab = TabPane;

  constructor(props) {
    super(props);
    this.state = {};
    if (props.children && props.children[0]) {
      this.state.tabType = props.children[0].props.title;
    }
  }

  onItemClick = (item, tabProps) => {
    const { onItemClick } = this.props;
    onItemClick(item, tabProps);
  };

  onTabChange = (tabType) => {
    this.setState({ tabType });
    this
      .props
      .onTabChange(tabType);
  };

  getNotificationBox() {
    const { children, loading } = this.props;

    if (!children) {
      return null;
    }

    const panes = React
      .Children
      .map(children, (child) => {
        const title = child.props.list && child.props.list.length > 0
          ? `${child.props.title} (${child.props.list.length})`
          : child.props.title;
        return (
          <TabPane tab={ title } key={ child.props.title }>
            <List
              { ...child.props }
              data={ child.props.list }
              onClick={ item => this.onItemClick(item, child.props) }
              onClear={ () => this.props.onClear(child.props.title) }
              title={ child.props.title } />
          </TabPane>
        );
      });

    return (
      <Spin spinning={ loading } delay={ 0 }>
        <Tabs className={ styles.tabs } onChange={ this.onTabChange }>
          {panes}
        </Tabs>
      </Spin>
    );
  }

  render() {
    const {
      className, count, popupAlign, onPopupVisibleChange
    } = this.props;
    const noticeButtonClass = classNames(className, styles.noticeButton);
    const notificationBox = this.getNotificationBox();
    const trigger = (
      <span className={ noticeButtonClass }>
        <Badge count={ count } className={ styles.badge }>
          <Icon type='bell' className={ styles.icon } />
        </Badge>
      </span>
    );

    if (!notificationBox) {
      return trigger;
    }

    const popoverProps = {};
    if ('popupVisible' in this.props) {
      popoverProps.visible = this.props.popupVisible;
    }

    return (
      <Popover
        placement='bottomRight'
        content={ notificationBox }
        popupClassName={ styles.popover }
        trigger='click'
        arrowPointAtCenter
        popupAlign={ popupAlign }
        onVisibleChange={ onPopupVisibleChange }
        { ...popoverProps }>
        {trigger}
      </Popover>
    );
  }
}
