import { ReactNode } from 'react';

const WardCouncilLayout = ({ children }: { children: ReactNode }) => {
    return <section className="flex flex-col gap-6">{children}</section>;
};

export default WardCouncilLayout;
