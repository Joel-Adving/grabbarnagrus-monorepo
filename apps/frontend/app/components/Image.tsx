import { LazyLoadImage, type LazyLoadImageProps } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

export default function Image({
  width,
  height,
  src,
  fit,
  format,
  quality,
  IMAGE_PROXY,
  IMAGE_PROXY_SECRET,
  ...props
}: LazyLoadImageProps & {
  width: number
  height: number
  src: string
  fit?: 'cover' | 'contain' | 'fill'
  format?: 'webp' | 'png' | 'jpg'
  quality?: number
  IMAGE_PROXY: string
  IMAGE_PROXY_SECRET: string
}) {
  const url = new URL(IMAGE_PROXY)
  url.searchParams.append('w', width.toString())
  url.searchParams.append('h', height.toString())
  url.searchParams.append('url', encodeURIComponent(src))
  if (fit) url.searchParams.append('fit', fit)
  if (format) url.searchParams.append('format', format)
  if (quality) url.searchParams.append('quality', quality.toString())
  url.searchParams.append('secret', IMAGE_PROXY_SECRET)
  return <LazyLoadImage {...props} width={width} height={height} src={url.toString()} />
}
