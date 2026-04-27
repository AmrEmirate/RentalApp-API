import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function main() {
  try {
    console.log('Attempting to connect to database...')
    await prisma.$connect()
    console.log('Successfully connected to database!')
    const result = await prisma.$queryRaw`SELECT 1 as result`
    console.log('Query result:', result)
  } catch (error) {
    console.error('Connection failed:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
