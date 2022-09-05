export const blobUrlToBase64 = async(blobUrl: string) => {
    const reader = new FileReader()
    try {
        const response = await fetch(blobUrl)
        const blob = await response.blob()
        console.log(blob)
        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort()
                reject(new DOMException('Problem parsing input file.'))
            }
            reader.onload = () => {
                resolve(reader.result)
            }
            reader.readAsDataURL(blob)
        })
    } catch (error) {
        console.log(error)
    }
}

export const base64ToBlob = (base64: string) => {
    require('buffer').Buffer
    const bytes = Buffer.from(base64, 'base64')
    return new Blob([bytes], { type: 'audio/ogg' })
}

export const blobUrlToObject = async(blobUrl: string) => {
        const reader = new FileReader()
        try {
            const response = await fetch(blobUrl)
            return await response.blob()
            
        } catch (error) {
            console.log(error)
        }
    }