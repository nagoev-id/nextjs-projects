'use client';

import { ChangeEvent, JSX, useCallback, useRef, useState } from 'react';
import { Button, Card, Checkbox, Form, FormField, FormItem, FormLabel, Input, Label } from '@/components/ui';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { ImagePlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { selectAuthData, useAppSelector, useUploadPhotoMutation } from '@/app/projects/hard/photo-gallery/redux';
import { FormInput } from '@/components/layout/form/form-input';
import { LogoutCard } from '@/app/projects/hard/photo-gallery/components';

interface FormValues extends Record<string, unknown> {
  description: string;
  isPrivate: boolean;
  imageFile: File | null;
}

type ImageFile = {
  previewUrl: string | null;
  file: File | null;
}

const NewPhotoPage = (): JSX.Element => {
  const { user } = useAppSelector(selectAuthData);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<ImageFile>({
    previewUrl: null,
    file: null,
  });
  const [uploadPhoto, { isLoading }] = useUploadPhotoMutation();

  const form = useForm<FormValues>({
    defaultValues: {
      description: '',
      isPrivate: false,
      imageFile: null,
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxSize = 5 * 1024 * 1024;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!file) {
      toast.error('No file selected');
      return;
    }

    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImageFile({ previewUrl, file });
    form.setValue('imageFile', file);

    return () => URL.revokeObjectURL(previewUrl);
  };

  const onSubmit = useCallback(async (formValues: FormValues) => {
    if (!imageFile.file) {
      toast.error('Please select an image to upload');
      return;
    }

    try {
      toast.loading('Uploading photo...');
      
      const result = await uploadPhoto({
        imageFile: imageFile.file,
        description: formValues.description,
        isPrivate: formValues.isPrivate,
        userId: user!.id,
      }).unwrap();

      toast.dismiss();
      toast.success('Photo uploaded successfully');
      
      // Очищаем форму и превью
      if (imageFile.previewUrl) {
        URL.revokeObjectURL(imageFile.previewUrl);
      }
      setImageFile({ previewUrl: null, file: null });
      form.reset();
      
      // Перенаправляем на страницу фотографий
      router.push('/projects/hard/photo-gallery/photos');
    } catch (error) {
      toast.dismiss();
      console.error('Failed to upload photo:', error);
      
      // Показываем более детальное сообщение об ошибке
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      toast.error(`Failed to upload photo: ${errorMessage}`);
    }
  }, [uploadPhoto, user, imageFile, form, router]);

  const handleCancelClick = useCallback(() => {
    if (imageFile.previewUrl) {
      URL.revokeObjectURL(imageFile.previewUrl);
    }
    setImageFile({ previewUrl: null, file: null });
    form.reset();
  }, [form]);

  const handleFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  return !user ?
    // Logged out
    (
      <LogoutCard
        title="Upload Photo"
        message="You need to be logged in to upload photos."
      />
    ) : (
      <div className="grid gap-4">
        <h2 className="text-lg font-bold">Upload New Photo</h2>
        {/* Form */}
        <Card className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
              {/* Upload Photo */}
              <div className="grid gap-2">
                <Label htmlFor="photo">Photo</Label>
                <div
                  className="border-2 border-dashed rounded-sm p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors dark:hover:bg-gray-800"
                  onClick={handleFileClick}
                >
                  <Input
                    ref={fileInputRef}
                    id="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {/* Preview */}
                  <div className="grid gap-2 place-items-center text-sm">
                    {imageFile.previewUrl ? (
                      <>
                        <Image
                          src={imageFile.previewUrl}
                          alt="Preview"
                          className="object-contain max-h-48 rounded w-full h-full"
                          width={200}
                          height={200}
                          unoptimized
                        />
                        <p>Click to change image</p>
                      </>
                    ) : (
                      <>
                        <ImagePlus height={50} width={50} />
                        <p>Click to upload a photo (JPEG, PNG, GIF, WebP)</p>
                        <p className="text-xs">Max file size: 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                {imageFile.file && (
                  <p className="text-xs">
                    File: {imageFile.file.name} ({(imageFile.file.size / 1024 / 1024).toFixed(2)}MB)
                    • {imageFile.file.type}
                  </p>
                )}
              </div>

              {/* Description */}
              <FormInput
                form={form}
                name="description"
                label="Description"
                type="textarea"
                placeholder="Add a description for your photo..."
                inputProps={{ required: true }}
              />
              {/* Is Private */}
              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="flex">
                    <Checkbox
                      id="isPrivate"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div className="flex gap-1.5 flex-wrap">
                      <FormLabel htmlFor="isPrivate">Private Photo</FormLabel>
                      <p className="text-xs">(Private photos are only visible to you)</p>
                    </div>
                  </FormItem>
                )}
              />
              {/* Submit */}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancelClick} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !imageFile.file}>
                  {isLoading ? 'Uploading...' : 'Upload Photo'}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    );
};

export default NewPhotoPage;