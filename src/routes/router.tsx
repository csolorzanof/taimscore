import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../views/LandindPage";
import TosPrivacy from "../views/TosPrivacy";

const Router = createBrowserRouter([
    {path:'/', element: <LandingPage />},
    {path:'/tos', element: <TosPrivacy />},
    {path:'/privacy', element: <TosPrivacy />},
]);

export default Router;