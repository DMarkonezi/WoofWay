import { useRef, useState } from 'react'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? 'dbqnccyiu'
const UPLOAD_PRESET = 'woofway_unsigned'

export function useImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  function handleFileSelect(file: File) {
    if (!file.type.startsWith('image/')) return

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleRemoveImage() {
    setImageFile(null)
    setImagePreview(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function uploadToCloudinary(): Promise<string> {
    if (!imageFile) throw new Error('No image selected')

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('upload_preset', UPLOAD_PRESET)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.secure_url as string
    } finally {
      setUploadingImage(false)
    }
  }

  return {
    fileInputRef,
    imageFile,
    imagePreview,
    uploadingImage,
    handleFileSelect,
    handleRemoveImage,
    uploadToCloudinary,
  }
}