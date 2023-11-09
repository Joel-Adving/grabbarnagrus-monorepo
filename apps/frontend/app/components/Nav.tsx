import { Await, NavLink } from '@remix-run/react'
import { Suspense, useEffect, useState } from 'react'
import type { Summoner } from 'shared-types'

export default function Nav({ summoners }: { summoners: Promise<Summoner[]> }) {
  const [show, setShow] = useState(true)
  const [isSmallScreen, setIsSetsmallScreen] = useState(false)

  useEffect(() => {
    const eventHandler = () => {
      if (window.innerWidth > 768) {
        setIsSetsmallScreen(false)
        if (!show) {
          setShow(true)
        }
      } else {
        setIsSetsmallScreen(true)
      }
    }
    window.addEventListener('resize', eventHandler)
    return () => {
      window.removeEventListener('resize', eventHandler)
    }
  }, [])

  useEffect(() => {
    if (isSmallScreen && show) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.height = 'unset'
    }
  }, [isSmallScreen, show])

  return show ? (
    <div
      className={`${
        isSmallScreen
          ? 'absolute z-10 left-0 top-0 bottom-0 h-screen max-w-[12.5rem]'
          : 'sticky h-[100dvh] max-w-[12.5rem] lef-0 top-0'
      } w-full p-5 overflow-x-auto bg-slate-950`}
    >
      {isSmallScreen && (
        <button onClick={() => setShow(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-zinc-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <Suspense fallback={<Skeleton />}>
        <Await resolve={summoners}>{(summoners) => <NavItems summoners={summoners} />}</Await>
      </Suspense>
    </div>
  ) : isSmallScreen ? (
    <div className="absolute top-4 left-4">
      <button onClick={() => setShow(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-zinc-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  ) : null
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
