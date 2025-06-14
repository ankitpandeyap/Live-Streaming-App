import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css';
import './index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider> {/* Wrap App with AuthProvider for auth context */}
      <BrowserRouter> {/* Wrap App with BrowserRouter for routing */}
       
        <App />
 
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
