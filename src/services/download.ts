import { isTauri } from '@tauri-apps/api/core'
import { save } from '@tauri-apps/plugin-dialog'
import { writeFile } from '@tauri-apps/plugin-fs'

export async function saveFile(
    blob: Blob,
    filename: string,
): Promise<void> {
    if (isTauri()) {
        const extension = filename.split('.').pop()?.toLowerCase() || 'bin'

        const filePath = await save({
            title: 'Save ImageForge File',
            defaultPath: filename,
            filters: [
                {
                    name: extension.toUpperCase(),
                    extensions: [extension],
                },
            ],
        })

        if (!filePath) {
            return
        }

        await writeFile(filePath, blob.stream())

        return
    }

    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = downloadUrl
    link.download = filename

    document.body.appendChild(link)
    link.click()
    link.remove()

    window.setTimeout(() => {
        URL.revokeObjectURL(downloadUrl)
    }, 1000)
}
