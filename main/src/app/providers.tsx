'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { App, ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const Providers = ({ children }: { children: ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AntdRegistry>
                <ConfigProvider>
                    <App>{children}</App>
                </ConfigProvider>
            </AntdRegistry>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" position="left" />
        </QueryClientProvider>
    );
};

export default Providers;
