import type { ResizeSettings } from '../types/image'

export function calculateResizeDimensions(
    originalWidth: number,
    originalHeight: number,
    settings: ResizeSettings,
) {
    if (!settings.enabled) {
        return {
            width: originalWidth,
            height: originalHeight,
        }
    }

    if (settings.mode === 'percentage') {
        return {
            width: Math.round(
                originalWidth * (settings.percentage / 100),
            ),
            height: Math.round(
                originalHeight * (settings.percentage / 100),
            ),
        }
    }

    if (
        settings.mode === 'width' &&
        settings.maintainAspectRatio
    ) {
        const width = settings.width

        return {
            width,
            height: Math.round(
                originalHeight * (width / originalWidth),
            ),
        }
    }

    if (
        settings.mode === 'height' &&
        settings.maintainAspectRatio
    ) {
        const height = settings.height

        return {
            width: Math.round(
                originalWidth * (height / originalHeight),
            ),
            height,
        }
    }

    return {
        width: originalWidth,
        height: originalHeight,
    }
}

