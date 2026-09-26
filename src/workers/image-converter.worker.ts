import { encode as encodeWebP } from '@jsquash/webp'
import { encode as encodeAVIF } from '@jsquash/avif'

interface ConvertMessage {
  id: string
  format: 'webp' | 'avif'
  imageData: {
    data: ArrayBuffer
    width: number
    height: number
  }
  quality: number
}

self.onmessage = async (event: MessageEvent<ConvertMessage>) => {
  const { id, format, imageData, quality } = event.data

  try {
    const pixels = new Uint8ClampedArray(imageData.data)

    const data = new ImageData(pixels, imageData.width, imageData.height)

    let buffer: ArrayBuffer

    if (format === 'webp') {
      buffer = await encodeWebP(data, {
        quality,
      })
    } else {
      buffer = await encodeAVIF(data, {
        quality,
      })
    }

    self.postMessage({
      id,
      success: true,
      buffer,
    })
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      error:
        error instanceof Error
          ? error.message
          : `${format.toUpperCase()} conversion failed.`,
    })
  }
}
