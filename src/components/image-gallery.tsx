'use client';

import { useState } from 'react';
import { X, Edit2, Download, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { ProjectImage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: ProjectImage[];
  onDelete?: (imageId: string) => void;
  onUpdateCaption?: (imageId: string, caption: string) => void;
  className?: string;
}

export function ImageGallery({
  images,
  onDelete,
  onUpdateCaption,
  className,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionText, setCaptionText] = useState('');

  const handleEditCaption = (image: ProjectImage) => {
    setEditingCaption(image.id);
    setCaptionText(image.caption || '');
  };

  const handleSaveCaption = (imageId: string) => {
    onUpdateCaption?.(imageId, captionText);
    setEditingCaption(null);
    setCaptionText('');
  };

  const handleCancelEdit = () => {
    setEditingCaption(null);
    setCaptionText('');
  };

  const handleDownload = (image: ProjectImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.url.split('/').pop() || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        No images uploaded yet
      </div>
    );
  }

  return (
    <>
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4', className)}>
        {images.map((image) => (
          <div key={image.id} className="group relative border rounded-lg overflow-hidden">
            <div
              className="aspect-square cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.url}
                alt={image.alt || 'Project image'}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(image);
                }}
                className="bg-white text-black rounded-full p-2 mr-2"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              {onUpdateCaption && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCaption(image);
                  }}
                  className="bg-white text-black rounded-full p-2 mr-2"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(image);
                }}
                className="bg-white text-black rounded-full p-2 mr-2"
              >
                <Download className="h-4 w-4" />
              </button>
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(image.id);
                  }}
                  className="bg-red-500 text-white rounded-full p-2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {image.caption && !editingCaption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Caption Editing Modal */}
      {editingCaption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Image Caption</h3>
            <textarea
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={3}
              placeholder="Add a caption for this image..."
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveCaption(editingCaption)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Size Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt || 'Project image'}
              width={selectedImage.width || 800}
              height={selectedImage.height || 600}
              className="max-w-full max-h-full object-contain"
            />
            {selectedImage.caption && (
              <figcaption className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-center p-4">
                {selectedImage.caption}
              </figcaption>
            )}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-black rounded-full p-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}