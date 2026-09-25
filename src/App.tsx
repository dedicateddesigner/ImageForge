import { useState } from 'react'
import Header from './components/Header/Header'
import Dropzone from './components/Dropzone/Dropzone'
import { isDuplicateFile } from './services/file-utils'

function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [duplicateCount, setDuplicateCount] = useState(0)

  const handleFilesSelected = (newFiles: File[]) => {

    const filesToCheck = [...selectedFiles]

    const uniqueFiles = newFiles.filter((newFile) => {
      const isDuplicate = isDuplicateFile(newFile, filesToCheck)

      if (!isDuplicate) {
        filesToCheck.push(newFile)
      }

      return !isDuplicate
    })

    const duplicates = newFiles.length - uniqueFiles.length

    setDuplicateCount(duplicates)

    setSelectedFiles((currentFiles) => [
      ...currentFiles,
      ...uniqueFiles,
    ])
  }

  return (
    <>
      <Header />

      <main>
        <section className="app-intro">
          <div className="app-intro__container">
            <p className="app-intro__eyebrow">
              Local image optimization
            </p>

            <h1>Convert your images.</h1>

            <p>
              Convert JPG, PNG, WebP and AVIF images locally,
              without uploading them to a server.
            </p>
          </div>
        </section>

        <Dropzone onFilesSelected={handleFilesSelected} />

        {selectedFiles.length > 0 && (
          <section className="file-summary">
            <div className="file-summary__container">
              <strong>{selectedFiles.length}</strong>{' '}
              {selectedFiles.length === 1 ? 'image' : 'images'} ready

              {duplicateCount > 0 && (
                <>
                  {' · '}
                  <strong>{duplicateCount}</strong>{' '}
                  {duplicateCount === 1
                    ? 'duplicate'
                    : 'duplicates'}{' '}
                  skipped
                </>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  )
}

export default App