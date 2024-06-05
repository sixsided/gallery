import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';

import type { LinksFunction } from '@remix-run/node';

import { dbQuery } from './lib/db.server';
import { PhotosDbRowType } from './lib/interfaces';

import tufteCssUrl from './style/tufte.css?url';
import mainCssUrl from './style/main.css?url';
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tufteCssUrl },
  { rel: 'stylesheet', href: mainCssUrl },
];

export const loader = async () => dbQuery();

export default function App() {
  const filesList: PhotosDbRowType[] = useLoaderData();
  const imageIds = filesList.map((f) => f.uuid);

  return (
    <html>
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="nested-route">
          <Outlet context={{ imageIds, filesList }} />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
