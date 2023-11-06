import { type MetaFunction } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function Index() {
  return (
    <div>
      <h1 className="text-4xl sm:text-5xl pb-8">Grabbarna Grus</h1>
      <p className="text-xl text-thin">Select one of the players from the left</p>
    </div>
  )
}
