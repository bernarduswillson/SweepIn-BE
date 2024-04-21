/**
 * @swagger
 * tags:
 *   - name: Report
 *     description: Report related endpoints
 * /report:
 *   get:
 *     summary: Retrieve a list of reports
 *     description: Retrieve a list of reports within a date range
 *     tags: [Report]
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
 *         name: status
 *         schema:
 *           type: string
 *           example: ACCEPTED
 *         description: The status of the report
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
 *         description: A list of reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get all reports successful
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *   post:
 *     summary: Create a report
 *     description: Send report creation request
 *     tags: [Report]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: 65e977f9ff15a6ab52da402a
 *               files:
 *                 type: array
 *               description:
 *                 type: string
 *                 example: This is a report
 *     responses:
 *       200:
 *         description: Report created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Submit post successful
 *                 data:
 *                   $ref: '#/components/schemas/submitReport'
 *
 * /report/{reportId}:
 *   get:
 *     summary: Retrieve report details
 *     description: Retrieve specific report details by report id.
 *     tags: [Report]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         schema:
 *           type: string
 *           example: 65f54e3e74e075636481087b
 *         required: true
 *         description: The report id
 *     responses:
 *       200:
 *         description: Report details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get report details successful
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - date
 *         - status
 *         - description
 *         - images
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the report
 *         userId:
 *           type: string
 *           description: The user id
 *         date:
 *           type: string
 *           description: The date of the report
 *         status:
 *           type: string
 *           description: The status of the report
 *         description:
 *           type: string
 *           description: The description of the report
 *         images:
 *           type: array
 *           description: list of links to the images that associated with the report
 *     submitReport:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           description: The user id
 *         files:
 *           type: array
 *           description: list of images that associated with the report
 *         description:
 *           type: string
 *           description: The description of the report
 */
