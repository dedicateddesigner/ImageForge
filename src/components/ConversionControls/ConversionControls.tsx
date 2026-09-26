import './ConversionControls.scss'

interface ConversionControlsProps {
  quality: number
  setQuality: (quality: number) => void
}

function ConversionControls({ quality, setQuality }: ConversionControlsProps) {
  return (
    <section className="conversion-controls">
      <div className="conversion-controls__header">
        <div>
          <p className="conversion-controls__eyebrow">Conversion settings</p>

          <h2>WebP Quality</h2>
        </div>

        <strong className="conversion-controls__value">{quality}</strong>
      </div>

      <input
        className="conversion-controls__slider"
        type="range"
        min={10}
        max={100}
        value={quality}
        onChange={(event) => {
          setQuality(Number(event.target.value))
        }}
      />

      <div className="conversion-controls__range">
        <span>10</span>
        <span>100</span>
      </div>
    </section>
  )
}

export default ConversionControls
