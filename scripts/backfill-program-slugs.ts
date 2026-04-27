import 'dotenv/config'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import prisma from '../lib/prisma'

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 60)
}
function randomSuffix(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

async function run() {
  const programs = await prisma.program.findMany({ where: { slug: null } })
  console.log(`Found ${programs.length} programs without slugs`)
  for (const p of programs) {
    const slug = `${slugify(p.title)}-${randomSuffix()}`
    await prisma.program.update({ where: { id: p.id }, data: { slug } })
    console.log(`  Updated ${p.id}: ${slug}`)
  }
  await prisma.$disconnect()
}

run()
