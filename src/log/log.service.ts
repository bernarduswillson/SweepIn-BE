import { createLog } from "./log.repository";

const submitLog = async (
  date: string,
  image: string,
  latitude: number,
  longitude: number
) => {
  const log = await createLog(
    date,
    image,
    latitude,
    longitude
  );
};

export { submitLog };