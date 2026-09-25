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
  quality = 80,
): Promise<Blob> {
  const imageData = await fileToImageData(file)
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
      reject(new Error('WebP worker failed.'))
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