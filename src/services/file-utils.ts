import type { ImageFile } from '../types/image'

export function createFileFingerprint(file: File) {
  return [file.name.toLowerCase(), file.size, file.lastModified].join('|')
}

export function isDuplicateFile(file: File, existingFiles: File[]) {
  const fingerprint = createFileFingerprint(file)

  return existingFiles.some(
    (existingFile) => createFileFingerprint(existingFile) === fingerprint,
  )
}

export function createImageFile(file: File): ImageFile {
  return {
    id: crypto.randomUUID(),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    fingerprint: createFileFingerprint(file),
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
