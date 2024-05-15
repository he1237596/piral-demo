import * as React from 'react';
import { Link } from 'react-router-dom';
// import type { PiletApi } from 'my-app';

const Page = React.lazy(() => import('./Page/index'));
const Page1 = React.lazy(() => import('./Cornerstone/index'));
const Page2 = React.lazy(() => import('./Page/test'));
const Demo = React.lazy(() => import('./Page/demo'));
const Layout = React.lazy(() => import('./Layout'));

// export function setup(app: PiletApi) {
export function setup(app) {
  // app.registerPage('/page', Page);
  app.registerPage('/pvmed', Page1);
  app.registerPage('/test', Page2);
  app.registerPage('/demo', Demo);
  app.registerPage('/layout', Layout);
  app.showNotification('Hello from Piral!', {
    autoClose: 2000,
  });
  app.registerMenu(() => <Link to="/page">Page</Link>);
  app.registerTile(() => <div>Welcome to Piral!</div>, {
    initialColumns: 2,
    initialRows: 2,
  });
}
