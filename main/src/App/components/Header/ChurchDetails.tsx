import { Tooltip } from 'antd';

const ChurchDetails = () => {
    const ChurchTime = () => {
        const year = new Date().getFullYear();
        return (year % 2 === 0) ? '10:00 AM' : '12:30 PM';
    }

    return (
        <>
            <section className="flex w-full flex-col items-center justify-center gap-6 font-sans sm:gap-8">
                <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl md:text-5xl">Heritage Park YSA Ward, 26&ndash;35</h1>
                <div className="mt-4 flex w-full items-start justify-center">
                    <hr className="flex-grow border-t border-primary" />
                    <span className="-mt-[0.8125rem] px-4 text-xl uppercase text-primary md:-mt-5 md:px-6 md:text-2xl">Sundays @ {ChurchTime()}</span>
                    <hr className="flex-grow border-t border-primary" />
                </div>
            </section>
            <section className="mb-2 flex w-full items-center justify-center gap-6 sm:mb-4 sm:mt-2 lg:gap-8">
                <Tooltip title="Google Maps" placement="left">
                    <a
                        className="rounded-2xl p-4 transition-all hover:bg-[#f0f0f0]"
                        href="https://www.google.com/maps/place/10380+N+6000+W,+Highland,+UT+84003/@40.4205076,-111.8041577,17z/data=!3m1!4b1!4m6!3m5!1s0x874d80f314f5e367:0x7ee7372316fb4f66!8m2!3d40.4205035!4d-111.8015828!16s%2Fg%2F11bw4b36_0?coh=245189&entry=tts&g_ep=EgoyMDI1MDIxMS4wIPu8ASoJLDEwMjExNDU1SAFQAw%3D%3D"
                        aria-label="Heritage Park YSA Google Maps Address"
                        target="_blank"
                    >
                        <img className="size-12 object-contain" src="https://res.cloudinary.com/hpysa/f_auto,q_auto/google.svg" alt="Facebook Logo" />
                    </a>
                </Tooltip>
                <Tooltip title="Apple Maps" placement="right">
                    <a
                        className="rounded-2xl p-4 transition-all hover:bg-[#f0f0f0]"
                        href="https://maps.apple.com/place?address=10380%20N%206000%20W%20St,%20Highland,%20UT%20%2084003,%20United%20States&ll=40.420504,-111.801703&q=10380%20N%206000%20W%20St&t=m"
                        aria-label="Heritage Park YSA Apple Maps Address"
                        target="_blank"
                    >
                        <img className="size-12 object-contain" src="https://res.cloudinary.com/hpysa/f_auto,q_auto,w_128,h_128/apple.svg" alt="Facebook Logo" />
                    </a>
                </Tooltip>
            </section>
        </>
    );
}

export default ChurchDetails;
