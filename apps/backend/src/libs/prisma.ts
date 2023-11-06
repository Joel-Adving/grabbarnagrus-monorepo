import { PrismaClient } from '@prisma/client'
import { bigIntSerializer } from '../utils/bigIntSerializer'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

bigIntSerializer()

export { prisma }
