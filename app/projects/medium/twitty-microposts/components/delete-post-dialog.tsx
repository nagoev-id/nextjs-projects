'use client';

import { IoMdClose } from 'react-icons/io';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { JSX, useCallback } from 'react';
import { useDeleteMutation } from '@/app/projects/medium/twitty-microposts/features';
import { toast } from 'sonner';

/**
 * Интерфейс пропсов для компонента DeletePostDialog.
 * @interface
 */
interface DeletePostDialog {
  /** Идентификатор поста для удаления */
  postId: string;
}

/**
 * Компонент диалогового окна для удаления поста.
 * 
 * @type {React.FC<DeletePostDialog>}
 * @param {Object} props - Пропсы компонента
 * @param {string} props.postId - Идентификатор поста для удаления
 * @returns {JSX.Element} Отрендеренный компонент диалогового окна удаления
 * 
 * @description
 * Этот компонент использует AlertDialog для подтверждения удаления поста
 * и RTK Query хук useDeleteMutation для выполнения операции удаления.
 */
const DeletePostDialog = ({ postId }: DeletePostDialog): JSX.Element => {
  /** Хук для удаления поста */
  const [deletePost] = useDeleteMutation();

  /**
   * Обработчик удаления поста.
   * Вызывает мутацию удаления и отображает уведомление о результате.
   */
  const handleDeletePost = useCallback(async () => {
    try {
      const response = await deletePost(postId);
      console.log(response);
      toast.success('Post deleted successfully', {
        description: 'Your post has been successfully deleted.',
        richColors: true,
      });
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Failed to delete post', {
        richColors: true,
      });
    }
  }, [deletePost, postId]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <IoMdClose />
          <span>Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeletePost}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePostDialog;