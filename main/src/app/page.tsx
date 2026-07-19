'use client';

import { useQuery } from '@tanstack/react-query';
import { getAnnouncements } from '@/utils/announcements';

import Header from '@/components/Header';

const Page = () => {
    const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: getAnnouncements });
    
    return (
        <>
            <Header />
            <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Announcements</h2>
                {announcements?.map((announcement) => (
                    <article key={announcement.id} className="rounded-lg border p-4">
                        <h3 className="font-medium">{announcement.title}</h3>
                        <p>{announcement.body}</p>
                    </article>
                ))}
            </section>
        </>
    );
};

export default Page;
