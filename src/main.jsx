import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"; // ✅ IMPORT HERE
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ MUST wrap everything */}
     <AuthProvider> 
    <App />
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)