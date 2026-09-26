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
import type { ConversionSettings, ImageFile } from './types/image'
import ImageQueue from './components/ImageQueue/ImageQueue'
import ConversionControls from './components/ConversionControls/ConversionControls'
import { createWebPZip } from './services/zip'

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
        const webpBlob = await convertToWebP(
          imageFile.file,
          settings.quality,
          settings.resize,
        )

        const convertedImage = await createImageBitmap(webpBlob)
        const convertedWidth = convertedImage.width
        const convertedHeight = convertedImage.height

        convertedImage.close()

        const convertedUrl = URL.createObjectURL(webpBlob)

        if (imageFile.convertedUrl) {
          URL.revokeObjectURL(imageFile.convertedUrl)
        }

        setSelectedFiles((currentFiles) =>
          currentFiles.map((currentFile) =>
            currentFile.id === imageFile.id
              ? {
                  ...currentFile,
                  conversionStatus: 'completed',
                  convertedSize: webpBlob.size,
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

  const completedCount = selectedFiles.filter(
    (file) => file.conversionStatus === 'completed',
  ).length

  return (
    <>
      <Header />

      <main className="app-shell">
        <aside className="app-sidebar">
          <div className="app-sidebar__content">
            <div className="app-sidebar__intro">
              <p className="app-sidebar__eyebrow">Local image optimization</p>
              <h1>ImageForge</h1>
              <p>Convert and optimize your images locally.</p>
            </div>

            <Dropzone onFilesSelected={handleFilesSelected} />

            <ConversionControls
              settings={settings}
              setSettings={setSettings}
            />

            {selectedFiles.length > 0 && (
              <div className="app-sidebar__actions">
                <button
                  className="app-sidebar__convert"
                  type="button"
                  onClick={handleTestConversion}
                  disabled={isConverting}
                >
                  {isConverting
                    ? 'Converting…'
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
                    {isCreatingZip ? 'Creating ZIP…' : 'Download ZIP'}
                  </button>
                )}
              </div>
            )}

            {selectedFiles.length > 0 && (
              <div className="app-sidebar__meta">
                <span>
                  {selectedFiles.length} {selectedFiles.length === 1 ? 'image' : 'images'}
                </span>
                {duplicateCount > 0 && <span>{duplicateCount} duplicate(s) skipped</span>}
              </div>
            )}
          </div>
        </aside>

        <section className="app-workspace">
          <div className="app-workspace__inner">
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
                  {completedCount > 0
                    ? `${completedCount} converted`
                    : 'Ready to convert'}
                </span>
              )}
            </div>

            {selectedFiles.length > 0 ? (
              <>
                <ImageQueue
                  files={selectedFiles}
                  onRemove={(id) => {
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
                  }}
                />

                <ConversionSummary files={selectedFiles} />
              </>
            ) : (
              <div className="app-workspace__empty">
                <div>
                  <strong>Your image queue is empty</strong>
                  <p>Add JPG, PNG, WebP or AVIF images to begin.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}

export default App
