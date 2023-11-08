import type { LoaderFunctionArgs } from '@remix-run/cloudflare'

export const api = {
  async get<DataStruct>(ctx: LoaderFunctionArgs, endpoint: string, { expirationTtl = 3600 } = {}) {
    const cached = await ctx.env.KV.get(endpoint).catch(() => null)

    if (cached) {
      return JSON.parse(cached) as DataStruct
    }

    const data = await fetch(ctx.env.API_URL + endpoint, { headers: { Authorization: 'Bearer ' + ctx.env.API_TOKEN } })
      .then((res) => res.json())
      .catch(() => null)

    ctx.env.KV.put(endpoint, JSON.stringify(data), { expirationTtl }).catch(() => null)

    return data as DataStruct
  }
}
