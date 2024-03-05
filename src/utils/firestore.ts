import express from "express"
import type { Request, Response } from "express"
import { initializeApp } from "firebase/app"
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable
} from "firebase/storage"
import multer from "multer"

export const uploadRouter = express.Router()

//Initialize a firebase application
initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.FIRESTORE_DB_URL,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
})

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage()

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() })

uploadRouter.post(
  "/",
  upload.single("filename"),
  async (req: Request, res: Response) => {
    try {
      if (req.file) {
        const storageRef = ref(
          storage,
          `files/${req.file.originalname}-${new Date().toISOString()}`
        )

        // Create file metadata including the content type
        const metadata = {
          contentType: req.file.mimetype
        }

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(
          storageRef,
          req.file.buffer,
          metadata
        )

        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref)
        console.log("File successfully uploaded.")
        return res.send({
          message: "file uploaded to firebase storage",
          name: req.file.originalname,
          type: req.file.mimetype,
          downloadURL: downloadURL
        })
      }
    } catch (error: any) {
      res.status(500).json({
        message: "error",
        data: error.message
      })
    }
  }
)
