import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import DashboardPage from "../pages/DashboardPage";
import AddMyProject from "../pages/AddMyProject";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<Dashboard />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/AddProject" element={<AddMyProject />} />
        </Route>
        </>
    )
)

export default router;