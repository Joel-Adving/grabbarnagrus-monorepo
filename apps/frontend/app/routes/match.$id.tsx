import { useParams } from '@remix-run/react'

export default function MatchId() {
  const { id } = useParams()
  return <div className="text-xl">{id}</div>
}
