import { Card } from 'antd';
import Banner from './Banner';

import ChurchDetails from './ChurchDetails';
import {
    BishopInfo, 
    ExecutiveSecretaryInfo, 
    ActivityInfo
} from './lib';

const Header = () => (
    <>
        <Banner />
        <header className="flex w-full flex-col items-center justify-center gap-6 text-center sm:gap-8">
            <img className="rounded" src="https://res.cloudinary.com/hpysa/f_auto,q_auto/hero" alt="Jesus Christ" sizes="100x100" />
            <ChurchDetails />
            
            <section className="mx-auto grid w-full gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                
                {/* --- Leadership Section (2 per row -> 6/12 columns each) --- */}
                <Card className="border-0 lg:col-span-6">
                    <div className="flex flex-col items-center justify-center gap-1 rounded border p-4 font-sans text-base uppercase text-primary shadow-md sm:p-4">
                        <span className="font-medium sm:text-lg">{BishopInfo.name}</span>
                        <a className="text-tertiary transition-all hover:text-tertiary hover:underline" href={`tel: ${BishopInfo.phone}`}>
                            {BishopInfo.phone}
                        </a>
                    </div>
                </Card>
                <Card className="border-0 lg:col-span-6">
                    <div className="flex flex-col items-center justify-center gap-1 rounded border p-4 font-sans text-base uppercase text-primary shadow-md sm:p-4">
                        <span className="font-medium sm:text-lg">{ExecutiveSecretaryInfo.name}</span>
                        <a className="text-tertiary transition-all hover:text-tertiary hover:underline" href={`tel: ${ExecutiveSecretaryInfo.phone}`}>
                            {ExecutiveSecretaryInfo.phone}
                        </a>
                    </div>
                </Card>
        
                {/* --- Operations Section (4 per row -> 3/12 columns each) --- */}
                <Card className="border-0 lg:col-span-6">
                    <div className="flex flex-col items-center justify-center gap-1 rounded border p-4 font-sans text-base uppercase text-primary shadow-md">
                        <span className="font-medium sm:text-lg">Activity Night</span>
                        <span>{ActivityInfo.fhe}</span>
                    </div>
                </Card>
                <Card className="border-0 lg:col-span-6">
                    <div className="flex flex-col items-center justify-center gap-1 rounded border p-4 font-sans text-base uppercase text-primary shadow-md">
                        <span className="font-medium sm:text-lg">Stake Night</span>
                        <span>{ActivityInfo.stake}</span>
                    </div>
                </Card>
            </section>
        </header>
    </>
);

export default Header;
