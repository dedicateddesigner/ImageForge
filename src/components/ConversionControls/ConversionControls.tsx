import type {
  ConversionSettings,
  ResizeMode,
} from '../../types/image'
import './ConversionControls.scss'

interface ConversionControlsProps {
  settings: ConversionSettings
  setSettings: (
    settings: ConversionSettings,
  ) => void
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
      <div className="conversion-controls__header">
        <div>
          <p className="conversion-controls__eyebrow">
            Conversion settings
          </p>

          <h2>Prepare your images</h2>

          <p className="conversion-controls__description">
            Choose the output format, resize your images,
            and adjust quality before converting.
          </p>
        </div>
      </div>

      <div className="conversion-controls__section">
        <label
          htmlFor="output-format"
          className="conversion-controls__label"
        >
          Output format
        </label>

        <select
          id="output-format"
          className="conversion-controls__select"
          value={settings.format}
          disabled
        >
          <option value="webp">WebP</option>
        </select>

        <p className="conversion-controls__hint">
          More formats will be available soon.
        </p>
      </div>

      <div className="conversion-controls__section">
        <div className="conversion-controls__section-heading">
          <div>
            <h3>Resize</h3>

            <p>
              Reduce or enlarge image dimensions before
              conversion.
            </p>
          </div>

          <label className="conversion-controls__switch">
            <input
              type="checkbox"
              checked={settings.resize.enabled}
              onChange={(event) => {
                updateResize({
                  enabled: event.target.checked,
                })
              }}
            />

            <span />
          </label>
        </div>

        {settings.resize.enabled && (
          <div className="conversion-controls__resize">
            <div className="conversion-controls__field">
              <label
                htmlFor="resize-mode"
                className="conversion-controls__label"
              >
                Resize mode
              </label>

              <select
                id="resize-mode"
                className="conversion-controls__select"
                value={settings.resize.mode}
                onChange={(event) => {
                  updateResize({
                    mode: event.target
                      .value as ResizeMode,
                  })
                }}
              >
                <option value="percentage">
                  Percentage
                </option>

                <option value="width">
                  Width
                </option>

                <option value="height">
                  Height
                </option>
              </select>
            </div>

            {settings.resize.mode ===
              'percentage' && (
                <div className="conversion-controls__field">
                  <label
                    htmlFor="resize-percentage"
                    className="conversion-controls__label"
                  >
                    Scale
                  </label>

                  <div className="conversion-controls__input">
                    <input
                      id="resize-percentage"
                      type="number"
                      min="1"
                      max="400"
                      value={settings.resize.percentage}
                      onChange={(event) => {
                        updateResize({
                          percentage: Number(
                            event.target.value,
                          ),
                        })
                      }}
                    />

                    <span>%</span>
                  </div>
                </div>
              )}

            {settings.resize.mode === 'width' && (
              <div className="conversion-controls__field">
                <label
                  htmlFor="resize-width"
                  className="conversion-controls__label"
                >
                  Width
                </label>

                <div className="conversion-controls__input">
                  <input
                    id="resize-width"
                    type="number"
                    min="1"
                    value={settings.resize.width}
                    onChange={(event) => {
                      updateResize({
                        width: Number(
                          event.target.value,
                        ),
                      })
                    }}
                  />

                  <span>px</span>
                </div>
              </div>
            )}

            {settings.resize.mode === 'height' && (
              <div className="conversion-controls__field">
                <label
                  htmlFor="resize-height"
                  className="conversion-controls__label"
                >
                  Height
                </label>

                <div className="conversion-controls__input">
                  <input
                    id="resize-height"
                    type="number"
                    min="1"
                    value={settings.resize.height}
                    onChange={(event) => {
                      updateResize({
                        height: Number(
                          event.target.value,
                        ),
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
                checked={
                  settings.resize.maintainAspectRatio
                }
                onChange={(event) => {
                  updateResize({
                    maintainAspectRatio:
                      event.target.checked,
                  })
                }}
              />

              <span>
                <strong>
                  Maintain aspect ratio
                </strong>

                <small>
                  Prevents images from becoming distorted.
                </small>
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="conversion-controls__section">
        <div className="conversion-controls__quality-header">
          <div>
            <h3>WebP quality</h3>

            <p>
              Higher quality produces larger files.
            </p>
          </div>

          <strong>
            {settings.quality}
          </strong>
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
              quality: Number(
                event.target.value,
              ),
            })
          }}
        />

        <div className="conversion-controls__range">
          <span>Smaller file</span>
          <span>Better quality</span>
        </div>
      </div>
    </section>
  )
}

export default ConversionControls