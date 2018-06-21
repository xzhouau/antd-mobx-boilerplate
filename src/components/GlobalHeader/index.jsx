import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'react-router-dom';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

/**
 * Global header component contains user profiles, notifications and search
 */
export default class GlobalHeader extends PureComponent {
  static propTypes = {
    /** Current login user data */
    currentUser: PropTypes.object.isRequired,
    /** Logo image url for mobile */
    logo: PropTypes.string.isRequired,
    /** User profile menu click handler */
    onMenuClick: PropTypes.func.isRequired,
    /** Clear notice handler */
    onNoticeClear: PropTypes.func.isRequired,
    /** Notification data */
    notices: PropTypes.array.isRequired,
    /** Notification menu click handler */
    onNoticeVisibleChange: PropTypes.func.isRequired,
    /** Hamburger icon click handler */
    onCollapse: PropTypes.func.isRequired,
    /** Hamburger icon initial collapsed state */
    collapsed: PropTypes.bool,
    /** Mobile device indicator */
    isMobile: PropTypes.bool,
    /** Indicator to show loading spin when fetching notice data */
    fetchingNotices: PropTypes.bool
  }

  static defaultProps = {
    isMobile: false,
    collapsed: false,
    fetchingNotices: false
  }

  componentWillUnmount() {
    this
      .triggerResizeEvent
      .cancel();
  }

  getNoticeData() {
    const {
      notices = []
    } = this.props;

    if (notices.length === 0) {
      return {};
    }

    const newNotices = notices.map((notice) => {
      const newNotice = {
        ...notice
      };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold'
        }[newNotice.status];
        newNotice.extra = (
          <Tag
            color={ color }
            style={ {
              marginRight: 0
            } }>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  /* eslint-disable */
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  /* eslint-enable */

  render() {
    const {
      currentUser = {},
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear
    } = this.props;

    const menu = (
      <Menu className={ styles.menu } selectedKeys={ [] } onClick={ onMenuClick }>
        <Menu.Item>
          <Icon type='user' />User profile
        </Menu.Item>
        <Menu.Item>
          <Icon type='setting' />Settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key='logout'>
          <Icon type='logout' />Logout
        </Menu.Item>
      </Menu>
    );

    const noticeData = this.getNoticeData();

    return (
      <div className={ styles.header }>
        {isMobile &&
        [
          <Link to='/' className={ styles.logo } key='logo'>
            <img src={ logo } alt='logo' width='32' />
          </Link>,
          <Divider type='vertical' key='line' />
        ]}
        <Icon
          className={ styles.trigger }
          type={ collapsed ? 'menu-unfold' : 'menu-fold' }
          onClick={ this.toggle } />
        <div className={ styles.right }>
          <HeaderSearch
            className={ `${styles.action} ${styles.search}` }
            placeholder='Search'
            dataSource={ [] }
            onChange={ () => {} }
            onPressEnter={ () => {} } />
          <Tooltip title='Help'>
            <a
              target='_blank'
              href='http://pro.ant.design/docs/getting-started'
              rel='noopener noreferrer'
              className={ styles.action }>
              <Icon type='question-circle-o' />
            </a>
          </Tooltip>
          <NoticeIcon
            className={ styles.action }
            count={ currentUser.notifyCount }
            onClear={ onNoticeClear }
            onPopupVisibleChange={ onNoticeVisibleChange }
            loading={ fetchingNotices }
            popupAlign={ { offset: [ 20, -16 ] } }>
            <NoticeIcon.Tab
              list={ noticeData.notification }
              title='Notification'
              emptyText='You have viewed all notifications'
              emptyImage='https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg' />
            <NoticeIcon.Tab
              list={ noticeData.message }
              title='Message'
              emptyText='You have viewed all messages'
              emptyImage='https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg' />
            <NoticeIcon.Tab
              list={ noticeData.todo }
              title='Todo'
              emptyText='You have finished all todos'
              emptyImage='https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg' />
          </NoticeIcon>
          {currentUser.name
            ? (
              <Dropdown overlay={ menu }>
                <span className={ `${styles.action} ${styles.account}` }>
                  <Avatar size='small' className={ styles.avatar } src={ currentUser.avatar } />
                  <span className={ styles.name }>{currentUser.name}</span>
                </span>
              </Dropdown>
            )
            : (<Spin size='small' style={ { marginLeft: 8 } } />)}
        </div>
      </div>
    );
  }
}
