import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useParams } from '@remix-run/react'

// import { useLoaderData } from '@remix-run/react'

export async function loader({ params, context }: LoaderFunctionArgs) {
  return {}
}

export default function MatchId() {
  // //   const { summoner, matches } = useLoaderData<typeof loader>()

  const { id } = useParams()

  return <div className="text-xl">{id}</div>
}
