'use client';
import { JSX, useCallback } from 'react';
import { selectAuthData, useAppSelector, useDeleteUserMutation } from '@/app/projects/hard/photo-gallery/redux';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
} from '@/components/ui';
import { useRouter } from 'next/navigation';
import { CircleUserRound, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Компонент страницы профиля пользователя
 *
 * @description Отображает информацию о пользователе и предоставляет возможность удаления профиля
 * @returns {JSX.Element} Компонент страницы профиля
 */
const ProfilePage = (): JSX.Element => {
  const { user } = useAppSelector(selectAuthData);
  const router = useRouter();
  const [deleteUser, { isLoading: isDeleting, isSuccess }] = useDeleteUserMutation();

  /**
   * Обработчик удаления профиля пользователя
   */
  const handleDeleteProfile = useCallback(async () => {
    try {
      const result = await deleteUser().unwrap();

      if (result.success) {
        toast.success('All photos are deleted and exit from the system');
        router.push('/projects/hard/photo-gallery');
      } else {
        throw new Error('Failed to delete photos');
      }
    } catch (error) {
      console.error('Error when deleting data:', error);
      toast.error('Failed to delete photos');
    }
  }, [deleteUser, router]);

  return (
    <Card className="max-w-md w-full mx-auto p-4 gap-2">
      <div className="grid place-items-center gap-2">
        <CircleUserRound width={50} height={50} />
        <h2 className="text-lg font-bold">User profile</h2>
      </div>

      <div className="grid gap-2 text-sm">
        <div className="grid gap-1">
          <span className="font-bold">Email:</span>
          <span>{user?.email || 'Not specified'}</span>
        </div>
        <div className="grid gap-1">
          <span className="font-bold">Phone number:</span>
          <span>{user?.phone || 'Not specified'}</span>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete all photos and sign out
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are You Sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete all your photos and sign you out of the application.
              Your account will remain in the system, but all your photos will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProfile}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isSuccess || 'Processing...'}</span>
                </>
              ) : (
                'Delete Photos & Sign Out'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ProfilePage;