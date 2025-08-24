'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import styles from './ImageUpload.module.css'

interface ImageUploadProps {
  currentImageData?: string
  onImageChange: (imageData: string) => void
  onError: (error: string) => void
}

export default function ImageUpload({ currentImageData, onImageChange, onError }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageData || null)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file size (max 2MB for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      onError('Image size must be less than 2MB')
      return
    }

    setUploading(true)

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setPreview(base64)
        onImageChange(base64)
        setUploading(false)
      }
      reader.onerror = () => {
        onError('Failed to read image file')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing image:', error)
      onError('Failed to process image')
      setUploading(false)
    }
  }, [onImageChange, onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    disabled: uploading
  })

  const handleRemoveImage = () => {
    setPreview(null)
    onImageChange('')
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        Product Image *
      </label>
      
      {preview ? (
        <div className={styles.previewContainer}>
          <div className={styles.previewImage}>
            <Image
              src={preview}
              alt="Product preview"
              fill
              className={styles.previewImageInner}
            />
          </div>
          <div className={styles.buttonGroup}>
            <div
              {...getRootProps()}
              className={styles.changeButton}
            >
              <input {...getInputProps()} />
              <button
                type="button"
                disabled={uploading}
                className={styles.changeButtonInner}
              >
                {uploading ? 'Processing...' : 'Change Image'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={uploading}
              className={styles.removeButton}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`${styles.dropzone} ${
            isDragActive
              ? styles.active
              : uploading
              ? styles.uploading
              : styles.inactive
          }`}
        >
          <input {...getInputProps()} />
          <div className={styles.dropzoneContent}>
            <div className={`${styles.iconContainer} ${
              uploading ? styles.uploading : isDragActive ? styles.active : ''
            }`}>
              <i className={`fas ${uploading ? 'fa-spinner' : isDragActive ? 'fa-cloud-upload-alt' : 'fa-image'}`}></i>
            </div>
            <div className={styles.textContent}>
              <p className={styles.primary}>
                {uploading ? 'Processing...' : isDragActive ? 'Drop the image here' : 'Upload product image'}
              </p>
              <p className={styles.secondary}>
                {uploading ? 'Please wait...' : 'Drag & drop or click to select (PNG, JPG, GIF up to 2MB)'}
              </p>
            </div>
            {!uploading && !isDragActive && (
              <button
                type="button"
                className={styles.chooseButton}
              >
                Choose Image
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}