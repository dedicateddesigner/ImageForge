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