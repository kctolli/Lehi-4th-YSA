import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp } from 'antd';
import { render, RenderOptions } from '@testing-library/react';

// A fresh QueryClient per render keeps tests isolated; retries off so rejected
// queries/mutations surface immediately.
const makeClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false }
        }
    });

const Providers = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={makeClient()}>
        <AntApp>{children}</AntApp>
    </QueryClientProvider>
);

export const renderWithProviders = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';
