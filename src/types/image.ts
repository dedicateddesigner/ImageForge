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
  conversionStatus: ConversionStatus
  convertedSize: number
  convertedUrl: string
  conversionError: string
}
