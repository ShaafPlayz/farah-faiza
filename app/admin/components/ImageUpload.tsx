'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

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
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Product Image *
      </label>
      
      {preview ? (
        <div className="space-y-4">
          <div className="relative w-full h-64 border rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="Product preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2">
            <div
              {...getRootProps()}
              className="flex-1 cursor-pointer"
            >
              <input {...getInputProps()} />
              <button
                type="button"
                disabled={uploading}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {uploading ? 'Processing...' : 'Change Image'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={uploading}
              className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-secondary bg-secondary/10'
              : uploading
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 hover:border-secondary hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <i className={`fas text-4xl ${uploading ? 'fa-spinner fa-spin' : isDragActive ? 'fa-cloud-upload-alt text-secondary' : 'fa-image'}`}></i>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {uploading ? 'Processing...' : isDragActive ? 'Drop the image here' : 'Upload product image'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {uploading ? 'Please wait...' : 'Drag & drop or click to select (PNG, JPG, GIF up to 2MB)'}
              </p>
            </div>
            {!uploading && !isDragActive && (
              <button
                type="button"
                className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary hover:text-black transition-colors"
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