import type { ConversionSettings, ResizeMode } from '../../types/image'
import './ConversionControls.scss'

interface ConversionControlsProps {
  settings: ConversionSettings
  setSettings: (settings: ConversionSettings) => void
}

function ConversionControls({
  settings,
  setSettings,
}: ConversionControlsProps) {
  const updateResize = (
    changes: Partial<ConversionSettings['resize']>,
  ) => {
    setSettings({
      ...settings,
      resize: {
        ...settings.resize,
        ...changes,
      },
    })
  }

  return (
    <section className="conversion-controls">
      <div className="conversion-controls__title">
        <span>Conversion</span>
        <strong>Settings</strong>
      </div>

      <div className="conversion-controls__field">
        <label htmlFor="output-format">Format</label>
        <select
          id="output-format"
          value={settings.format}
          disabled
          aria-label="Output format"
        >
          <option value="webp">WebP</option>
        </select>
      </div>

      <div className="conversion-controls__divider" />

      <div className="conversion-controls__resize-heading">
        <div>
          <strong>Resize</strong>
          <span>Change dimensions before conversion.</span>
        </div>

        <label className="conversion-controls__switch">
          <input
            type="checkbox"
            checked={settings.resize.enabled}
            onChange={(event) => {
              updateResize({ enabled: event.target.checked })
            }}
          />
          <span />
        </label>
      </div>

      {settings.resize.enabled && (
        <div className="conversion-controls__resize">
          <div className="conversion-controls__field">
            <label htmlFor="resize-mode">Mode</label>
            <select
              id="resize-mode"
              value={settings.resize.mode}
              onChange={(event) => {
                updateResize({
                  mode: event.target.value as ResizeMode,
                })
              }}
            >
              <option value="percentage">Percentage</option>
              <option value="width">Width</option>
              <option value="height">Height</option>
            </select>
          </div>

          {settings.resize.mode === 'percentage' && (
            <div className="conversion-controls__field">
              <label htmlFor="resize-percentage">Scale</label>
              <div className="conversion-controls__input">
                <input
                  id="resize-percentage"
                  type="number"
                  min="1"
                  max="400"
                  value={settings.resize.percentage}
                  onChange={(event) => {
                    updateResize({
                      percentage: Number(event.target.value),
                    })
                  }}
                />
                <span>%</span>
              </div>
            </div>
          )}

          {settings.resize.mode === 'width' && (
            <div className="conversion-controls__field">
              <label htmlFor="resize-width">Width</label>
              <div className="conversion-controls__input">
                <input
                  id="resize-width"
                  type="number"
                  min="1"
                  value={settings.resize.width}
                  onChange={(event) => {
                    updateResize({
                      width: Number(event.target.value),
                    })
                  }}
                />
                <span>px</span>
              </div>
            </div>
          )}

          {settings.resize.mode === 'height' && (
            <div className="conversion-controls__field">
              <label htmlFor="resize-height">Height</label>
              <div className="conversion-controls__input">
                <input
                  id="resize-height"
                  type="number"
                  min="1"
                  value={settings.resize.height}
                  onChange={(event) => {
                    updateResize({
                      height: Number(event.target.value),
                    })
                  }}
                />
                <span>px</span>
              </div>
            </div>
          )}

          <label className="conversion-controls__aspect">
            <input
              type="checkbox"
              checked={settings.resize.maintainAspectRatio}
              onChange={(event) => {
                updateResize({
                  maintainAspectRatio: event.target.checked,
                })
              }}
            />
            <span>Maintain aspect ratio</span>
          </label>
        </div>
      )}

      <div className="conversion-controls__divider" />

      <div className="conversion-controls__quality">
        <div className="conversion-controls__quality-heading">
          <div>
            <strong>Quality</strong>
            <span>Higher quality = larger file.</span>
          </div>
          <b>{settings.quality}</b>
        </div>

        <input
          className="conversion-controls__slider"
          type="range"
          min="10"
          max="100"
          value={settings.quality}
          onChange={(event) => {
            setSettings({
              ...settings,
              quality: Number(event.target.value),
            })
          }}
          aria-label="WebP quality"
        />

        <div className="conversion-controls__range">
          <span>Smaller</span>
          <span>Higher quality</span>
        </div>
      </div>
    </section>
  )
}

export default ConversionControls
