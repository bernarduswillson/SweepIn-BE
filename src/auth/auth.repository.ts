import { db } from "../utils/db.server";

const getUserByEmail = async (email: string) => {
  return await db.user.findUnique({
    where: {
      email
    }
  });
};

export { getUserByEmail }