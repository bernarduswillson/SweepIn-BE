import { attendances } from "./attendance";
import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seeding for attendances
  for (let attendance of attendances) {
    await prisma.attendance.create({
      data: attendance
    })
  }
}

main().catch(e => {
  console.log(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect;
})