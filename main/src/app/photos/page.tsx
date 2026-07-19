import { getPhotos } from '@/utils/photos';
import PhotoGalleryClient from '@/components/PhotoGalleryClient';

export const dynamic = 'force-dynamic';

const Page = async () => {
    const photos = await getPhotos();

    return (
        <>
            <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Photos</h2>
                <PhotoGalleryClient photos={photos} />
            </section>
        </>
    );
};

export default Page;
