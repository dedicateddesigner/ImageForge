import './ImageQueue.scss'
import type { ImageFile } from '../../types/image'

interface ImageQueueProps {
  files: ImageFile[]
  onRemove: (id: string) => void
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function getReductionPercentage(
  originalSize: number,
  convertedSize: number,
) {
  if (
    originalSize === 0 ||
    convertedSize === 0
  ) {
    return 0
  }

  return Math.max(
    0,
    Math.round(
      (1 - convertedSize / originalSize) * 100,
    ),
  )
}

function ImageQueue({
  files,
  onRemove,
}: ImageQueueProps) {
  return (
    <section className="image-queue">
      <div className="image-queue__header">
        <div>
          <p className="image-queue__eyebrow">
            Files
          </p>

          <h2>
            {files.length}{' '}
            {files.length === 1
              ? 'image'
              : 'images'}
          </h2>
        </div>
      </div>

      <div className="image-queue__grid">
        {files.map((imageFile) => {
          const reduction =
            getReductionPercentage(
              imageFile.size,
              imageFile.convertedSize,
            )

          return (
            <article
              className="image-card"
              key={imageFile.id}
            >
              <div className="image-card__preview">
                <img
                  src={imageFile.previewUrl}
                  alt={imageFile.name}
                />
              </div>

              <div className="image-card__content">
                <div className="image-card__top">
                  <div className="image-card__name">
                    <strong title={imageFile.name}>
                      {imageFile.name}
                    </strong>

                    <span>
                      {imageFile.type
                        .split('/')[1]
                        ?.toUpperCase()}{' '}
                      ·{' '}
                      {formatFileSize(
                        imageFile.size,
                      )}
                    </span>
                  </div>

                  <button
                    className="image-card__remove"
                    type="button"
                    onClick={() =>
                      onRemove(imageFile.id)
                    }
                    aria-label={`Remove ${imageFile.name}`}
                  >
                    ×
                  </button>
                </div>

                <div className="image-card__dimensions">
                  <span>
                    {imageFile.width} ×{' '}
                    {imageFile.height}
                  </span>

                  {imageFile.conversionStatus ===
                    'completed' &&
                    imageFile.convertedWidth > 0 && (
                      <>
                        <span className="image-card__arrow">
                          →
                        </span>

                        <strong>
                          {imageFile.convertedWidth} ×{' '}
                          {imageFile.convertedHeight}
                        </strong>
                      </>
                    )}
                </div>

                {imageFile.conversionStatus ===
                  'converting' && (
                    <div className="image-card__status">
                      Converting…
                    </div>
                  )}

                {imageFile.conversionStatus ===
                  'completed' && (
                    <div className="image-card__result">
                      <div>
                        <strong>WebP</strong>

                        <span>
                          {formatFileSize(
                            imageFile.convertedSize,
                          )}
                        </span>
                      </div>

                      <span className="image-card__saved">
                        {reduction}% smaller
                      </span>
                    </div>
                  )}

                {imageFile.conversionStatus ===
                  'error' && (
                    <div className="image-card__error">
                      {imageFile.conversionError}
                    </div>
                  )}

                {imageFile.conversionStatus ===
                  'completed' &&
                  imageFile.convertedUrl && (
                    <a
                      className="image-card__download"
                      href={imageFile.convertedUrl}
                      download={imageFile.name.replace(
                        /\.[^/.]+$/,
                        '.webp',
                      )}
                    >
                      Download
                    </a>
                  )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ImageQueue