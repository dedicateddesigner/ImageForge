import type { ImageFile } from '../types/image'

export function createFileFingerprint(file: File) {
  return [
    file.name.toLowerCase(),
    file.size,
    file.lastModified,
  ].join('|')
}

export function isDuplicateFile(
  file: File,
  existingFiles: File[],
) {
  const fingerprint = createFileFingerprint(file)

  return existingFiles.some(
    (existingFile) =>
      createFileFingerprint(existingFile) === fingerprint,
  )
}

export function createImageFile(file: File): ImageFile {
  return {
    id: crypto.randomUUID(),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    fingerprint: createFileFingerprint(file),
    previewUrl: URL.createObjectURL(file),
  }
}