import { initializeApp } from "firebase/app"
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable
} from "firebase/storage"

export const uploadFile = async (file: any) => {
  try {
    const storageRef = ref(
      getStorage(initializeApp({ storageBucket: process.env.STORAGE_BUCKET })),
      `files/${new Date().toISOString()}-${file.originalname}`
    )

    const metadata = {
      contentType: file.mimetype
    }

    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    )

    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error: any) {
    console.error("Error uploading file to Google Drive:", error.message)
    throw error
  }
}
