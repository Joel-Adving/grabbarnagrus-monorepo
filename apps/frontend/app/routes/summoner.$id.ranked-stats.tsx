import { type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { api } from 'services/api'
import type { RankedStats, Summoner } from 'shared-types'

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { data } = await api.get<Summoner>(context, `/summoners/by-id/${params.id}`)
  const rankedStats = await api.get<RankedStats[]>(context, `/summoners/rankedStats/by-summonerId/${data.summonerId}`)
  return rankedStats
}

export default function SummonerRankedStats() {
  const { data } = useLoaderData<typeof loader>()
  console.log(data)
  return <div>Work in progress</div>
}
