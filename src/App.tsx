import { useState } from 'react'
import Header from './components/Header/Header'
import Dropzone from './components/Dropzone/Dropzone'
import { convertToWebP } from './services/converter'
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
  const [isConverting, setIsConverting] = useState(false)

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

  const handleTestConversion = async () => {
    if (selectedFiles.length === 0 || isConverting) {
      return
    }

    try {
      setIsConverting(true)

      for (const imageFile of selectedFiles) {
        const webpBlob = await convertToWebP(imageFile.file, 80)

        const downloadUrl = URL.createObjectURL(webpBlob)
        const link = document.createElement('a')

        link.href = downloadUrl
        link.download = imageFile.name.replace(/\.[^/.]+$/, '.webp')

        document.body.appendChild(link)
        link.click()
        link.remove()

        URL.revokeObjectURL(downloadUrl)
      }
    } catch (error) {
      console.error('WebP conversion failed:', error)
    } finally {
      setIsConverting(false)
    }
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

        {selectedFiles.length > 0 && (
          <section className="conversion-test">
            <button
              type="button"
              onClick={handleTestConversion}
              disabled={isConverting}
            >
              {isConverting ? 'Converting...' : 'Test WebP Conversion'}
            </button>
          </section>
        )}

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
            </div>
          </section>
        )}
      </main>
    </>
  )
}

export default App
