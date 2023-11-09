import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import sharp, { FitEnum } from 'sharp'

const cacheDir = './.cache'
const cacheHeaders = { 'Cache-Control': 'public, max-age=86400, immutable' }

function generateFilename(url: string, params: { [key: string]: any }) {
  const hash = new Bun.CryptoHasher('md5').update(url + JSON.stringify(params)).digest('hex')
  return `${hash}.${params.format}`
}

if (!existsSync(cacheDir)) {
  mkdirSync(cacheDir)
}

Bun.serve({
  port: process.env.PORT || 3000,

  async fetch(req) {
    const url = new URL(req.url)

    const secret = url.searchParams.get('secret')
    if (secret !== process.env.SECRET) {
      return new Response('Unauthorized', { status: 401 })
    }

    if (url.pathname === '/') {
      const imageUrl = url.searchParams.get('url')
      let width = url.searchParams.get('w')
      let height = url.searchParams.get('h')
      let quality = url.searchParams.get('q')
      let format = url.searchParams.get('format')
      let fit = url.searchParams.get('fit')

      if (!imageUrl) {
        return new Response('Image URL is required')
      }

      if (!width) {
        width = '100'
      }
      if (!height) {
        height = '100'
      }

      if (!format) {
        format = 'webp'
      }

      if (!quality) {
        quality = '80'
      }

      if (!fit) {
        fit = 'cover'
      }

      const parsedImageUrl = decodeURIComponent(imageUrl)
      const filename = generateFilename(parsedImageUrl, { quality, height, width, format, fit })
      const filePath = path.join(cacheDir, filename)

      try {
        if (existsSync(filePath)) {
          return new Response(Bun.file(filePath), { headers: cacheHeaders })
        }

        const response = await fetch(parsedImageUrl)
        const buffer = await response.arrayBuffer()

        const img = await sharp(buffer)
          .resize(+width || null, +height || null, { fit: fit as keyof FitEnum })
          .toFormat(format as keyof sharp.FormatEnum, { quality: +quality })
          .toFile(filePath)
          .catch((err) => {
            console.error('Error processing image:', err)
            return null
          })

        if (img) {
          return new Response(Bun.file(filePath), { headers: cacheHeaders })
        } else {
          return new Response('Error processing image')
        }
      } catch (error) {
        console.error('Error processing image:', error)
        return new Response('Error processing image')
      }
    }

    return new Response('404')
  }
})
