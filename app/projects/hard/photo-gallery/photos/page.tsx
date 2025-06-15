'use client';

import { JSX, useCallback } from 'react';
import { toast } from 'sonner';
import {
  selectAuthData,
  useAppSelector,
  useDeletePhotoMutation,
  useGetPhotosQuery,
} from '@/app/projects/hard/photo-gallery/redux';
import {
  EmptyPhotos,
  ErrorCard,
  LoadingCard,
  LogoutCard,
  PhotoList,
  Topline,
} from '@/app/projects/hard/photo-gallery/components';

/*
  * PhotosPage component displays a user's photos with options to delete them.
 */
const PhotosPage = (): JSX.Element => {
  const { user } = useAppSelector(selectAuthData);
  const { data: photos, isLoading, error } = useGetPhotosQuery(user?.id || '', { skip: !user });
  const [deletePhoto, { isLoading: isDeleting }] = useDeletePhotoMutation();

  const handleDeleteClick = useCallback(async (photoId: string | number, url: string) => {
    if (!user || !photoId) return;

    try {
      await deletePhoto({ photoId, userId: user?.id, url }).unwrap();
      toast.success('Photo deleted successfully');
    } catch (error) {
      console.error('Failed to delete photo:', error);
      toast.error('Failed to delete photo. Please try again.');
    }
  }, [user, deletePhoto]);

  return !user ?
    // Login message
    (
      <LogoutCard
        title="My Photos"
        message="You need to be logged in to view your photos."
      />
    )
    : (
      <div className="grid grid-rows-[auto_1fr] gap-4 min-h-full h-full">
        {/* Page Topline block */}
        <Topline
          title="My Photos"
          hasButton={true}
          buttonText="Upload New Photo"
          buttonLink="/projects/hard/photo-gallery/photos/new"
        />

        {/* Loading */}
        {isLoading && <LoadingCard />}

        {/* Error */}
        {error && <ErrorCard />}

        {/* Empty photos */}
        {!isLoading && !error && photos && photos.length === 0 && (
          <EmptyPhotos
            text={`You haven't uploaded any photos yet.`}
            hasButton={true}
            buttonLink="/projects/hard/photo-gallery/photos/new"
            buttonText="Upload New Photo"
          />
        )}

        {/* Photos list */}
        {!isLoading && !error && photos && photos.length > 0 && (
          <div className="overflow-y-auto h-full">
            <PhotoList
              photos={photos}
              isDeleting={true}
              isLoading={isDeleting}
              onDeleteClick={handleDeleteClick}
              isPrivate={true}
            />
          </div>
        )}
      </div>
    );
};

export default PhotosPage;