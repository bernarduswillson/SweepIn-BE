import { db } from "../utils/db.server";

const createLog = async (
  date: string,
  image: string,
  latitude: number,
  longitude: number,
  attendanceStartId: string | undefined,
  attendanceEndId: string | undefined
) => {
  const ret = await db.log.create({
    data: {
      date,
      image,
      latitude,
      longitude,
      attendanceStartId,
      attendanceEndId
    }
  });

  return ret;
}

export { createLog };