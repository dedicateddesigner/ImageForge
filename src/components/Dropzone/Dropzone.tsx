import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react' 
import './Dropzone.scss'

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

function isSupportedImage(file: File) {
  const fileName = file.name.toLowerCase()

  const hasSupportedType = ACCEPTED_TYPES.includes(file.type)
  const hasSupportedExtension = ACCEPTED_EXTENSIONS.some((extension) =>
    fileName.endsWith(extension),
  )

  return hasSupportedType || hasSupportedExtension
}

function filterImageFiles(files: File[]) {
  return files.filter(isSupportedImage)
}

function Dropzone({ onFilesSelected }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

const handleFiles = (files: File[]) => {
  const imageFiles = filterImageFiles(files)

  if (imageFiles.length === 0) {
    return
  }

  onFilesSelected(imageFiles)
}

const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(event.target.files ?? [])

  handleFiles(files)

  event.target.value = ''
}

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

const handleDrop = (event: DragEvent<HTMLDivElement>) => {
  event.preventDefault()
  setIsDragging(false)

  const files = Array.from(event.dataTransfer.files)

  handleFiles(files)
}

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <section className="dropzone-section">
      <div
        className={`dropzone ${isDragging ? 'dropzone--dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          className="dropzone__input"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.avif"
          multiple
          onChange={handleInputChange}
        />

        <div className="dropzone__content">
          <div className="dropzone__icon" aria-hidden="true">
            ↑
          </div>

          <h2 className="dropzone__title">Drop your images here</h2>

          <p className="dropzone__description">JPG, PNG, WebP and AVIF</p>

          <button
            className="dropzone__button"
            type="button"
            onClick={handleBrowseClick}
          >
            + Add Images
          </button>
        </div>
      </div>
    </section>
  )
}

export default Dropzone