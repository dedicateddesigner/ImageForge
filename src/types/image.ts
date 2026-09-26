export type ConversionStatus = 'ready' | 'converting' | 'completed' | 'error'

export interface ImageFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  lastModified: number
  fingerprint: string
  previewUrl: string
  width: number
  height: number
  convertedWidth: number
  convertedHeight: number
  conversionStatus: ConversionStatus
  convertedSize: number
  convertedUrl: string
  conversionError: string
}

export type OutputFormat = 'webp' | 'avif'

export interface ConversionSettings {
  format: OutputFormat
  quality: number
  resize: ResizeSettings
}

export type ResizeMode = 'percentage' | 'width' | 'height'

export interface ResizeSettings {
  enabled: boolean
  mode: ResizeMode
  percentage: number
  width: number
  height: number
  maintainAspectRatio: boolean
}
