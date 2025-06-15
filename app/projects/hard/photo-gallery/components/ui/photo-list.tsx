'use client';

import { PhotoCard } from '@/app/projects/hard/photo-gallery/components';
import { Photo } from '@/app/projects/hard/photo-gallery/redux';

interface PhotoListProps {
  photos: Photo[];
  isDeleting?: boolean;
  onDeleteClick?: (id: number | string, url: string) => void;
  showUser?: boolean;
  isPrivate?: boolean;
  isLoading?: boolean;
}

const PhotoList = ({ photos, isDeleting, onDeleteClick, showUser, isPrivate, isLoading }: PhotoListProps) => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 pb-2 w-full">
      {photos.map((photo: Photo, index: number) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          index={index}
          isDeleting={isDeleting}
          onDeleteClick={onDeleteClick}
          showUser={showUser}
          isPrivate={isPrivate}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default PhotoList;