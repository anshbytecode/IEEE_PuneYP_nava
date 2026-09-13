const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany();
  const members = await prisma.teamMember.findMany();
  const blogs = await prisma.blog.findMany();
  
  console.log('====================================');
  console.log('       DATABASE RECORDS CHECK       ');
  console.log('====================================');
  console.log(`Total Events: ${events.length}`);
  console.log(`Total Team Members: ${members.length}`);
  console.log(`Total Blogs: ${blogs.length}`);
  
  if (events.length > 0) {
    console.log('\nEvents in DB:', events.map(e => e.title));
  }
  if (members.length > 0) {
    console.log('\nMembers in DB:', members.map(m => m.name));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
