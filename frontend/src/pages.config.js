
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Submit from './pages/Submit';
import Reviews from './pages/Reviews';
import Admin from './pages/Admin';
import __Layout from './Layout.jsx';
import Login from './pages/Login';

export const PAGES = {
    "Home": Home,
    "Portfolio": Portfolio,
    "Submit": Submit,
    "Reviews": Reviews,
    "admin": Admin,
    "login": Login,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};