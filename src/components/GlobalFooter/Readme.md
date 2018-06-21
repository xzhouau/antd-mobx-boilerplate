GlobalFooter component example:

```jsx
const Icon = require('antd').Icon;

const links = [{
  key: 'help',
  title: 'Help',
  href: '',
}, {
  key: 'github',
  title: <Icon type="github" />,
  href: 'https://github.com/ant-design/ant-design-pro',
  blankTarget: true,
}, {
  key: 'terms',
  title: 'Terms',
  href: '',
  blankTarget: true,
}];

const copyright = <div>Copyright <Icon type="copyright" /> 2018 All rights reserved.</div>;

<GlobalFooter links={links} copyright={copyright} />
```
