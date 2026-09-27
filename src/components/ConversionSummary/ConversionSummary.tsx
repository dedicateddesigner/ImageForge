import type { ImageFile } from '../../types/image'

interface ConversionSummaryProps {
  files: ImageFile[]
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

function ConversionSummary({ files }: ConversionSummaryProps) {
  const completedFiles = files.filter(
    (file) => file.conversionStatus === 'completed',
  )

  const originalSize = completedFiles.reduce(
    (total, file) => total + file.size,
    0,
  )

  const convertedSize = completedFiles.reduce(
    (total, file) => total + file.convertedSize,
    0,
  )

  const savedSize = Math.max(originalSize - convertedSize, 0)

  const reduction =
    originalSize > 0
      ? Math.round(((originalSize - convertedSize) / originalSize) * 100)
      : 0

  return (
    <section className="conversion-summary">
      <div className="conversion-summary__header">
        <div>
          <p className="conversion-summary__eyebrow">Compression summary</p>

          <h2>Overall results</h2>
        </div>

        <span className="conversion-summary__count">
          {completedFiles.length}{' '}
          {completedFiles.length === 1 ? 'image' : 'images'}
        </span>
      </div>

      <div className="conversion-summary__stats">
        <div className="conversion-summary__stat">
          <span>Original</span>
          <strong>{formatFileSize(originalSize)}</strong>
        </div>

        <div className="conversion-summary__stat">
          <span>Converted</span>
          <strong>{formatFileSize(convertedSize)}</strong>
        </div>

        <div className="conversion-summary__stat">
          <span>Saved</span>
          <strong>{formatFileSize(savedSize)}</strong>
        </div>

        <div className="conversion-summary__stat conversion-summary__stat--highlight">
          <span>Reduction</span>
          <strong>{reduction}%</strong>
        </div>
      </div>
    </section>
  )
}

export default ConversionSummary
