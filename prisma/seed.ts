import { PrismaClient } from '.prisma/client'

const prisma = new PrismaClient()

const createDates = (startDate: Date, endDate: Date) => {
  const dates: string[] = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString())
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

// Create Log
const createLog = async (
  attendanceId: number,
  start: boolean,
  date: string
) => {
  const logDate: Date = new Date(date)
  logDate.setUTCHours(start ? 8 : 17)
  logDate.setMinutes(0)
  logDate.setSeconds(0)

  await prisma.log.create({
    data: {
      date: logDate,
      latitude: -6.8922515,
      longitude: 107.60527,
      attendanceStartId: start ? attendanceId : null,
      attendanceEndId: start ? null : attendanceId
    }
  })
}

// Create attendance
const createAttendance = async (userId: number) => {
  const dates: string[] = createDates(
    new Date('2024-03-01'),
    new Date('2024-03-29')
  )

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i]

    // Create attendance
    const { id } = await prisma.attendance.create({
      data: {
        date: date,
        userId: userId
      }
    })

    // Create start log
    await createLog(id, true, date)

    // Create end log with 10% probability of null
    const randomNumber = Math.random()
    const probability = 0.1
    if (randomNumber > probability) {
      await createLog(id, false, date)
    }
  }
}

// Create report
const createReport = async (userId: number) => {
  const dates: string[] = createDates(
    new Date('2024-03-01'),
    new Date('2024-03-29')
  )

  for (let i = 0; i < dates.length; i++) {
    // Create report with 40% of chance
    const randomNumber = Math.random()
    const probability = 0.4
    if (probability > randomNumber) {
      continue
    }

    const reportDate = dates[i]

    await prisma.report.create({
      data: {
        userId: userId,
        date: reportDate,
        status:
          randomNumber < 0.6
            ? 'WAITING'
            : randomNumber < 0.8
              ? 'ACCEPTED'
              : 'REJECTED',
        description: 'Menjaga gerbang kampus.'
      }
    })
  }
}

const createUser = async () => {
  const user = await prisma.user.create({
    data: {
      email: '13521021@std.stei.itb.ac.id',
      name: 'Bernardus Willson',
      role: 'ADMIN',
      location: 'GANESHA'
    }
  })
  return user.id
}

const generateUsers = async () => {
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `email${i}@gmail.com`,
        name: `User ${i}`,
        role: i % 2 === 0 ? 'CLEANER' : 'SECURITY',
        location: i % 2 === 0 ? 'GANESHA' : 'JATINANGOR'
      }
    })
  }
}

async function main() {
  // generateUsers()
  let userid = await createUser()
  await createAttendance(userid)
  await createReport(userid)
}

main()
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect
  })
