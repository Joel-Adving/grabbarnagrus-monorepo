import { type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import type { RankedStats, Summoner } from 'shared-types'

export async function loader({ params, context }: LoaderFunctionArgs) {
  const url = context.env.API_URL
  const headers = { Authorization: `Bearer ${context.env.API_TOKEN}` }
  const summoner = (await fetch(`${url}/summoners/by-id/${params.id}`, { headers }).then((res) =>
    res.json()
  )) as Summoner
  const rankedStats = (await fetch(`${url}/summoners/rankedStats/by-summonerId/${summoner.summonerId}`, {
    headers
  }).then((res) => res.json())) as RankedStats[]
  return { rankedStats }
}

export default function SummonerRankedStats() {
  const { rankedStats } = useLoaderData<typeof loader>()
  console.log(rankedStats)
  return <div>Work in progress</div>
}
