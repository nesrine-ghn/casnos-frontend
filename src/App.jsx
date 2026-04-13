import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>

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
        {/* Regular user route (just needs to be logged in) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard /> {/* Create this component */}
            </ProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;