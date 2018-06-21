import 'rc-drawer-menu/assets/index.css';
import React from 'react';
import PropTypes from 'prop-types';
import DrawerMenu from 'rc-drawer-menu';
import SiderMenu from './SiderMenu';

const SiderMenuWrapper = props =>
  (props.isMobile ? (
    <DrawerMenu
      parent={ null }
      level={ null }
      iconChild={ null }
      open={ !props.collapsed }
      onMaskClick={ () => {
        props.onCollapse(true);
      } }
      width='256px'>
      <SiderMenu { ...props } collapsed={ props.isMobile ? false : props.collapsed } />
    </DrawerMenu>
  ) : (
    <SiderMenu { ...props } />
  ));

SiderMenuWrapper.propTypes = {
  isMobile: PropTypes.bool,
  collapsed: PropTypes.bool,
  onCollapse: PropTypes.func
};

SiderMenuWrapper.defaultProps = {
  isMobile: false,
  collapsed: false,
  onCollapse: () => {}
};

export default SiderMenuWrapper;
