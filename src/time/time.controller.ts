import express, { response } from 'express'
import type { Request, Response } from 'express'
import { responseError } from '../class/Error'
import { getTime } from './time.service'



const route = express.Router()
/**
 * @method POST /time
 * @returns Time
 * 
 * @example http://{{base_url}}/time
 */
route.get('/', async (req: Request, res: Response) => {
    try {
        const serverTime = await getTime()

        return res.status(200).json({
            message: 'Get Time Successfull',
            data: serverTime
        })
    }
    catch (error) {
        responseError(error, res)
    }
})


export default route