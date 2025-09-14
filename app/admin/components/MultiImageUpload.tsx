'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import styles from './MultiImageUpload.module.css'

interface MultiImageUploadProps {
  currentImages: string[]
  onImagesChange: (images: string[]) => void
  onError: (error: string) => void
  maxImages?: number
}

export default function MultiImageUpload({ 
  currentImages = [], 
  onImagesChange, 
  onError,
  maxImages = 3
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState<number | null>(null)
  const [previews, setPreviews] = useState<string[]>(
    Array.from({ length: maxImages }, (_, i) => currentImages[i] || '')
  )

  const processImage = useCallback(async (file: File, imageIndex: number) => {
    if (file.size > 2 * 1024 * 1024) {
      onError('Image size must be less than 2MB')
      return
    }

    setUploading(imageIndex)

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        
        setPreviews(prev => {
          const newPreviews = [...prev]
          newPreviews[imageIndex] = base64
          
          // Filter out empty strings and update parent
          const filteredImages = newPreviews.filter(img => img !== '')
          onImagesChange(filteredImages)
          
          return newPreviews
        })
        
        setUploading(null)
      }
      reader.onerror = () => {
        onError('Failed to read image file')
        setUploading(null)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing image:', error)
      onError('Failed to process image')
      setUploading(null)
    }
  }, [onImagesChange, onError])

  // Create dropzones and onDrop handlers at the top level for each image slot
  const dropzones = Array.from({ length: maxImages }, (_, imageIndex) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        processImage(file, imageIndex)
      }
    }, [imageIndex, processImage])

    return useDropzone({
      onDrop,
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
      },
      multiple: false,
      disabled: uploading === imageIndex
    })
  })

  const removeImage = (imageIndex: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev]
      newPreviews[imageIndex] = ''
      
      // Shift remaining images to fill gaps
      const filteredImages = newPreviews.filter(img => img !== '')
      const finalPreviews = Array.from({ length: maxImages }, (_, i) => filteredImages[i] || '')
      
      onImagesChange(filteredImages)
      return finalPreviews
    })
  }

  const renderImageSlot = (imageIndex: number) => {
    const preview = previews[imageIndex]
    const dropzone = dropzones[imageIndex]
    const isUploading = uploading === imageIndex
    const isRequired = imageIndex === 0
    const label = imageIndex === 0 ? 'Main Image *' : `Image ${imageIndex + 1}`

    return (
      <div key={imageIndex} className={styles.imageSlot}>
        <label className={styles.label}>{label}</label>
        {preview ? (
          <div className={styles.previewContainer}>
            <div className={styles.previewImage}>
              <Image
                src={preview}
                alt={`Product image ${imageIndex + 1}`}
                fill
                className={styles.previewImageInner}
              />
            </div>
            <div className={styles.buttonGroup}>
              <div {...dropzone.getRootProps()} className={styles.changeButton}>
                <input {...dropzone.getInputProps()} />
                <div className={styles.changeButtonInner}>
                  {isUploading ? 'Uploading...' : 'Change Image'}
                </div>
              </div>
              {!isRequired && (
                <button
                  type="button"
                  onClick={() => removeImage(imageIndex)}
                  className={styles.removeButton}
                  disabled={isUploading}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          <div {...dropzone.getRootProps()} className={`${styles.dropzone} ${
            dropzone.isDragActive ? styles.active : ''
          } ${isUploading ? styles.uploading : ''}`}>
            <input {...dropzone.getInputProps()} />
            <div className={styles.dropzoneContent}>
              <div className={`${styles.iconContainer} ${
                isUploading ? styles.uploading : dropzone.isDragActive ? styles.active : ''
              }`}>
                <i className={`fas ${isUploading ? 'fa-spinner' : dropzone.isDragActive ? 'fa-cloud-upload-alt' : 'fa-image'}`}></i>
              </div>
              <div className={styles.textContent}>
                <p className={styles.primary}>
                  {isUploading ? 'Processing...' : dropzone.isDragActive ? 'Drop the image here' : `Upload ${label}`}
                </p>
                <p className={styles.secondary}>
                  {isUploading ? 'Please wait...' : 'Drag & drop or click to select (PNG, JPG, GIF up to 2MB)'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.imagesGrid}>
        {Array.from({ length: maxImages }, (_, i) => renderImageSlot(i))}
      </div>
      <div className={styles.info}>
        <p className={styles.infoText}>
          Upload up to {maxImages} images. The first image will be used as the main product image.
        </p>
      </div>
    </div>
  )
}