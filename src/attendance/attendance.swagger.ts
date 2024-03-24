/**
 * @swagger
 * tags :
 *  - name: Attendance
 *    description: Attendance related endpoints
 * /attendance:
 *   get:
 *     summary: Retrieve a list of attendances
 *     description: Retrieve a list of attendances for a specific user within a date range. The attendances are returned in pages.
 *     tags: [Attendance]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *           example: 65f54e3e74e075636481087b
 *         description: The user id
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           example: 2021-08-01T00:00:00.000Z
 *         description: The start date in ISO 8601 format
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           example: 2024-08-31T23:59:59.999Z
 *         description: The end date in ISO 8601 format
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *         description: The current page
 *       - in: query
 *         name: per_page
 *         required: true
 *         schema:
 *           type: string
 *           example: 10
 *         description: The number of data in a page
 *     responses:
 *       200:
 *         description: A list of attendances
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get all attendance successful
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attendance'
 *
 * /attendance/{attendanceId}:
 *   get:
 *     summary: Retrieve attendance details
 *     description: Retrieve specific attendance details by attendance id.
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         schema:
 *           type: string
 *           example: 65f54e5774e07563648108cd
 *         required: true
 *         description: The attendance id
 *     responses:
 *       200:
 *         description: Attendance details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get attendance details successful
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       required:
 *         - id
 *         - date
 *         - image
 *         - latitude
 *         - longitude
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the log
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the log
 *         image:
 *           type: string
 *           description: The image associated with the log
 *         latitude:
 *           type: number
 *           format: float
 *           description: The latitude where the log was created
 *         longitude:
 *           type: number
 *           format: float
 *           description: The longitude where the log was created
 *
 *     Attendance:
 *       type: object
 *       required:
 *         - id
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the attendance
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the attendance
 *         startLog:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Log'
 *           description: The start log of the attendance
 *         endLog:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Log'
 *           description: The end log of the attendance
 */
