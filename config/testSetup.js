// Tests are placed alongside files under test. This file does the following:
// 1. Sets the environment to 'test' so that    dev-specific babel config in
// .babelrc doesn't run.
// 2. Disables Webpack-specific features that Mocha doesn't understand.
// 3. Registers babel for transpiling our code for testing. This assures the
// .babelrc dev config (which includes hot module reloading code) doesn't apply
// for tests. Setting NODE_ENV to test instead of production because setting it
// to production will suppress error messaging and propType validation warnings.
process.env.NODE_ENV = 'test';

// Disable webpack-specific features for tests since Mocha doesn't know what to
// do with them.
[ '.css', '.scss', '.png', '.jpg' ].forEach((ext) => {
  require.extensions[ext] = () => null;
});

// Register babel so that it will transpile ES6 to ES5 before our tests run.
require('babel-register')();

// Setup enzyme adapter
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

// prepare document ref
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const exposedProperties = [ 'window', 'navigator', 'document' ];
const { document } = (new JSDOM('')).window;

global.document = document;
global.window = document.defaultView;
Object
  .keys(document.defaultView)
  .forEach((property) => {
    if (typeof global[property] === 'undefined') {
      exposedProperties.push(property);
      global[property] = document.defaultView[property];
    }
  });

global.navigator = {
  userAgent: 'node.js'
};
