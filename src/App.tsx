import { convertToWebP } from './services/converter'
import { useState } from 'react'
import Header from './components/Header/Header'
import Dropzone from './components/Dropzone/Dropzone'
import {
  createImageFile,
  getImageDimensions,
  isDuplicateFile,
} from './services/file-utils'
import type { ImageFile } from './types/image'
import ImageQueue from './components/ImageQueue/ImageQueue'


function App() {
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([])
  const [duplicateCount, setDuplicateCount] = useState(0)

    const [webpResult, setWebpResult] = useState<{
    url: string
    size: number
  } | null>(null)

  const handleWebPTest = async () => {
  const firstImage = selectedFiles[0]

  if (!firstImage) {
    return
  }

  try {
    const webpBlob = await convertToWebP(firstImage.file, {
      quality: 80,
    })

    const url = URL.createObjectURL(webpBlob)

    setWebpResult({
      url,
      size: webpBlob.size,
    })
  } catch (error) {
    console.error('WebP conversion failed:', error)
  }
}

  const handleFilesSelected = (newFiles: File[]) => {
    const existingRawFiles = selectedFiles.map((imageFile) => imageFile.file)

    const filesToCheck = [...existingRawFiles]

    const uniqueFiles = newFiles.filter((newFile) => {
      const isDuplicate = isDuplicateFile(newFile, filesToCheck)

      if (!isDuplicate) {
        filesToCheck.push(newFile)
      }

      return !isDuplicate
    })

    const duplicates = newFiles.length - uniqueFiles.length

    setDuplicateCount(duplicates)

    const newImageFiles = uniqueFiles.map(createImageFile)

    setSelectedFiles((currentFiles) => [...currentFiles, ...newImageFiles])

    newImageFiles.forEach(async (imageFile) => {
      try {
        const dimensions = await getImageDimensions(imageFile.file)

        setSelectedFiles((currentFiles) =>
          currentFiles.map((currentFile) =>
            currentFile.id === imageFile.id
              ? {
                  ...currentFile,
                  width: dimensions.width,
                  height: dimensions.height,
                }
              : currentFile,
          ),
        )
      } catch {
        // Keep the image in the queue even if dimensions cannot be read.
      }
    })
  }

  return (
    <>
      <Header />

      <main>
        <section className="app-intro">
          <div className="app-intro__container">
            <p className="app-intro__eyebrow">Local image optimization</p>

            <h1>Convert your images.</h1>

            <p>
              Convert JPG, PNG, WebP and AVIF images locally, without uploading
              them to a server.
            </p>
          </div>
        </section>

        <Dropzone onFilesSelected={handleFilesSelected} />

        <ImageQueue
          files={selectedFiles}
          onRemove={(id) => {
            setSelectedFiles((currentFiles) => {
              const imageToRemove = currentFiles.find(
                (imageFile) => imageFile.id === id,
              )

              if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.previewUrl)
              }

              return currentFiles.filter((imageFile) => imageFile.id !== id)
            })
          }}
        />

        {selectedFiles.length > 0 && (
          <section className="file-summary">
            <div className="file-summary__container">
              <strong>{selectedFiles.length}</strong>{' '}
              {selectedFiles.length === 1 ? 'image' : 'images'} ready
              {duplicateCount > 0 && (
                <>
                  {' · '}
                  <strong>{duplicateCount}</strong>{' '}
                  {duplicateCount === 1 ? 'duplicate' : 'duplicates'} skipped
                </>
              )}
              <div>
        <button type="button" onClick={handleWebPTest}>
          Test WebP Conversion
        </button>

        {webpResult && (
          <p>
            WebP output: {(webpResult.size / 1024).toFixed(1)} KB{' '}
            <a
              href={webpResult.url}
              download="imageforge-test.webp"
            >
              Download WebP
            </a>
          </p>
        )}
      </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}

export default App
