import axios from 'axios';

export interface Announcement {
    id: number;
    title: string;
    body: string;
    posted_at: string;
}

export const getAnnouncements = async (): Promise<Announcement[]> => {
    const { data } = await axios.get<Announcement[]>('/api/announcements');
    return Array.isArray(data) ? data : [];
};
