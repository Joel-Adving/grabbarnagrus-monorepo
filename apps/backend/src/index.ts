import { Elysia, t } from 'elysia'
import { db } from './services/queries'
import { prismaService } from './services/prismaService'
import { prisma } from './libs/prisma'
import { sleep } from 'bun'
import staticPlugin from '@elysiajs/static'
import { riotApi } from './services/riotApi'

new Elysia()
  .use(staticPlugin())

  .onStart(({ app }) => console.log(`App is running at ${app.server?.hostname}:${app.server?.port}`))

  .onBeforeHandle(({ request, set, path, body, query, headers }) => {
    const authorized = headers.authorization === `Bearer ${process.env.API_TOKEN}`

    console.log({
      method: request.method,
      path,
      query,
      body,
      authorized,
      host: headers.host,
      userAgent: headers['sec-ch-ua'],
      platform: headers['sec-ch-ua-platform'],
      date: new Date().toISOString()
    })

    if (!authorized) {
      set.status = 401
      return {
        status: 401,
        message: 'Unauthorized'
      }
    }
  })

  .get('/', () => 'Welcome to Grabbarna Grus')

  .get('/summoners', async ({ query }) => {
    const withRankedStats = query.rankedStats === 'true'
    const summoners = withRankedStats ? await db.summoners.findManyIncludeRankedStats() : await db.summoners.findMany()
    if (!summoners) {
      return 'No summoners found'
    }
    return summoners
  })

  .get('/summoners/by-name/:name', async ({ params, query }) => {
    const withRankedStats = query.rankedStats === 'true'
    const summoner = withRankedStats
      ? await db.summoners.findByNameIncludeRankedStats(params.name)
      : await db.summoners.findByName(params.name)
    if (!summoner) {
      return 'No summoner found'
    }
    return summoner
  })

  .get('/summoners/by-id/:id', async ({ params }) => {
    const summoner = await db.summoners.findById(+params.id)
    if (!summoner) {
      return 'No summoner found'
    }
    return summoner
  })

  .get('/summoners/by-name/:name/update', async ({ params, request, set }) => {
    const url = new URL(request.url)
    const secret = url.searchParams.get('secret')
    const name = params.name

    const summoners = await db.summoners.findMany()
    if (!summoners) {
      set.status = 404
      return { error: { message: 'No summoners found' }, status: 404 }
    }

    if (secret !== process.env.SECRET) {
      set.status = 401
      return { error: { message: 'Unauthorized' }, status: 401 }
    }

    if (name !== '_') {
      const foundSummoner = summoners?.find((summoner) => summoner.name.toLowerCase() === name.toLowerCase())
      if (foundSummoner) {
        await prismaService.updateProfileAndMatchHistory(foundSummoner.name)
        console.log('updated: ', foundSummoner.name)
        return { success: { status: 200 }, data: { updated: foundSummoner.name } }
      }

      return { error: { message: `${name} does not exist in database` }, status: 404 }
    }

    const lastUpdated = await prisma.lastUpdated.findFirst()
    if (!lastUpdated) {
      await prisma.lastUpdated.create({
        data: {
          name: summoners[0].name,
          summonerId: summoners[0].summonerId
        }
      })
      return 'no last updated'
    }

    const foundSummoner = summoners.find((summoner) => summoner.summonerId === lastUpdated.summonerId)!
    await prismaService.updateProfileAndMatchHistory(foundSummoner.name)
    const indexOfUpdatededProfile = summoners.findIndex((sum: any) => sum.summonerId === lastUpdated.summonerId)

    if (indexOfUpdatededProfile + 1 >= summoners.length) {
      await prisma.lastUpdated.update({
        where: {
          id: lastUpdated.id
        },
        data: {
          summonerId: summoners[0].summonerId,
          name: summoners[0].name
        }
      })
      console.log('updated: ', lastUpdated.name)
      console.log('next to be updated: ', summoners[0].name)
      return { updated: lastUpdated.name, nextUp: summoners[0].name }
    }

    if (indexOfUpdatededProfile + 1 <= summoners.length) {
      const nextToBeUpdated = summoners[indexOfUpdatededProfile + 1]
      await prisma.lastUpdated.update({
        where: {
          id: lastUpdated.id
        },
        data: {
          summonerId: nextToBeUpdated.summonerId,
          name: nextToBeUpdated.name
        }
      })
      console.log('updated: ', lastUpdated.name)
      console.log('next to be updated: ', nextToBeUpdated.name)
      return { updated: lastUpdated.name, nextUp: nextToBeUpdated.name }
    }
  })

  .post(
    '/summoners',
    async ({ body, query, set }) => {
      const secret = query.secret
      if (secret !== process.env.SECRET) {
        set.status = 401
        return { error: { message: 'Unauthorized' }, status: 401 }
      }

      const summonerName = body.name
      if (!summonerName) {
        set.status = 400
        return { error: { message: 'No summoner name provided' }, status: 400 }
      }

      const summoners = await db.summoners.findMany()
      if (!summoners) {
        set.status = 404
        return { error: { message: 'No summoners found' }, status: 404 }
      }

      const foundSummoner = summoners?.find((summoner) => summoner.name.toLowerCase() === summonerName.toLowerCase())
      if (foundSummoner) {
        return { message: `${summonerName} already added` }
      }

      const summoner = await riotApi.summoner(summonerName)
      if (!summoner) {
        return { message: `Summoner ${summonerName} not found` }
      }

      const { id, ...rest } = summoner
      const createdSummoner = await prisma.summoner.create({
        data: {
          summonerId: id,
          ...rest
        }
      })

      await sleep(1100)
      await prismaService.updateProfileAndMatchHistory(summonerName)

      return { success: true, data: { ...createdSummoner } }
    },
    {
      body: t.Object({ name: t.String() })
    }
  )

  .get('/summoners/rankedStats/by-summonerId/:summonerId', async ({ params }) => {
    const { summonerId } = params
    if (!summonerId) {
      return { message: 'Summoner id not found' }
    }
    const rankedStats = await db.summoners.rankedStats(summonerId)
    if (!rankedStats) {
      return { message: 'Ranked stats not found' }
    }
    return rankedStats
  })

  .get('/matches/:id', async ({ params }) => {
    const { id } = params
    if (!id) {
      return { message: 'Match id not found' }
    }
    const match = await prisma.match.findUnique({ where: { matchId: id } })
    if (!match) {
      return { message: 'Match not found' }
    }
    return match
  })

  .get('/matches/summoner/by-id/:id', async ({ params, query }) => {
    const { id } = params
    if (!id || typeof +id !== 'number' || isNaN(+id) || !isFinite(+id)) {
      return { message: `Invalid ID: ${id}` }
    }
    const fetchAll = query.fetchAll === 'true'
    const matches = await db.summoners.matches(+id, fetchAll ? 9999 : 20)
    if (!matches) {
      return { message: `No matches found for ${id}` }
    }
    return matches
  })

  .get('/matches/summoner/by-name/:name', async ({ params, query }) => {
    const { name } = params
    if (!name) {
      return { message: `No name provided` }
    }
    const fetchAll = query.fetchAll === 'true'
    const summoner = await db.summoners.findByName(name)
    const matches = await db.summoners.matches(summoner.id, fetchAll ? 9999 : 20)
    if (!matches) {
      return { message: `No matches found for ${name}` }
    }
    return matches
  })

  .listen(process.env.PORT || 3000)
