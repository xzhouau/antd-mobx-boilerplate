import { expect } from 'chai';
import { urlToList } from 'utils/pathTools';
import { getFlatMenuKeys, getMeunMatchKeys } from './SiderMenu';

const menu = [
  {
    path: '/dashboard',
    children: [
      {
        path: '/dashboard/name'
      }
    ]
  }, {
    path: '/userinfo',
    children: [
      {
        path: '/userinfo/:id',
        children: [
          {
            path: '/userinfo/:id/info'
          }
        ]
      }
    ]
  }
];

const flatMenuKeys = getFlatMenuKeys(menu);

describe('test convert nested menu to flat menu', () => {
  it('simple menu', () => {
    expect(flatMenuKeys).to.deep.equal([
      '/dashboard',
      '/dashboard/name',
      '/userinfo',
      '/userinfo/:id',
      '/userinfo/:id/info'
    ]);
  });
});

describe('test menu match', () => {
  it('simple path', () => {
    expect(getMeunMatchKeys(flatMenuKeys, urlToList('/dashboard'))).to.deep.equal([ '/dashboard' ]);
  });

  it('error path', () => {
    expect(getMeunMatchKeys(flatMenuKeys, urlToList('/dashboardname'))).to.deep.equal([]);
  });

  it('Secondary path', () => {
    expect(getMeunMatchKeys(flatMenuKeys, urlToList('/dashboard/name'))).to.deep.equal([
      '/dashboard',
      '/dashboard/name'
    ]);
  });

  it('Parameter path', () => {
    expect(getMeunMatchKeys(flatMenuKeys, urlToList('/userinfo/2144'))).to.deep.equal([
      '/userinfo',
      '/userinfo/:id'
    ]);
  });

  it('three parameter path', () => {
    expect(getMeunMatchKeys(flatMenuKeys, urlToList('/userinfo/2144/info'))).to.deep.equal([
      '/userinfo',
      '/userinfo/:id',
      '/userinfo/:id/info'
    ]);
  });
});
