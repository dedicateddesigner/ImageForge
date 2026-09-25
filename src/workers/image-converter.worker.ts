import { encode } from '@jsquash/webp'

interface ConvertMessage {
  id: string
  imageData: {
    data: ArrayBuffer
    width: number
    height: number
  }
  quality: number
}

self.onmessage = async (event: MessageEvent<ConvertMessage>) => {
  const { id, imageData, quality } = event.data

  try {
    const pixels = new Uint8ClampedArray(imageData.data)

    const data = new ImageData(pixels, imageData.width, imageData.height)

    const buffer = await encode(data, {
      quality,
    })

    self.postMessage({
      id,
      success: true,
      buffer,
    })
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      error: error instanceof Error ? error.message : 'WebP conversion failed.',
    })
  }
}
