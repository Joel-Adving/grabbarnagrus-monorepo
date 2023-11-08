import { Await, NavLink } from '@remix-run/react'
import { Suspense } from 'react'
import type { Summoner } from 'shared-types'

export default function Nav({ summoners }: { summoners: Promise<Summoner[]> }) {
  return (
    <div className="sticky lef-0 top-0 h-[100dvh] max-w-[12.5rem] w-full p-5 overflow-x-auto bg-slate-950">
      <Suspense fallback={<Skeleton />}>
        <Await resolve={summoners}>{(summoners) => <NavItems summoners={summoners} />}</Await>
      </Suspense>
    </div>
  )
}

function NavItems({ summoners }: { summoners: Summoner[] }) {
  return (
    <ul className="flex flex-col gap-1.5 text-xl text-zinc-300">
      {summoners.map(({ name, id }) => (
        <li key={id}>
          <NavLink to={`/summoner/${id}/matches`} className="flex hover:underline hover:text-zinc-100">
            {name}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse pt-2">
      {Array.from({ length: 17 }).map((_, i) => (
        <div
          key={i}
          className="h-[1.125rem] rounded bg-gray-400"
          style={{ width: `${Math.floor(Math.random() * 50) + 20}%` }}
        />
      ))}
    </div>
  )
}
