/**
 * @swagger
 * tags :
 *  - name: Attendance
 *    description: Attendance related endpoints
 * /api/attendance:
 *  get:
 *      summary: Get all attendance
 *      description: Get all attendance
 *      tags: [Attendance]
 *      parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *          type: string
 *          example: secretapikey
 *      responses:
 *          '200':
 *              description: A successful response
 *          '500':
 *              description: Internal server error
 * /api/attendance/{attendanceId}:
 *  get:
 *      summary: Get attendance details by Id
 *      description: Get attendance details by Id
 *      tags: [Attendance]
 *      parameteres:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *          type: string
 *          example: secretapikey
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         description : attendanceId
 *         schema:
 *          type: string
 *      responses:
 *          '200':
 *              description: A successful response
 *          '500':
 *              description: Internal server error 
 */