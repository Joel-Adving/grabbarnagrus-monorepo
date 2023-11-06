import { defer } from '@remix-run/cloudflare'
import type { LoaderFunctionArgs, LinksFunction } from '@remix-run/cloudflare'
import { cssBundleHref } from '@remix-run/css-bundle'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'
import globalCss from '~/global.css'
import type { Summoner } from 'shared-types'
import Nav from './components/Nav'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: globalCss }
]

export async function loader({ context }: LoaderFunctionArgs) {
  const summoners = fetch(`${context.env.API_URL}/summoners`, {
    headers: { Authorization: `Bearer ${context.env.API_TOKEN}` }
  }).then((res) => res.json()) as Promise<Summoner[]>
  return defer({ summoners })
}

export default function App() {
  const { summoners } = useLoaderData<typeof loader>()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-900 text-zinc-200 min-h-[100dvh] flex">
        <Nav summoners={summoners} />
        <div className="w-full sm:px-10 px-8 py-10">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
