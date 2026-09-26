import {
  calculateResizeDimensions,
} from './resize'

import type {
  ResizeSettings,
} from '../types/image'

interface ConvertResponse {
  id: string
  success: boolean
  buffer?: ArrayBuffer
  error?: string
}

function createWorker() {
  return new Worker(
    new URL(
      '../workers/image-converter.worker.ts',
      import.meta.url,
    ),
    {
      type: 'module',
    },
  )
}

async function fileToImageData(
  file: File,
  resizeSettings: ResizeSettings,
): Promise<ImageData> {
  const imageUrl = URL.createObjectURL(file)

  try {
    const image = new Image()

    image.src = imageUrl

    await image.decode()

    const dimensions = calculateResizeDimensions(
      image.naturalWidth,
      image.naturalHeight,
      resizeSettings,
    )

    const canvas = document.createElement('canvas')

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Unable to create canvas context.')
    }

    context.drawImage(
      image,
      0,
      0,
      dimensions.width,
      dimensions.height,
    )

    return context.getImageData(
      0,
      0,
      dimensions.width,
      dimensions.height,
    )

  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

export async function convertToWebP(
  file: File,
  quality = 80,
  resizeSettings: ResizeSettings,
): Promise<Blob> {
  const imageData = await fileToImageData(
    file,
    resizeSettings,
  )

  const worker = createWorker()

  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID()

    worker.onmessage = (
      event: MessageEvent<ConvertResponse>,
    ) => {
      const response = event.data

      worker.terminate()

      if (!response.success || !response.buffer) {
        reject(
          new Error(
            response.error ?? 'WebP conversion failed.',
          ),
        )

        return
      }

      resolve(
        new Blob([response.buffer], {
          type: 'image/webp',
        }),
      )
    }

    worker.onerror = () => {
      worker.terminate()

      reject(
        new Error('WebP worker failed.'),
      )
    }

    worker.postMessage(
      {
        id,
        imageData: {
          data: imageData.data.buffer,
          width: imageData.width,
          height: imageData.height,
        },
        quality,
      },
      [imageData.data.buffer],
    )
  })
}