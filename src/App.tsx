import { useState } from 'react'
import Header from './components/Header/Header'
import Dropzone from './components/Dropzone/Dropzone'

function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  return (
    <>
      <Header />

      <main>
        <section className="app-intro">
          <div className="app-intro__container">
            <p className="app-intro__eyebrow">Local image optimization</p>

            <h1>Convert your images.</h1>

            <p>
              Convert JPG, PNG, WebP and AVIF images locally, without uploading
              them to a server.
            </p>
          </div>
        </section>

        <Dropzone
          onFilesSelected={(newFiles) => {
            setSelectedFiles((currentFiles) => [...currentFiles, ...newFiles])
          }}
        />

        {selectedFiles.length > 0 && (
          <section className="file-summary">
            <div className="file-summary__container">
              <strong>{selectedFiles.length}</strong>{' '}
              {selectedFiles.length === 1 ? 'image' : 'images'} ready
            </div>
          </section>
        )}
      </main>
    </>
  )
}

export default App
