import { type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { api } from 'services/api'
import type { Match, Summoner } from 'shared-types'

export const LEAGUE_CDN = 'http://ddragon.leagueoflegends.com/cdn/13.21.1'

export async function loader({ params, context }: LoaderFunctionArgs) {
  const [summoner, matches] = await Promise.all([
    api.get<Summoner>(context, `/summoners/by-id/${params.id}`),
    api.get<Match[]>(context, `/matches/summoner/by-id/${params.id}`)
  ])
  return { summoner, matches }
}

export default function SummonerMatches() {
  const { summoner, matches } = useLoaderData<typeof loader>()

  if (summoner.error || matches.error) {
    return (
      <>
        <div>{summoner.error}</div>
        <div>{matches.error}</div>
      </>
    )
  }

  return (
    <section className="flex flex-col flex-grow pt-4 gap-2.5">
      {matches.map((match: any) => {
        const { info } = match
        if (!info) return null
        const playerStats = info?.participants.find((el: any) => el.puuid === summoner.data.puuid)
        if (!playerStats) return null
        const win = playerStats?.win

        return (
          <a
            href={`/match/${match.metaData.matchId}?summoner=${summoner.data.name}`}
            className={`
                py-3 border-[1px] rounded border-transparent border-b-neutral-700 border-r-0
                text-text-light flex sm:justify-between justify-evenly
                hover:border-gold hover:border-l-gold border-l-[5px] pl-2.5 hover:pl-5 transition-all
                duration-75 hover:cursor-pointer bg-opacity-50 hover:bg-opacity-80
                ${win ? 'bg-teal-300' : 'bg-red-400'}
            `}
            key={match.info.gameId}
          >
            <div className="flex flex-col items-center sm:flex-row">
              <div className="relative">
                <div className="w-14 h-14 border-slate-300 rounded-full border-[2.5px] overflow-hidden">
                  <img
                    src={`${LEAGUE_CDN}/img/champion/${playerStats.championName}.png`}
                    alt="Champion splash art"
                    height={56}
                    width={56}
                    className="rounded-full"
                  />
                </div>

                <p className="h-5 w-5 absolute bottom-0 right-0 rounded-full border-slate-200 bg-slate-800 border-[1px] text-xs font-BeaufortBold bg-background-darkest flex items-center justify-center">
                  {playerStats?.champLevel}
                </p>
              </div>
              <div className="flex flex-col items-center mt-3 sm:items-start sm:ml-5 sm:mt-0">
                {win ? (
                  <h2 className=" text-victory font-BeaufortBold">VICTORY</h2>
                ) : (
                  <h2 className=" text-defeat font-BeaufortBold">DEFEAT</h2>
                )}
              </div>
            </div>
            <div className="flex flex-col-reverse items-center justify-center mr-0 lg:mr-24 sm:flex-row">
              <div className="sm:mr-8 ">
                <div className="flex justify-between mt-1.5 -mb-1.5 font-BeaufortBold">
                  <div className="flex">
                    <p>{playerStats.kills}</p>
                    <span className="mx-1">/</span>
                    <p>{playerStats.deaths}</p>
                    <span className="mx-1">/</span>
                    <p>{playerStats.assists}</p>
                  </div>
                  <div className="flex">
                    <p>{playerStats.totalMinionsKilled}</p>
                    <div></div>
                  </div>
                  <div className="flex">
                    <p>{playerStats?.goldEarned.toString().replace(/.(?=(..)*...$)/g, '$&,')}</p>
                    <div></div>
                  </div>
                </div>
              </div>

              <div className="self-start mb-3 sm:mb-0">
                <div className="flex gap-3 mt-1 text-xs sm:mt-2 ">
                  <p>{(info.gameDuration / 60).toFixed(2).toString().replace('.', ':')}</p>
                </div>
              </div>
            </div>
          </a>
        )
      })}
    </section>
  )
}
