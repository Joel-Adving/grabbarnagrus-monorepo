/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from '@remix-run/cloudflare'
import { RemixServer } from '@remix-run/react'
import isbot from 'isbot'
import { renderToReadableStream } from 'react-dom/server'

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext
) {
  const body = await renderToReadableStream(<RemixServer context={remixContext} url={request.url} />, {
    signal: request.signal,
    onError(error: unknown) {
      // Log streaming rendering errors from inside the shell
      console.error(error)
      responseStatusCode = 500
    }
  })

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady
  }

  //   const paths = [
  //     { path: '/summoner', cacheControl: 'public, s-maxage=3600, stale-while-revalidate=60' },
  //     { path: '/', cacheControl: 'public, s-maxage=3600, stale-while-revalidate=60' }
  //   ]
  const defaultCache = 'public, s-maxage=3600, stale-while-revalidate=60'
  //   const requestPath = new URL(request.url).pathname
  //   const cacheConfig =
  //     paths.find((route) => requestPath === route.path || requestPath.startsWith(route.path + '/'))?.cacheControl ||
  //     defaultCache
  responseHeaders.set('Cache-Control', defaultCache)

  responseHeaders.set('Content-Type', 'text/html')
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode
  })
}
