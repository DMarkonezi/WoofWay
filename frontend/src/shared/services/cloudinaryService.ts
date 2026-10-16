const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? 'dbqnccyiu'
const UPLOAD_PRESET = 'woofway_unsigned'

export async function uploadImage(file: File): Promise<string> {
  if (!file) {
    throw new Error('File is required for upload.')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Only images are allowed.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Cloudinary upload failed.')
  }

  const data = await response.json()

  if (!data?.secure_url) {
    throw new Error('Invalid Cloudinary response.')
  }

  return data.secure_url as string
}