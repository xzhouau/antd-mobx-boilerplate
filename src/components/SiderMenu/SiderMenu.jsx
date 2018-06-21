import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { Link } from 'react-router-dom';
import { urlToList } from 'utils/pathTools';
import PropTypes from 'prop-types';
import styles from './index.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

const getIcon = (icon) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={ icon } alt='icon' className={ `${styles.icon} sider-menu-item-img` } />;
  }
  if (typeof icon === 'string') {
    return <Icon type={ icon } />;
  }
  return icon;
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menu
 */
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.path);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMeunMatchKeys = (flatMenuKeys, paths) =>
  paths.reduce((matchKeys, path) => (
    matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path)))
  ), []);

export default class SiderMenu extends PureComponent {
  static propTypes = {
    menuData: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    Authorized: PropTypes.object.isRequired,
    logo: PropTypes.string,
    isMobile: PropTypes.bool,
    collapsed: PropTypes.bool,
    onCollapse: PropTypes.func
  };

  static defaultProps = {
    logo: '',
    isMobile: false,
    collapsed: false,
    onCollapse: () => {}
  };

  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.flatMenuKeys = getFlatMenuKeys(props.menuData);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps)
      });
    }
  }

  /**
   * Convert pathname to openKeys
   * /list/search/articles = > ['list','/list/search']
   * @param  props
   */
  getDefaultCollapsedSubMenus(props) {
    const { location: { pathname } } = props || this.props;
    return getMeunMatchKeys(this.flatMenuKeys, urlToList(pathname));
  }

  /**
   * Check whether it is http link. Return a or Link
   *
   * @memberof SiderMenu
   */
  getMenuItemPath = (item) => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={ itemPath } target={ target }>
          {icon}
          <span>{name}</span>
        </a>
      );
    }

    return (
      <Link
        to={ itemPath }
        target={ target }
        replace={ itemPath === this.props.location.pathname }
        onClick={
          this.props.isMobile
            ? () => {
              this.props.onCollapse(true);
            }
            : undefined
        }>
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item) => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);

      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={ item.path }>
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      return <Menu.Item key={ item.path }>{this.getMenuItemPath(item)}</Menu.Item>;
    }
  };

  /**
   * Get manu sub items
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map((item) => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = () => {
    const { location: { pathname } } = this.props;
    return getMeunMatchKeys(this.flatMenuKeys, urlToList(pathname));
  };

  // conversion Path
  conversionPath = (path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  };

  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    if (this.props.Authorized && this.props.Authorized.check) {
      const { check } = this.props.Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  isMainMenu = key => this.menus.some(item => key && (item.key === key || item.path === key));

  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [ lastOpenKey ] : [ ...openKeys ]
    });
  };

  render() {
    const { logo, collapsed, onCollapse } = this.props;
    const { openKeys } = this.state;
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : { openKeys };
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length) {
      selectedKeys = [ openKeys[openKeys.length - 1] ];
    }

    return (
      <Sider
        trigger={ null }
        collapsible
        collapsed={ collapsed }
        breakpoint='lg'
        onCollapse={ onCollapse }
        width={ 256 }
        className={ styles.sider }>
        <div className={ styles.logo } key='logo'>
          <Link to='/'>
            <img src={ logo } alt='logo' />
            <h1>Kino</h1>
          </Link>
        </div>
        <Menu
          key='Menu'
          theme='dark'
          mode='inline'
          { ...menuProps }
          onOpenChange={ this.handleOpenChange }
          selectedKeys={ selectedKeys }
          style={ { padding: '16px 0', width: '100%' } }>
          {this.getNavMenuItems(this.menus)}
        </Menu>
      </Sider>
    );
  }
}