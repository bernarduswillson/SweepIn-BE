/**
 * @swagger
 * tags :
 *  - name: Log
 *    description: Log related endpoints
 * /log:
 *   post:
 *      summary: Create a log
 *      description: Send log creation request
 *      tags: [Log]
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: string
 *                  example: 65e977f9ff15a6ab52da402a
 *                date:
 *                  type: string
 *                  example: 2024-03-11T18:14:50.953Z
 *                latitude:
 *                  type: string
 *                  example: 69.42
 *                longitude:
 *                  type: string
 *                  example: 420.69
 *                file:
 *                  type: Express.Multer.File
 *      responses:
 *      200:
 *         description: Log created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Submit log successful
 *                
 */