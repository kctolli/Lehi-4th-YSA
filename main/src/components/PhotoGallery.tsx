'use client';

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Photo } from '@/utils/photos';

const PhotoGallery = ({ photos }: { photos: Photo[] }) => (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry gutter="8px">
            {photos.map((photo) => (
                <img key={photo.pathname} src={photo.url} alt="" className="w-full rounded-lg" />
            ))}
        </Masonry>
    </ResponsiveMasonry>
);

export default PhotoGallery;
