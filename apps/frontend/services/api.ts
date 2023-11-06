import type { LoaderFunctionArgs } from '@remix-run/cloudflare'

export const api = {
  async get<T>(ctx: LoaderFunctionArgs, endpoint: string) {
    const baseUrl = ctx.env.API_URL
    const res = await fetch(baseUrl + endpoint, {
      headers: { Authorization: 'Bearer ' + ctx.env.API_TOKEN }
    })
    return res.json() as Promise<T>
  }
}
