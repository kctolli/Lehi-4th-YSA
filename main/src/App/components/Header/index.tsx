import { Card } from 'antd';
import Banner from './Banner';

import ChurchDetails from './ChurchDetails';

const BishopInfo = {
    name: 'Bishop Mugleston',
    phone: '(801) 367-0602',
};

const ExecutiveSecretaryInfo = {
    name: 'Executive Secretary',
    phone: '(209) 790-9348',
};

const Header = () => (
    <>
        <Banner />
        <header className="flex w-full flex-col items-center justify-center gap-6 text-center sm:gap-8">
            <img className="rounded" src="https://res.cloudinary.com/hpysa/f_auto,q_auto/hero" alt="Jesus Christ" />
            <ChurchDetails />
            <section className="text-md mx-auto grid w-full grid-cols-1 grid-rows-2 gap-6 sm:grid-cols-[repeat(2,minmax(15rem,1fr))] lg:gap-8">
                <Card className="border-0">
                    <div className="flex flex-col items-center justify-center gap-1 rounded border p-4 font-sans text-base uppercase text-primary shadow-md sm:p-4">
                        <span className="font-medium sm:text-lg">{BishopInfo.name}</span>
                        <a className="text-tertiary transition-all hover:text-tertiary hover:underline" href={`tel: ${BishopInfo.phone}`} aria-label="Bishop's Phone Number">
                            {BishopInfo.phone}
                        </a>
                    </div>
                </Card>
                <Card className="border-0">
                    <div className="flex flex-col items-center justify-center gap-1 rounded border p-4 font-sans text-base uppercase text-primary shadow-md sm:p-4">
                        <span className="font-medium sm:text-lg">EXECUTIVE SECRETARY</span>
                        <a className="text-tertiary transition-all hover:text-tertiary hover:underline" href={`tel: ${ExecutiveSecretaryInfo.phone}`} aria-label="Executive Secretary's Phone Number">
                            {ExecutiveSecretaryInfo.phone}
                        </a>
                    </div>
                </Card>
                <Card className="border-0">
                    <div className="flex flex-col items-center justify-center gap-1 rounded border p-4 font-sans text-base uppercase text-primary shadow-md sm:p-4">
                        <span className="font-medium sm:text-lg">ACTIVITY NIGHT</span>
                        <span>Mondays @ 7:00PM</span>
                    </div>
                </Card>
                <Card className="border-0">
                    <div className="flex flex-col items-center justify-center gap-1 rounded border p-4 font-sans text-base uppercase text-primary shadow-md sm:p-4">
                        <span className="font-medium sm:text-lg">STAKE NIGHT</span>
                        <span>Thursdays @ 6:30PM</span>
                    </div>
                </Card>
            </section>
        </header>
    </>
);

export default Header;
