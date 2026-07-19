import { redirect } from 'next/navigation';

const AdminIndexPage = () => {
    redirect('/admin/announcements');
};

export default AdminIndexPage;
