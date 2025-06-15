'use client';

import { JSX, useCallback, useState } from 'react';
import { Button } from '@/components/ui';
import { useGetAllPhotosQuery } from '@/app/projects/hard/photo-gallery/redux';
import { EmptyPhotos, ErrorCard, LoadingCard, PhotoList } from '@/app/projects/hard/photo-gallery/components';


const HomePage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetAllPhotosQuery({ page, limit: 9 });

  const handlePrevPage = useCallback(() => {
    if (data?.pagination?.hasPrevPage) {
      setPage(prev => prev - 1);
    }
  }, [data?.pagination?.hasPrevPage]);

  const handleNextPage = useCallback(() => {
    if (data?.pagination?.hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [data?.pagination?.hasNextPage]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-4 min-h-full h-full">
      <h2 className="text-xl font-bold">Discover Photos</h2>

      {isLoading && <LoadingCard />}

      {error && (
        <ErrorCard>
          <Button onClick={handleRetry}>Retry</Button>
        </ErrorCard>
      )}

      {!isLoading && !error && data?.photos?.length === 0 && <EmptyPhotos />}

      {!isLoading && !error && data?.photos && data.photos.length > 0 && (
        <div className="grid grid-rows-[1fr_auto] gap-4 h-full">
          {/* Display the list of photos */}
          <div className="overflow-y-auto">
            <PhotoList photos={data.photos} isDeleting={false} showUser={true} isPrivate={false} />
          </div>

          {/* Pagination controls */}
          {data?.pagination && (data.pagination.hasPrevPage || data.pagination.hasNextPage) && (
            <div className="flex justify-between items-center mt-auto border-t pt-4">
              <p className="text-sm">Page {data.pagination.currentPage} of {data.pagination.totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={!data.pagination.hasPrevPage}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!data.pagination.hasNextPage}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
