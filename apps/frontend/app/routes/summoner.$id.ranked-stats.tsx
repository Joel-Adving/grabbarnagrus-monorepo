import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { api } from 'services/api'
import type { RankedStats, Summoner } from 'shared-types'

export async function loader({ params, context }: LoaderFunctionArgs) {
  const summoner = await api.get<Summoner>(context, `/summoners/by-id/${params.id}`)
  const rankedStats = await api.get<RankedStats[]>(
    context,
    `/summoners/rankedStats/by-summonerId/${summoner.summonerId}`
  )
  return json({ rankedStats })
}

export default function SummonerRankedStats() {
  const { rankedStats } = useLoaderData<typeof loader>()
  console.log(rankedStats)
  return <div>Work in progress</div>
}
