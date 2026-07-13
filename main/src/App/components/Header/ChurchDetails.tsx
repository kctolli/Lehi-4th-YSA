const ChurchDetails = () => {
    const ChurchTime = () => {
        //const year = new Date().getFullYear();
        //return (year % 2 === 0) ? '' : '';
        return '1:00 PM';
    }

    return (
        <>
            <section className="flex w-full flex-col items-center justify-center gap-6 font-sans sm:gap-8">
                <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl md:text-5xl">Lehi YSA 4th Ward, 26&ndash;35</h1>
                <div className="mt-4 flex w-full items-start justify-center">
                    <hr className="flex-grow border-t border-primary" />
                    <span className="-mt-[0.8125rem] px-4 text-xl uppercase text-primary md:-mt-5 md:px-6 md:text-2xl">Sundays @ {ChurchTime()}</span>
                    <hr className="flex-grow border-t border-primary" />
                </div>
            </section>
        </>
    );
}

export default ChurchDetails;
