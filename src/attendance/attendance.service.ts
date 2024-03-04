import { db } from "../utils/db.server"
import { Log, Activity } from "@prisma/client"

export const getActivity = async (
    startDate : string | undefined,
    endDate : string | undefined,
    userId : string | undefined
): Promise<Activity[]> => {
    return await db.activity.findMany({
        where: {
            date: {
                gte : startDate ? new Date(startDate).toISOString() : undefined,
                lte : endDate ? new Date(endDate).toISOString() : undefined
            },
            userId
        }
    })
}

export const getLog = async (id : string) : Promise<Log | null> => {
    return await db.log.findFirst({
        where : {
            id
        }
    })
}

export const postLog = async (
    userId : string,
    date : string,
    latitude : number,
    longitude : number,
    documentation : string
): Promise<Log> => {
    return await db.log.create({
        data: {
            date : new Date(date).toISOString(),
            latitude,
            longitude,
            documentation
        }
    })
}