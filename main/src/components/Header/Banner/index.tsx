'use client';

import { Card } from 'antd';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

const Banner = () => (
    <aside className="-mb-4 mt-4 w-full">
        <Swiper
            autoplay={{
                delay: 4000,
                pauseOnMouseEnter: true
            }}
            pagination={{ clickable: true }}
            autoHeight={true}
            direction={'vertical'}
            loop={true}
            draggable={true}
            modules={[Autoplay, Pagination]}
            className="rounded border bg-white shadow-md"
        >
            <SwiperSlide className="!h-fit">
                <Card className="border-0 bg-white text-center [&>div]:!p-0">
                    <a
                        className="flex items-center justify-center gap-3 px-4 py-2 font-serif font-bold uppercase text-primary transition-all hover:text-tertiary hover:underline xxs:gap-4 sm:text-lg"
                        href="https://temple-online-scheduling.churchofjesuschrist.org"
                        aria-label="Temple Schedule"
                        target="_blank"
                    >
                        <span>TEMPLE SCHEDULE</span>
                    </a>
                </Card>
            </SwiperSlide>
            <SwiperSlide className="!h-fit">
                <Card className="border-0 bg-white text-center [&>div]:!p-0">
                    <a
                        className="flex items-center justify-center gap-3 px-4 py-2 font-serif font-bold uppercase text-primary transition-all hover:text-tertiary hover:underline xxs:gap-4 sm:text-lg"
                        href="https://www.churchofjesuschrist.org/study"
                        aria-label="Gospel Library"
                        target="_blank"
                    >
                        <span>GOSPEL LIBRARY</span>
                    </a>
                </Card>
            </SwiperSlide>
            <SwiperSlide className="!h-fit">
                <Card className="border-0 bg-white text-center [&>div]:!p-0">
                    <a
                        className="flex items-center justify-center gap-3 px-4 py-2 font-serif font-bold uppercase text-primary transition-all hover:text-tertiary hover:underline xxs:gap-4 sm:text-lg"
                        href="https://lehi4thysa-come-follow-me.vercel.app"
                        aria-label="Come Follow Me"
                        target="_blank"
                    >
                        <span>COME FOLLOW ME</span>
                    </a>
                </Card>
            </SwiperSlide>
        </Swiper>
    </aside>
);

export default Banner;
