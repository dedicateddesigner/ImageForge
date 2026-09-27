import { useState, type ChangeEvent, type CSSProperties } from 'react'

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
  const [position, setPosition] = useState(50)

  if (!isOpen) {
    return null
  }

  const comparisonStyle = {
    '--comparison-position': `${position}%`,
  } as CSSProperties

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPosition(Number(event.target.value))
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
          <span className="comparison-modal__eyebrow">Comparison</span>

          <h2>{originalName}</h2>
        </div>

        <div className="comparison-modal__comparison" style={comparisonStyle}>
          {/* Original image */}
          <div className="comparison-modal__image comparison-modal__image--original">
            <img src={originalUrl} alt={`Original ${originalName}`} />
          </div>

          {/* Converted image */}
          <div className="comparison-modal__image comparison-modal__image--converted">
            <img src={convertedUrl} alt={`Converted ${originalName}`} />
          </div>

          {/* Labels */}
          <span className="comparison-modal__label comparison-modal__label--original">
            Original
          </span>

          <span className="comparison-modal__label comparison-modal__label--converted">
            Converted
          </span>

          {/* Divider */}
          <div className="comparison-modal__divider">
            <div className="comparison-modal__handle" aria-hidden="true">
              ↔
            </div>
          </div>

          {/* Invisible interaction slider */}
          <input
            className="comparison-modal__slider"
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={handleSliderChange}
            aria-label="Compare original and converted image"
          />
        </div>

        <div className="comparison-modal__hint">
          Drag the divider to compare the original and converted image.
        </div>
      </div>
    </div>
  )
}

export default ComparisonModal
