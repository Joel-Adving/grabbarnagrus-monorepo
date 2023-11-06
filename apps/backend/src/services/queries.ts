import { Match, RankedStats, Summoner } from '@prisma/client'
import { query } from '../libs/mysql2'

type SummonerWithRankedStats = Summoner & {
  rankedStats: RankedStats[]
}

const summoners = {
  async findMany() {
    return query<Summoner[]>`SELECT * FROM db.Summoner ORDER BY name ASC`
  },
  async findManyIncludeRankedStats() {
    const summoners = await this.findMany()
    const summonersWithRankedStats = await Promise.all(
      summoners.map(async (summoner) => {
        const rankedStats = await query<
          SummonerWithRankedStats[]
        >`SELECT * FROM db.RankedStats WHERE summonerId = ${summoner.summonerId}`
        return { ...summoner, rankedStats }
      })
    )
    return summonersWithRankedStats
  },
  async findById(id: number) {
    const [summoner] = await query<Summoner[]>`SELECT * FROM db.Summoner WHERE id = ${id}`
    return summoner
  },
  async findBySummonerId(summonerId: string) {
    const [summoner] = await query<Summoner[]>`SELECT * FROM db.Summoner WHERE summonerId = ${summonerId}`
    return summoner
  },
  async findByName(name: string) {
    const [summoner] = await query<Summoner[]>`SELECT * FROM db.Summoner WHERE name = ${name}`
    return summoner
  },
  async findByNameIncludeRankedStats(name: string) {
    const summoner = await this.findByName(name)
    const summonerWithRankedStats = await query<
      SummonerWithRankedStats[]
    >`SELECT * FROM db.RankedStats WHERE summonerId = ${summoner.summonerId}`
    return { ...summoner, rankedStats: summonerWithRankedStats[0] }
  },
  async matches(id: number, limit: number, page: number = 1) {
    const offset = (page - 1) * limit
    return query<Match[]>`SELECT m.* 
     FROM db.Match AS m
     INNER JOIN db._MatchToSummoner AS mts ON mts.a = m.id
     WHERE mts.b = ${id}
     ORDER BY m.date DESC
     LIMIT ${limit}
     OFFSET ${offset}`
  },
  rankedStats(summonerId: string) {
    return query<RankedStats[]>`SELECT * FROM db.RankedStats WHERE summonerId = ${summonerId}`
  }
}

export const db = {
  summoners
}
