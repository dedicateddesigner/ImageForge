import type { ImageFile } from '../../types/image'
import './ConversionSummary.scss'

interface ConversionSummaryProps {
  files: ImageFile[]
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

function ConversionSummary({ files }: ConversionSummaryProps) {
  const completedFiles = files.filter(
    (file) => file.conversionStatus === 'completed',
  )

  if (completedFiles.length === 0) {
    return null
  }

  const originalSize = completedFiles.reduce(
    (total, file) => total + file.size,
    0,
  )

  const convertedSize = completedFiles.reduce(
    (total, file) => total + file.convertedSize,
    0,
  )

  const savedSize = originalSize - convertedSize

  const reductionPercentage =
    originalSize > 0 ? (savedSize / originalSize) * 100 : 0

  return (
    <section className="conversion-summary">
      <div className="conversion-summary__container">
        <div className="conversion-summary__header">
          <p className="conversion-summary__eyebrow">Conversion complete</p>

          <h2>
            {completedFiles.length}{' '}
            {completedFiles.length === 1
              ? 'image converted'
              : 'images converted'}
          </h2>
        </div>

        <div className="conversion-summary__stats">
          <div className="conversion-summary__stat">
            <span>Original size</span>
            <strong>{formatFileSize(originalSize)}</strong>
          </div>

          <div className="conversion-summary__stat">
            <span>Converted size</span>
            <strong>{formatFileSize(convertedSize)}</strong>
          </div>

          <div className="conversion-summary__stat">
            <span>Space saved</span>
            <strong>{formatFileSize(savedSize)}</strong>
          </div>

          <div className="conversion-summary__stat">
            <span>Overall reduction</span>
            <strong>{reductionPercentage.toFixed(1)}%</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConversionSummary
