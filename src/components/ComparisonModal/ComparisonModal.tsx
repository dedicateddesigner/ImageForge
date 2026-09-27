import './ComparisonModal.scss'

interface ComparisonModalProps {
  isOpen: boolean
  originalUrl: string
  convertedUrl: string
  originalName: string
  onClose: () => void
}

function ComparisonModal({
  isOpen,
  originalUrl,
  convertedUrl,
  originalName,
  onClose,
}: ComparisonModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="comparison-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Compare ${originalName}`}
      onClick={onClose}
    >
      <div
        className="comparison-modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="comparison-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Close comparison"
        >
          ×
        </button>

        <div className="comparison-modal__header">
          <div>
            <span className="comparison-modal__eyebrow">Comparison</span>

            <h2>{originalName}</h2>
          </div>
        </div>

        <div className="comparison-modal__comparison">
          <div className="comparison-modal__image comparison-modal__image--original">
            <img src={originalUrl} alt={`Original ${originalName}`} />
          </div>

          <div className="comparison-modal__image comparison-modal__image--converted">
            <img src={convertedUrl} alt={`Converted ${originalName}`} />
          </div>

          <span className="comparison-modal__label comparison-modal__label--original">
            Original
          </span>

          <span className="comparison-modal__label comparison-modal__label--converted">
            Converted
          </span>
        </div>
      </div>
    </div>
  )
}

export default ComparisonModal
