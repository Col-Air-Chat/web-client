export class clipboard {
    constructor() { }

    async copy(text: string): Promise<void> {
        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            console.error("can't copy the text.", err)
        }
    }

    async paste(): Promise<string> {
        try {
            return await navigator.clipboard.readText()
        } catch (err) {
            console.error("can't paste the text.", err)
            return ''
        }
    }

    async downloadFile(filename: string, content: string): Promise<void> {
        try {
            const blob = new Blob([content], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            a.click()
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error("can't download the file.", err)
        }
    }

    async downloadImage(filename: string, url: string): Promise<void> {
        try {
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            a.click()
        } catch (err) {
            console.error("can't download the image.", err)
        }
    }
}