import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import DashboardPage from "../pages/DashboardPage";
import AddMyProject from "../pages/AddMyProject";
import AllProjects from "../pages/AllProjects";
import Settings from "../pages/Settings";
import Skill from "../pages/Skill";
import AllSkills from "../pages/AllSkills";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<Dashboard />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/AddProject" element={<AddMyProject />} />
        <Route path="/project" element={<AllProjects />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/skills" element={<Skill />} />
        <Route path="/Allskills" element={<AllSkills />} />
        </Route>
        </>
    )
)

export default router;