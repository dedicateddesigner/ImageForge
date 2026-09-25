import type { ImageFile } from '../../types/image'
import './ImageQueue.scss'

interface ImageQueueProps {
  files: ImageFile[]
  onRemove: (id: string) => void
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

function getFileFormat(file: ImageFile) {
  if (file.type) {
    return file.type.replace('image/', '').toUpperCase()
  }

  const extension = file.name.split('.').pop()

  return extension ? extension.toUpperCase() : 'UNKNOWN'
}

function ImageQueue({ files, onRemove }: ImageQueueProps) {
  if (files.length === 0) {
    return null
  }

  return (
    <section className="image-queue">
      <div className="image-queue__container">
        <div className="image-queue__header">
          <div>
            <p className="image-queue__eyebrow">Image queue</p>

            <h2>
              {files.length}{' '}
              {files.length === 1 ? 'image' : 'images'}
            </h2>
          </div>
        </div>

        <div className="image-queue__list">
          {files.map((imageFile) => (
            <article
              className="image-queue__item"
              key={imageFile.id}
            >
              <div className="image-queue__preview">
                <img
                  src={imageFile.previewUrl}
                  alt=""
                />
              </div>

              <div className="image-queue__info">
                <h3>{imageFile.name}</h3>

            <p>
              {getFileFormat(imageFile)} ·{' '}
              {formatFileSize(imageFile.size)}
              {imageFile.width > 0 && imageFile.height > 0 && (
                <>
                  {' · '}
                  {imageFile.width} × {imageFile.height}
                </>
              )}
            </p>
              </div>

              <button
                className="image-queue__remove"
                type="button"
                onClick={() => onRemove(imageFile.id)}
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ImageQueue