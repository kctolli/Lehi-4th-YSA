'use client';

import { Button } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';

const SHARED_FILES_URL = 'https://drive.google.com/drive/folders/1hs90-TteVioTJq1_0l8pNIO664W7qpqR?usp=sharing';

const SharedFilesPage = () => (
    <section className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Shared Files</h1>

        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <FolderOpenOutlined className="text-5xl text-blue-500" />
            <p className="text-gray-600">Bishopric shared files are stored in a Google Drive folder.</p>
            <Button type="primary" size="large" href={SHARED_FILES_URL} target="_blank" rel="noopener noreferrer">
                Open shared files
            </Button>
        </div>
    </section>
);

export default SharedFilesPage;
