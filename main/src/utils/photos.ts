import { list } from '@vercel/blob';

export interface Photo {
    url: string;
    pathname: string;
    uploadedAt: string;
    size: number;
}

export const getPhotos = async (): Promise<Photo[]> => {
    const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });

    return blobs.map(({ url, pathname, uploadedAt, size }) => ({ url, pathname, uploadedAt: uploadedAt.toISOString(), size })).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
};
