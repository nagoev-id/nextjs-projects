'use client';

import { JSX, use, useMemo } from 'react';
import { Card } from '@/components/ui';
import {
  selectAuthData,
  useAppSelector,
  useGetPhotosQuery,
  useGetUserByIdQuery,
} from '@/app/projects/hard/chat/redux';
import {
  EmptyPhotos,
  ErrorCard,
  LoadingCard,
  LogoutCard,
  PhotoList,
  Topline,
} from '@/app/projects/hard/chat/components';
import { CircleUserRound } from 'lucide-react';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

const ProfilePage = ({ params }: ProfilePageProps): JSX.Element => {
  const { id: userId } = use(params);
  const { user } = useAppSelector(selectAuthData);
  const {
    data: profileUser,
    isLoading: isLoadingUser,
    error: userError,
  } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });
  const { data: photos, isLoading, error } = useGetPhotosQuery(userId, {
    skip: !userId,
  });

  const visiblePhotos = useMemo(() => photos?.filter(photo => {
    if (user?.id === userId) return true;
    return !photo.is_private;
  }), [photos, user, userId]);

  if (isLoadingUser) {
    return <LoadingCard />;
  }

  if (userError || !profileUser) {
    return <LogoutCard
      title="User Not Found"
      message={userError ? 'Failed to load user profile' : 'This user profile does not exist.'}
      url="/projects/hard/chat"
      pageTitle="Discover"
    />;
  }

  return (
    <div className="grid grid-rows-[auto_auto_1fr] gap-4 min-h-full h-full">
      <Card className="p-4 gap-1">
        <CircleUserRound width={50} height={50} />
        <h2 className="text-xl font-bold">
          {profileUser.email ? profileUser.email.split('@')[0] : `User ${profileUser.id.substring(0, 6)}`}
        </h2>
        <p className="text-sm">
          {user?.id === userId ? 'This is your profile' : 'Viewing public photos'}
        </p>
      </Card>

      <Topline
        title={user?.id === userId ? 'My Photos' : 'Photos'}
        hasButton={user?.id === userId}
        buttonText="Upload New Photo"
        buttonLink="/projects/hard/chat/photos/new"
      />

      {isLoading && <LoadingCard />}

      {error && <ErrorCard />}

      {!isLoading && !error && (!visiblePhotos || visiblePhotos.length === 0) && (
        <EmptyPhotos
          hasButton={user?.id === userId}
          buttonText="Upload Your First Photo"
          buttonLink="/projects/hard/chat/photos/new"
        />
      )}

      {!isLoading && !error && visiblePhotos && visiblePhotos.length > 0 && (
        <div className="overflow-y-auto h-full">
          <PhotoList photos={visiblePhotos} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 