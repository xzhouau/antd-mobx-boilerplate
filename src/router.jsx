import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Loading from 'components/Loading';
import Loadable from 'react-loadable';

const Home = Loadable({
  loader: () => import('pages/Home/Home'),
  loading: Loading
});
const NotFound = Loadable({
  loader: () => import('routes/Exception/404'),
  loading: Loading
});
const ServerError = Loadable({
  loader: () => import('routes/Exception/500'),
  loading: Loading
});

const getRouter = () => (
  <div>
    <Switch>
      <Route exact path='/' component={ Home } />
      <Route path='/exception/500' component={ ServerError } />
      <Route component={ NotFound } />
    </Switch>
  </div>
);
export default getRouter;
