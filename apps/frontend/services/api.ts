import type { LoaderFunctionArgs } from '@remix-run/cloudflare'

export const api = {
  async get<T>(ctx: LoaderFunctionArgs, endpoint: string, { expirationTtl = 3600 } = {}) {
    const cached = await ctx.env.KV.get(endpoint)

    if (cached) {
      return JSON.parse(cached) as T
    }

    const res = await fetch(ctx.env.API_URL + endpoint, {
      headers: {
        Authorization: 'Bearer ' + ctx.env.API_TOKEN
      }
    })

    const data = await res.json()
    await ctx.env.KV.put(endpoint, JSON.stringify(data), { expirationTtl })
    return data as T
  }
}
