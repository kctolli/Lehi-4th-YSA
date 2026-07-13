import { Route, Routes } from 'react-router-dom';

const Footer = () => (
    <footer className="!mb-8 flex items-center justify-center">
        <small className="w-full text-center font-sans text-base sm:text-lg">
            <span>&copy; {new Date().getFullYear()} &ndash; </span>
            <Routes>
                <Route
                    index
                    element={
                        <a className="transition-all hover:text-tertiary hover:underline" href="/" aria-label="Heritage Park YSA">
                            Lehi YSA 4th Ward, 26&ndash;35
                        </a>
                    }
                />
            </Routes>
        </small>
    </footer>
);

export default Footer;
