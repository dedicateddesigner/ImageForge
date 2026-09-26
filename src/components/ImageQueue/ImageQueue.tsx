import type { ImageFile, OutputFormat } from '../../types/image'

interface ImageQueueProps {
  files: ImageFile[]
  format: OutputFormat
  onRemove: (id: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function calculateReduction(
  originalSize: number,
  convertedSize: number,
): number {
  if (originalSize <= 0 || convertedSize <= 0) {
    return 0
  }

  return Math.round(((originalSize - convertedSize) / originalSize) * 100)
}

function getFileExtension(filename: string): string {
  const extension = filename.split('.').pop()

  return extension ? extension.toUpperCase() : 'IMAGE'
}

function ImageQueue({ files, format, onRemove }: ImageQueueProps) {
  return (
    <div className="image-queue">
      <div className="image-queue__grid">
        {files.map((imageFile) => {
          const reduction = calculateReduction(
            imageFile.size,
            imageFile.convertedSize,
          )

          return (
            <article className="image-card" key={imageFile.id}>
              <div className="image-card__preview">
                <img src={imageFile.previewUrl} alt={imageFile.name} />

                <button
                  className="image-card__remove"
                  type="button"
                  onClick={() => onRemove(imageFile.id)}
                  aria-label={`Remove ${imageFile.name}`}
                >
                  ×
                </button>
              </div>

              <div className="image-card__content">
                <div className="image-card__name">
                  <strong title={imageFile.name}>{imageFile.name}</strong>
                </div>

                <div className="image-card__meta">
                  {getFileExtension(imageFile.name)} ·{' '}
                  {formatFileSize(imageFile.size)}
                </div>

                <div className="image-card__dimensions">
                  <span>
                    {imageFile.width} × {imageFile.height}
                  </span>

                  {imageFile.conversionStatus === 'completed' && (
                    <>
                      <span>→</span>

                      <strong>
                        {imageFile.convertedWidth} × {imageFile.convertedHeight}
                      </strong>
                    </>
                  )}
                </div>

                {imageFile.conversionStatus === 'converting' && (
                  <div className="image-card__status">Converting...</div>
                )}

                {imageFile.conversionStatus === 'error' && (
                  <div className="image-card__error">
                    {imageFile.conversionError || 'Conversion failed.'}
                  </div>
                )}

                {imageFile.conversionStatus === 'completed' && (
                  <>
                    <div className="image-card__result">
                      <div>
                        <strong>{format.toUpperCase()}</strong>

                        <span> {formatFileSize(imageFile.convertedSize)}</span>
                      </div>

                      <span className="image-card__saved">
                        {reduction > 0
                          ? `${reduction}% smaller`
                          : reduction < 0
                            ? `${Math.abs(reduction)}% larger`
                            : 'Same size'}
                      </span>
                    </div>

                    <a
                      className="image-card__download"
                      href={imageFile.convertedUrl}
                      download={imageFile.name.replace(
                        /\.[^/.]+$/,
                        `.${format}`,
                      )}
                    >
                      Download
                    </a>
                  </>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default ImageQueue
