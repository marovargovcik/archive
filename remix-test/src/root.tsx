import { cssBundleHref } from '@remix-run/css-bundle';
import { type LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ href: cssBundleHref, rel: 'stylesheet' }] : []),
];

const App = () => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta content="width=device-width,initial-scale=1" name="viewport" />
      <Meta />
      <Links />
    </head>
    <body>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </body>
  </html>
);

export { links };
export default App;
