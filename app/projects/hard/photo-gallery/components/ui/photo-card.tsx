'use client';

import { Badge, Button, Card } from '@/components/ui';
import { SafeImage } from '@/app/projects/hard/photo-gallery/components';
import { Trash2 } from 'lucide-react';
import { Photo } from '@/app/projects/hard/photo-gallery/redux';
import Link from 'next/link';

interface ImageCardProps {
  photo: Photo;
  index: number;
  isDeleting?: boolean;
  onDeleteClick?: (photoId: string | number, photoUrl: string) => void;
  showUser?: boolean;
  isPrivate?: boolean;
  isLoading?: boolean;
}

const PhotoCard = ({ photo, index, isDeleting, onDeleteClick, showUser, isPrivate, isLoading }: ImageCardProps) => {
  return (
    <Card key={photo.id} className="overflow-hidden rounded-sm p-0 gap-0 dark:bg-card">
      {/* Image */}
      <div className="relative h-48 w-full">
        <SafeImage
          src={photo.url}
          alt={photo.description}
          className="object-cover w-full h-full"
          priority={index === 0}
        />
        {photo.is_private && <Badge className="absolute top-2 right-2">Private</Badge>}
      </div>
      {/* Description and Actions */}
      <div className="grid gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          {/* Date */}
          <Badge variant="outline">{new Date(photo.created_at || '').toLocaleDateString()}</Badge>
          {/* Visibility Badge */}
          {isPrivate && (
            <Badge variant={photo.is_private ? 'default' : 'outline'}>
              {photo.is_private ? 'Not visible in Discover' : 'Visible in Discover'}
            </Badge>
          )}
          {showUser && photo.user_id && (
            <Link
              href={`/projects/hard/photo-gallery/profile/${photo.user_id}`}
              className="text-sm font-medium hover:underline"
            >
              {photo.user?.email ? photo.user.email.split('@')[0] : `User ${photo.user_id.substring(0, 6)}`}
            </Link>
          )}
        </div>
        {/* Description */}
        <p className="text-sm">{photo.description}</p>
        {/* Actions */}
        {isDeleting && (
          <Button
            className="max-w-max ml-auto"
            variant="destructive"
            size="sm"
            onClick={() => onDeleteClick ? onDeleteClick(photo.id!, photo.url) : null}
            disabled={isLoading}
          >
            <Trash2 />
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PhotoCard;