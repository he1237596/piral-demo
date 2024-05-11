import * as React from 'react';
import { Link } from 'react-router-dom';
// import type { PiletApi } from 'my-app';

const Page = React.lazy(() => import('./Page/index'));
const Page1 = React.lazy(() => import('./Cornerstone/index'));

// export function setup(app: PiletApi) {
export function setup(app) {
  // app.registerPage('/page', Page);
  app.registerPage('/pvmed', Page1);
  app.showNotification('Hello from Piral!', {
    autoClose: 2000,
  });
  app.registerMenu(() => <Link to="/page">Page</Link>);
  app.registerTile(() => <div>Welcome to Piral!</div>, {
    initialColumns: 2,
    initialRows: 2,
  });
}
