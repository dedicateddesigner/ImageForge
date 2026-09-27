import type { ImageFile } from '../types/image'

export async function getFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function createImageFile(file: File): ImageFile {
  return {
    id: crypto.randomUUID(),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    hash: '',
    previewUrl: URL.createObjectURL(file),
    width: 0,
    height: 0,
    convertedWidth: 0,
    convertedHeight: 0,
    conversionStatus: 'ready',
    convertedSize: 0,
    convertedUrl: '',
    conversionError: '',
  }
}

export function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const previewUrl = URL.createObjectURL(file)

    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      })

      URL.revokeObjectURL(previewUrl)
    }

    image.onerror = () => {
      URL.revokeObjectURL(previewUrl)
      reject(new Error(`Unable to read image dimensions: ${file.name}`))
    }

    image.src = previewUrl
  })
}
