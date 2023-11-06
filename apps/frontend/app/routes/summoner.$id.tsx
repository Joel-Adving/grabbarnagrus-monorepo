import { type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { api } from 'services/api'
import type { Summoner } from 'shared-types'

export async function loader({ params, context }: LoaderFunctionArgs) {
  const summoner = await api.get<Summoner>(context, `/summoners/by-id/${params.id}`)
  return { summoner }
}

export default function SummonerName() {
  const { summoner } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1 className="text-4xl">{summoner.name}</h1>
      <nav className="flex gap-3 pt-4 text-xl text-zinc-300">
        <NavLink to="matches" className="hover:underline hover:text-zinc-100">
          Matches
        </NavLink>
        <NavLink to="ranked-stats" className="hover:underline hover:text-zinc-100">
          Ranked stats
        </NavLink>
      </nav>
      <div className="pt-4">
        <Outlet context={summoner} />
      </div>
    </div>
  )
}
