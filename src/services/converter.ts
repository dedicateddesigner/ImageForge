import { encode } from '@jsquash/webp'

export interface WebPConversionOptions {
  quality?: number
}

async function fileToImageData(file: File): Promise<ImageData> {
  const imageUrl = URL.createObjectURL(file)

  try {
    const image = new Image()

    image.src = imageUrl

    await image.decode()

    const canvas = document.createElement('canvas')

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Unable to create canvas context.')
    }

    context.drawImage(image, 0, 0)

    return context.getImageData(
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    )
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

export async function convertToWebP(
  file: File,
  options: WebPConversionOptions = {},
) {
  const imageData = await fileToImageData(file)

  const buffer = await encode(imageData, {
    quality: options.quality ?? 80,
  })

  return new Blob([buffer], {
    type: 'image/webp',
  })
}