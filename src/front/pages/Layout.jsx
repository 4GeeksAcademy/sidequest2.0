import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BottomNavbar } from "../components/ButtonNavbar";

// On auth pages (/login, /register) hide both navbars so the
// fullscreen dark Login design takes the whole viewport.
const NAV_FREE_PATHS = ["/login", "/register"];

// Padding-bottom siempre (en todas las pantallas) para que el
// pill flotante del bottom-nav no tape el contenido.
const LAYOUT_CSS = `
.sq-layout-content { padding-bottom: 90px; }
`;

export const Layout = () => {
    const location = useLocation();
    const hideNav = NAV_FREE_PATHS.includes(location.pathname);

    return (
        <ScrollToTop>
            <style>{LAYOUT_CSS}</style>

            {!hideNav && <Navbar />}

            <div className="sq-layout-content">
                <Outlet />
            </div>

            {!hideNav && <BottomNavbar />}
        </ScrollToTop>
    );
};