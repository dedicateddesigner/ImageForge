import { useState } from 'react'
import Header from './components/Header/Header'
import Dropzone from './components/Dropzone/Dropzone'
import ConversionSummary from './components/ConversionSummary/ConversionSummary'
import { convertToWebP } from './services/converter'
import {
  createImageFile,
  getImageDimensions,
  isDuplicateFile,
} from './services/file-utils'
import type { ImageFile } from './types/image'
import ImageQueue from './components/ImageQueue/ImageQueue'
import ConversionControls from './components/ConversionControls/ConversionControls'
import { createWebPZip } from './services/zip'

function App() {
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([])
  const [duplicateCount, setDuplicateCount] = useState(0)
  const [isConverting, setIsConverting] = useState(false)
  const [isCreatingZip, setIsCreatingZip] = useState(false)
  const [quality, setQuality] = useState(75)

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

    setIsConverting(true)

    for (const imageFile of selectedFiles) {
      setSelectedFiles((currentFiles) =>
        currentFiles.map((currentFile) =>
          currentFile.id === imageFile.id
            ? {
                ...currentFile,
                conversionStatus: 'converting',
                conversionError: '',
              }
            : currentFile,
        ),
      )

      try {
        const webpBlob = await convertToWebP(imageFile.file, quality)

        const convertedUrl = URL.createObjectURL(webpBlob)

        setSelectedFiles((currentFiles) =>
          currentFiles.map((currentFile) =>
            currentFile.id === imageFile.id
              ? {
                  ...currentFile,
                  conversionStatus: 'completed',
                  convertedSize: webpBlob.size,
                  convertedUrl,
                }
              : currentFile,
          ),
        )
      } catch (error) {
        setSelectedFiles((currentFiles) =>
          currentFiles.map((currentFile) =>
            currentFile.id === imageFile.id
              ? {
                  ...currentFile,
                  conversionStatus: 'error',
                  conversionError:
                    error instanceof Error
                      ? error.message
                      : 'Conversion failed.',
                }
              : currentFile,
          ),
        )
      }
    }

    setIsConverting(false)
  }

  const handleDownloadAll = async () => {
    const completedFiles = selectedFiles.filter(
      (file) => file.conversionStatus === 'completed',
    )

    if (completedFiles.length === 0 || isCreatingZip) {
      return
    }

    try {
      setIsCreatingZip(true)

      const zipBlob = await createWebPZip(completedFiles)
      const downloadUrl = URL.createObjectURL(zipBlob)

      const link = document.createElement('a')

      link.href = downloadUrl
      link.download = 'imageforge-webp.zip'

      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('ZIP creation failed:', error)
    } finally {
      setIsCreatingZip(false)
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
              {isConverting ? 'Converting...' : 'Convert All to WebP'}
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
        <ConversionControls quality={quality} setQuality={setQuality} />

        <ConversionSummary files={selectedFiles} />

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
              {selectedFiles.some(
                (file) => file.conversionStatus === 'completed',
              ) && (
                <section className="download-all">
                  <button
                    type="button"
                    onClick={handleDownloadAll}
                    disabled={isCreatingZip}
                  >
                    {isCreatingZip ? 'Creating ZIP...' : 'Download All as ZIP'}
                  </button>
                </section>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  )
}

export default App
