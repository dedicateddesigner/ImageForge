import JSZip from 'jszip'

import type { ImageFile, OutputFormat } from '../types/image'

export async function createConversionZip(
  files: ImageFile[],
  format: OutputFormat,
): Promise<Blob> {
  const zip = new JSZip()

  const completedFiles = files.filter(
    (file) => file.conversionStatus === 'completed' && file.convertedUrl,
  )

  for (const imageFile of completedFiles) {
    const response = await fetch(imageFile.convertedUrl)

    if (!response.ok) {
      throw new Error(`Unable to read converted file: ${imageFile.name}`)
    }

    const blob = await response.blob()

    const filename = imageFile.name.replace(/\.[^/.]+$/, `.${format}`)

    zip.file(filename, blob)
  }

  return zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6,
    },
  })
}
