import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

const createDates = (startDate: Date, endDate: Date) => {
  const dates: string[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString());
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Create Log
const createLog = async (attendanceId: string, start: boolean, date: string) => {
  const logDate: Date = new Date(date);
  logDate.setUTCHours(start ? 8 : 17);
  logDate.setMinutes(0);
  logDate.setSeconds(0);

  await prisma.log.create({
    data: {
      date: logDate,
      image: 'https://firebasestorage.googleapis.com/v0/b/sweepin.appspot.com/o/files%2F2024-03-11T04%3A28%3A42.156Z-099939900_1576591774-Tanda-tanda-Anda-sedang-Membesarkan-Anak-Pemarah-Shutterstock_1034366974.jpg?alt=media&token=331b3f53-95c1-4b1d-b055-d04e03e31afc',
      latitude: -6.8922515,
      longitude: 107.60527,
      attendanceStartId: start ? attendanceId : null,
      attendanceEndId: start ? null : attendanceId
    }
  });
}

// Create attendance
const createAttendance = async () => {
  const ditraUserId = '65e977f9ff15a6ab52da402a';
  const dates: string[] = createDates(new Date('2024-02-01'), new Date('2024-02-29'));

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];

    // Create attendance
    const { id } = await prisma.attendance.create({
      data: {
        date: date,
        userId: ditraUserId
      }
    });

    // Create start log
    await createLog(id, true, date);

    // Create end log with 10% probability of null
    const randomNumber = Math.random();
    const probability = 0.1;
    if (randomNumber > probability) {
      await createLog(id, false, date);
    }
  }
}

// Create report 
const createReport = async () => {
  const ditraUserId = '65e977f9ff15a6ab52da402a';
  const dates: string[] = createDates(new Date('2024-02-01'), new Date('2024-02-29'));

  for (let i = 0; i < dates.length; i++) {
    // Create report with 40% of chance
    const randomNumber = Math.random();
    const probability = 0.4;
    if (probability > randomNumber) {
      continue
    }

    const reportDate = dates[i]; 

    await prisma.report.create({
      data: {
        userId: ditraUserId,
        date: reportDate,
        status: randomNumber < 0.6 ? 'WAITING' : randomNumber < 0.8 ? 'ACCEPTED' : 'REJECTED',
        description: 'Menjaga gerbang kampus.',
        images: ['https://firebasestorage.googleapis.com/v0/b/sweepin.appspot.com/o/files%2F1.jpeg?alt=media&token=3a1494ff-2de2-4395-902b-b2ca68d65601',
        'https://firebasestorage.googleapis.com/v0/b/sweepin.appspot.com/o/files%2Fchica.jpeg?alt=media&token=2ee99079-2591-4718-818c-33be8c361684',
        'https://firebasestorage.googleapis.com/v0/b/sweepin.appspot.com/o/files%2Ffoxy.jpeg?alt=media&token=3e13a866-da49-449d-862b-f0d2a19559a7']
      }
    })
  }
}

async function main() {
  await createAttendance();
  await createReport();
}

main().catch(e => {
  console.log(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect;
})