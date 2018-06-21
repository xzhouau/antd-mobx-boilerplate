import React from 'react';
import { Layout } from 'antd';
import GlobalHeader from 'components/GlobalHeader';
import SiderMenu from 'components/SiderMenu';

const { Header } = Layout;

const Home = () => (
  <Layout>
    <SiderMenu
      logo='#'
      // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
      // If you do not have the Authorized parameter
      // you will be forced to jump to the 403 interface without permission
      Authorized={ {} }
      menuData={ [
        {
          name: 'dashboard',
          icon: 'dashboard',
          path: 'dashboard',
          children: [
            {
              name: '分析页',
              path: 'analysis'
            },
            {
              name: '监控页',
              path: 'monitor'
            },
            {
              name: '工作台',
              path: 'workplace'
            }
          ]
        } ] }
      location={ { pathname: '/userinfo/2144/id' } }
      collapsed={ false }
      isMobile={ false }
      onCollapse={ () => {} } />
    <Layout>
      <Header style={ { padding: 0 } }>
        <GlobalHeader
          logo='#'
          currentUser={ { notifyCount: 5 } }
          fetchingNotices
          notices={ [] }
          collapsed
          isMobile={ false }
          onCollapse={ () => {} }
          onMenuClick={ () => {} } />
      </Header>
    </Layout>
  </Layout>
);

export default Home;
