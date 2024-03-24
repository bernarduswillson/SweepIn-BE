/**
 * @swagger
 * tags :
 *  - name: Auth
 *    description: Auth related endpoints
 * /auth/login:
 *   post:
 *      summary: Login user account
 *      description: Send user login account request
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: example@gmail.com
 *              required:
 *                - email
 *      responses:
 *        200:
 *          description: User's credentials
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Login successful
 *                  data:
 *                    $ref: '#/components/schemas'
 *              
 * /auth/register:
 *   post:
 *      summary: Register user account
 *      description: Send user register account request
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: example@gmail.com
 *                name:
 *                  type: string
 *                  example: Gwyn
 *                role:
 *                  type: string
 *                  example: ADMIN
 *                location:
 *                  type: string
 *                  example: GANESHA
 *      responses:
 *        201:
 *          description: User's data
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: User created
 *                  data:
 *                    $ref: '#/components/schemas'
 * 
 * components:
 *   schemas:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: The user id
 *        email:
 *          type: string
 *          description: The user email
 *        name:
 *          type: string
 *          description: The user name
 *        role:
 *          type: string
 *          description: The user role
 *        location:
 *          type: string
 *          description: The user location for work
 */
