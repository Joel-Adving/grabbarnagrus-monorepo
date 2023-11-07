import type { LoaderFunctionArgs } from '@remix-run/cloudflare'

export const api = {
  async get<T>(ctx: LoaderFunctionArgs, endpoint: string, { expirationTtl = 3600 } = {}) {
    let error = null

    try {
      const cached = await ctx.env.KV.get(endpoint)
      if (cached) {
        return { data: JSON.parse(cached) as T, error }
      }
    } catch (e) {
      error = JSON.stringify(e)
      console.log(e)
    }

    const res = await fetch(ctx.env.API_URL + endpoint, {
      headers: {
        Authorization: 'Bearer ' + ctx.env.API_TOKEN
      }
    })

    const data = await res.json()

    try {
      await ctx.env.KV.put(endpoint, JSON.stringify(data), { expirationTtl })
    } catch (e) {
      console.log(e)
      error = JSON.stringify(e)
    }

    return {
      data: data as T,
      error
    }
  }
}
