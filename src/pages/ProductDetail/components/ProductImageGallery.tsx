import { useRef, useState, useMemo } from 'react'
import { Product as ProductType } from '@/types/product.type'

interface ProductImageGalleryProps {
  product: ProductType
  activeImage: string
  setActiveImage: (image: string) => void
}

export default function ProductImageGallery({ product, activeImage, setActiveImage }: ProductImageGalleryProps) {
  const [currentIndexImage, setCurrentIndexImage] = useState([0, 5])
  const imageRef = useRef<HTMLImageElement>(null)

  const currentImages = useMemo(() => product.images.slice(...currentIndexImage), [product.images, currentIndexImage])

  const next = () => {
    if (currentIndexImage[1] < product.images.length) {
      setCurrentIndexImage((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prev = () => {
    if (currentIndexImage[0] > 0) {
      setCurrentIndexImage((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { offsetX, offsetY } = e.nativeEvent
    const originX = (offsetX / rect.width) * 100
    const originY = (offsetY / rect.height) * 100

    image.style.transformOrigin = `${originX}% ${originY}%`
    image.style.transform = 'scale(1.6)'
  }

  const handleRemoveZoom = () => {
    const image = imageRef.current
    image?.style.removeProperty('transform')
    image?.style.removeProperty('transform-origin')
  }

  return (
    <>
      <div
        className='relative w-full cursor-zoom-in overflow-hidden rounded-sm pt-[100%] shadow'
        onMouseMove={handleZoom}
        onMouseLeave={handleRemoveZoom}
      >
        <img
          src={activeImage}
          alt={product.name}
          className='absolute left-0 top-0 h-full w-full bg-white object-cover pointer-events-none'
          style={{ willChange: 'transform' }}
          ref={imageRef}
        />
      </div>
      <div className='relative mt-3 grid grid-cols-4 gap-1 md:mt-4 md:gap-2 sm:grid-cols-5'>
        <button
          className='absolute left-0 top-1/2 z-10 h-7 w-4 -translate-y-1/2 rounded-sm bg-black/20 text-white transition hover:bg-black/40 md:h-9 md:w-5'
          onClick={prev}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='mx-auto h-4 w-4 md:h-5 md:w-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
          </svg>
        </button>

        {currentImages.map((image) => {
          const isActive = image === activeImage
          return (
            <div
              className='relative w-full cursor-pointer pt-[100%]'
              key={image}
              onMouseEnter={() => setActiveImage(image)}
            >
              <img
                src={image}
                alt={product.name}
                className='absolute left-0 top-0 h-full w-full cursor-pointer rounded-sm bg-white object-cover transition hover:opacity-80'
              />
              {isActive && <div className='absolute inset-0 rounded-sm border-2 border-orange' />}
            </div>
          )
        })}

        <button
          className='absolute right-0 top-1/2 z-10 h-7 w-4 -translate-y-1/2 rounded-sm bg-black/20 text-white transition hover:bg-black/40 md:h-9 md:w-5'
          onClick={next}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='mx-auto h-4 w-4 md:h-5 md:w-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
          </svg>
        </button>
      </div>
    </>
  )
}
