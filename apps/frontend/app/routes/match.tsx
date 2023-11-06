import { Outlet } from '@remix-run/react'

export default function Match() {
  return (
    <div>
      <h1 className="text-4xl pb-5">Match</h1>
      <Outlet />
    </div>
  )
}
