import { useState } from 'react'

import Header from './components/Header/Header'
import Dropzone from './components/Dropzone/Dropzone'
import ImageQueue from './components/ImageQueue/ImageQueue'
import ConversionControls from './components/ConversionControls/ConversionControls'
import ConversionSummary from './components/ConversionSummary/ConversionSummary'

import { convertImage } from './services/converter'

import {
  createImageFile,
  getImageDimensions,
  isDuplicateFile,
} from './services/file-utils'

import { createConversionZip } from './services/zip'

import type { ConversionSettings, ImageFile } from './types/image'

function App() {
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([])

  const [duplicateCount, setDuplicateCount] = useState(0)

  const [isConverting, setIsConverting] = useState(false)

  const [isCreatingZip, setIsCreatingZip] = useState(false)

  const [settings, setSettings] = useState<ConversionSettings>({
    format: 'webp',
    quality: 75,

    resize: {
      enabled: false,
      mode: 'percentage',
      percentage: 100,
      width: 0,
      height: 0,
      maintainAspectRatio: true,
    },
  })

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
        // Keep the image in the queue
        // if dimensions cannot be read.
      }
    })
  }

  const handleConversion = async () => {
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
        const convertedBlob = await convertImage(
          imageFile.file,
          settings.format,
          settings.quality,
          settings.resize,
        )

        const convertedImage = await createImageBitmap(convertedBlob)

        const convertedWidth = convertedImage.width

        const convertedHeight = convertedImage.height

        convertedImage.close()

        const convertedUrl = URL.createObjectURL(convertedBlob)

        setSelectedFiles((currentFiles) =>
          currentFiles.map((currentFile) =>
            currentFile.id === imageFile.id
              ? {
                  ...currentFile,
                  conversionStatus: 'completed',
                  convertedSize: convertedBlob.size,
                  convertedWidth,
                  convertedHeight,
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
      (file) => file.conversionStatus === 'completed' && file.convertedUrl,
    )

    if (completedFiles.length === 0 || isCreatingZip) {
      return
    }

    try {
      setIsCreatingZip(true)

      const zipBlob = await createConversionZip(completedFiles, settings.format)

      const downloadUrl = URL.createObjectURL(zipBlob)

      const link = document.createElement('a')

      link.href = downloadUrl

      link.download = `imageforge-${settings.format}.zip`

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

  const handleRemove = (id: string) => {
    setSelectedFiles((currentFiles) => {
      const imageToRemove = currentFiles.find(
        (imageFile) => imageFile.id === id,
      )

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl)

        if (imageToRemove.convertedUrl) {
          URL.revokeObjectURL(imageToRemove.convertedUrl)
        }
      }

      return currentFiles.filter((imageFile) => imageFile.id !== id)
    })
  }

  const completedCount = selectedFiles.filter(
    (file) => file.conversionStatus === 'completed',
  ).length

  return (
    <>
      <Header />

      <main className="app-shell">
        <aside className="app-sidebar">
          <div className="app-sidebar__brand">
            <p className="app-sidebar__eyebrow">Local image optimization</p>

            <h1>ImageForge</h1>

            <p>Convert and optimize your images locally.</p>
          </div>

          <Dropzone onFilesSelected={handleFilesSelected} />

          <ConversionControls settings={settings} setSettings={setSettings} />

          {selectedFiles.length > 0 && (
            <div className="app-sidebar__actions">
              <button
                className="app-sidebar__convert"
                type="button"
                onClick={handleConversion}
                disabled={isConverting}
              >
                {isConverting
                  ? 'Converting...'
                  : `Convert ${selectedFiles.length} ${
                      selectedFiles.length === 1 ? 'image' : 'images'
                    }`}
              </button>

              {completedCount > 0 && (
                <button
                  className="app-sidebar__download"
                  type="button"
                  onClick={handleDownloadAll}
                  disabled={isCreatingZip}
                >
                  {isCreatingZip ? 'Creating ZIP...' : 'Download ZIP'}
                </button>
              )}
            </div>
          )}

          {duplicateCount > 0 && (
            <p className="app-sidebar__duplicate">
              {duplicateCount} duplicate{' '}
              {duplicateCount === 1 ? 'image' : 'images'} skipped.
            </p>
          )}
        </aside>

        <section className="app-workspace">
          <div className="app-workspace__header">
            <div>
              <p className="app-workspace__eyebrow">Image queue</p>

              <h2>
                {selectedFiles.length}{' '}
                {selectedFiles.length === 1 ? 'image' : 'images'}
              </h2>
            </div>

            {selectedFiles.length > 0 && (
              <span className="app-workspace__hint">
                {completedCount} converted
              </span>
            )}
          </div>

          {selectedFiles.length > 0 ? (
            <>
              {completedCount > 0 && (
                <ConversionSummary files={selectedFiles} />
              )}

              <ImageQueue
                files={selectedFiles}
                format={settings.format}
                onRemove={handleRemove}
              />
            </>
          ) : (
            <div className="app-workspace__empty">
              <p>Add images to start converting.</p>
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default App
