export type Summoner = {
  id: number
  summonerId: string
  name: string
  accountId: string
  profileIconId: number
  puuid: string
  revisionDate: bigint
  summonerLevel: number
}

export type RankedStats = {
  id: number
  summonerId: string
  freshBlood: boolean
  hotStreak: boolean
  inactive: boolean
  leagueId: string
  leaguePoints: number
  losses: number
  queueType: string
  rank: string
  summonerName: string
  tier: string
  veteran: boolean
  wins: number
}

export type Match = {
  id: number
  date: bigint
  matchId: string
  info: Record<string, any>
  metaData: Record<string, any>
}
