GlobalHeader component example:

```jsx
const Header = require('antd').Layout.Header;

handleMenuClick = ({ key }) => {
  if (key === 'logout') {
    console.log('User logged out.');
  }
};

handleMenuCollapse = collapsed => {
  console.log('Side menu collapsed/uncollapsed.');
};

handleNoticeVisibleChange = visible => {
  if (visible) {
    console.log('Notifications menu opened/closed.');
  }
};

handleNoticeClear = type => {
  console.log('Message cleared.');
};

const currentUser = {
  name: 'User',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
  notifyCount: 5
};

<Header style={{ padding: 0 }}>
  <GlobalHeader
    logo='https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png'
    currentUser={currentUser}
    notices={[]}
    isMobile={false}
    onNoticeClear={this.handleNoticeClear}
    onCollapse={handleMenuCollapse}
    onMenuClick={handleMenuClick}
    onNoticeVisibleChange={handleNoticeVisibleChange}
  />
</Header>;
```
