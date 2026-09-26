import type { ChangeEvent, Dispatch, SetStateAction } from 'react'

import type {
  ConversionSettings,
  OutputFormat,
  ResizeMode,
} from '../../types/image'

interface ConversionControlsProps {
  settings: ConversionSettings
  setSettings: Dispatch<SetStateAction<ConversionSettings>>
}

function ConversionControls({
  settings,
  setSettings,
}: ConversionControlsProps) {
  const handleFormatChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const format = event.target.value as OutputFormat

    setSettings((currentSettings) => ({
      ...currentSettings,
      format,
    }))
  }

  const handleResizeToggle = () => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      resize: {
        ...currentSettings.resize,
        enabled: !currentSettings.resize.enabled,
      },
    }))
  }

  const handleResizeModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const mode = event.target.value as ResizeMode

    setSettings((currentSettings) => ({
      ...currentSettings,
      resize: {
        ...currentSettings.resize,
        mode,
      },
    }))
  }

  const handlePercentageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const percentage = Number(event.target.value)

    setSettings((currentSettings) => ({
      ...currentSettings,
      resize: {
        ...currentSettings.resize,
        percentage,
      },
    }))
  }

  const handleWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const width = Number(event.target.value)

    setSettings((currentSettings) => ({
      ...currentSettings,
      resize: {
        ...currentSettings.resize,
        width,
      },
    }))
  }

  const handleHeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    const height = Number(event.target.value)

    setSettings((currentSettings) => ({
      ...currentSettings,
      resize: {
        ...currentSettings.resize,
        height,
      },
    }))
  }

  const handleAspectRatioChange = () => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      resize: {
        ...currentSettings.resize,
        maintainAspectRatio: !currentSettings.resize.maintainAspectRatio,
      },
    }))
  }

  const handleQualityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const quality = Number(event.target.value)

    setSettings((currentSettings) => ({
      ...currentSettings,
      quality,
    }))
  }

  return (
    <section className="conversion-controls">
      <div className="conversion-controls__header">
        <div>
          <p className="conversion-controls__eyebrow">Output settings</p>

          <h2>Conversion</h2>
        </div>
      </div>

      <div className="conversion-controls__group">
        <label className="conversion-controls__label" htmlFor="output-format">
          Format
        </label>

        <select
          id="output-format"
          className="conversion-controls__select"
          value={settings.format}
          onChange={handleFormatChange}
        >
          <option value="webp">WebP</option>

          <option value="avif">AVIF</option>
        </select>
      </div>

      <div className="conversion-controls__divider" />

      <div className="conversion-controls__section">
        <div className="conversion-controls__section-header">
          <div>
            <h3>Resize</h3>

            <p>Change the output dimensions before conversion.</p>
          </div>

          <label className="conversion-controls__switch">
            <input
              type="checkbox"
              checked={settings.resize.enabled}
              onChange={handleResizeToggle}
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
                onChange={handleResizeModeChange}
              >
                <option value="percentage">Percentage</option>

                <option value="width">Width</option>

                <option value="height">Height</option>
              </select>
            </div>

            {settings.resize.mode === 'percentage' && (
              <div className="conversion-controls__field">
                <label
                  htmlFor="resize-percentage"
                  className="conversion-controls__label"
                >
                  Scale
                </label>

                <div className="conversion-controls__input-wrapper">
                  <input
                    id="resize-percentage"
                    className="conversion-controls__input"
                    type="number"
                    min="1"
                    max="400"
                    step="1"
                    value={settings.resize.percentage}
                    onChange={handlePercentageChange}
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

                <div className="conversion-controls__input-wrapper">
                  <input
                    id="resize-width"
                    className="conversion-controls__input"
                    type="number"
                    min="1"
                    value={settings.resize.width}
                    onChange={handleWidthChange}
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

                <div className="conversion-controls__input-wrapper">
                  <input
                    id="resize-height"
                    className="conversion-controls__input"
                    type="number"
                    min="1"
                    value={settings.resize.height}
                    onChange={handleHeightChange}
                  />

                  <span>px</span>
                </div>
              </div>
            )}

            {settings.resize.mode !== 'percentage' && (
              <label className="conversion-controls__checkbox">
                <input
                  type="checkbox"
                  checked={settings.resize.maintainAspectRatio}
                  onChange={handleAspectRatioChange}
                />

                <span>Maintain aspect ratio</span>
              </label>
            )}
          </div>
        )}
      </div>

      <div className="conversion-controls__divider" />

      <div className="conversion-controls__section">
        <div className="conversion-controls__section-header">
          <div>
            <h3>{settings.format.toUpperCase()} quality</h3>

            <p>Balance image quality and file size.</p>
          </div>

          <strong className="conversion-controls__quality-value">
            {settings.quality}
          </strong>
        </div>

        <input
          className="conversion-controls__range"
          type="range"
          min="1"
          max="100"
          step="1"
          value={settings.quality}
          onChange={handleQualityChange}
          aria-label={`${settings.format.toUpperCase()} quality`}
        />

        <div className="conversion-controls__range-labels">
          <span>Smaller file</span>

          <span>Higher quality</span>
        </div>
      </div>
    </section>
  )
}

export default ConversionControls
