import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersPage from "./pages/UsersPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import RolesPage from "./pages/RolesPage";
import ServiceCatalogPage from "./pages/ServiceCatalogPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import AgentDashboard from "./pages/AgentDashboard";

function App() {

  return (
    

      <Routes>
        
        {/* Public routes */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected admin route */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
                <ProtectedRoute adminOnly={true}>
                  <UsersPage />
                </ProtectedRoute>
        } />
        <Route path="/admin/departments" element={
                <ProtectedRoute adminOnly={true}>
                  <DepartmentsPage />
                </ProtectedRoute>
        } />
        <Route path="/admin/roles" element={
                <ProtectedRoute adminOnly={true}>
                  <RolesPage />
                </ProtectedRoute>
        } />  
        <Route path="/admin/services" element={
                <ProtectedRoute adminOnly={true}>
                  <ServiceCatalogPage />
                </ProtectedRoute>
        } />

        {/* Regular user route (just needs to be logged in) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard /> {/* Create this component */}
            </ProtectedRoute>
          }
        />
        <Route path="/services" element={
                <ProtectedRoute>
                  <ServiceCatalogPage />
                </ProtectedRoute>
        } />
        <Route path="/tickets/create" element={
                <ProtectedRoute>
                  <CreateTicketPage />
                </ProtectedRoute>
        } />
        <Route path="/tickets/my" element={
                <ProtectedRoute>
                  <MyTicketsPage />
                </ProtectedRoute>
        } />

        {/* Agent route */}
        <Route path="/agent" element={
          <ProtectedRoute agentOnly={true}>
            <AgentDashboard />
          </ProtectedRoute> 
        } />
      </Routes>

    
  );
}

export default App;