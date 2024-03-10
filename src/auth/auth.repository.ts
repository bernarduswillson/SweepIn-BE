import { db } from "../utils/db.server";

export const getUser = async (email: string) => {
  return await db.user.findUnique({
    where: {
      email
    }
  });
};

export const getUserByName = async (name: string) => {
  return await db.user.findUnique({
    where: {
      name
    }
  });
};