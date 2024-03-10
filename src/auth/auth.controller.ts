import express from "express";
import type { Request, Response } from "express";

// Repository
import { getUser } from "./auth.repository";

const route = express.Router();

/**
 * POST
 * /login 
 * body: email 
 * */ 
route.post('/login', async (req: Request, res: Response) => {  
  try {
    const { email } = req.body;
    
    const user = await getUser(email);
  
    // Check if email is registered
    if (!user) {
      // Throw 401 - Unauthorized
      return res.status(401).json({
        message: 'Email is not registered'
      });
    }

    // Throw 202 - Return credentials
    return res.status(200).json({
      message: 'Login successful',
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    // Throw server error
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
})

export default route;