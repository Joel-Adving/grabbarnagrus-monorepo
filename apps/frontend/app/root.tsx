import { defer } from '@remix-run/cloudflare'
import type { LoaderFunctionArgs, LinksFunction } from '@remix-run/cloudflare'
import { cssBundleHref } from '@remix-run/css-bundle'
import type { MetaFunction } from '@remix-run/react'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'
import globalCss from '~/global.css'
import type { Summoner } from 'shared-types'
import Nav from './components/Nav'
import { api } from 'services/api'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: globalCss }
]

export const meta: MetaFunction = () => {
  return [
    { title: 'Grabbarna Grus' },
    {
      property: 'og:title',
      content: 'Grabbarna Grus'
    },
    {
      name: 'description',
      content: 'Grabbarna Grus is a League of Legends community from Sweden.'
    }
  ]
}

export async function loader({ context }: LoaderFunctionArgs) {
  const summoners = api.get<Summoner[]>(context, '/summoners')
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
      <body className="bg-slate-900 text-zinc-200 min-h-[100dvh] flex relative">
        <Nav summoners={summoners} />
        <div className="w-full sm:px-10 md:px-8 px-6 py-10">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
