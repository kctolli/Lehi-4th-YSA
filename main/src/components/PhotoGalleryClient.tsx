'use client';

import dynamic from 'next/dynamic';
import { Photo } from '@/utils/photos';

const PhotoGallery = dynamic(() => import('@/components/PhotoGallery'), { ssr: false });

const PhotoGalleryClient = ({ photos }: { photos: Photo[] }) => <PhotoGallery photos={photos} />;

export default PhotoGalleryClient;
