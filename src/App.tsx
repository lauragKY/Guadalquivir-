import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DamSelectionProvider } from './contexts/DamSelectionContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DamDetail from './pages/DamDetail';
import Inventory from './pages/Inventory';
import Maintenance from './pages/Maintenance';
import TechnicalArchive from './pages/TechnicalArchive';
import Auscultation from './pages/Auscultation';
import Exploitation from './pages/Exploitation';
import BIM from './pages/BIM';
import BIMViewer from './pages/BIMViewer';
import EmergencyManagement from './pages/EmergencyManagement';
import Incidents from './pages/Incidents';
import Map from './pages/Map';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ColorPalette from './pages/ColorPalette';
import SetupDemoUsers from './pages/SetupDemoUsers';

function App() {
  return (
    <AuthProvider>
      <DamSelectionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/setup-demo" element={<SetupDemoUsers />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/map" replace />} />
                      <Route path="/map" element={<Map />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/dam/:id" element={<DamDetail />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/maintenance" element={<Maintenance />} />
                      <Route path="/technical-archive" element={<TechnicalArchive />} />
                      <Route path="/auscultation" element={<Auscultation />} />
                      <Route path="/exploitation" element={<Exploitation />} />
                      <Route path="/bim" element={<BIM />} />
                      <Route path="/bim-viewer" element={<BIMViewer />} />
                      <Route path="/emergency" element={<EmergencyManagement />} />
                      <Route path="/incidents" element={<Incidents />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/color-palette" element={<ColorPalette />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </DamSelectionProvider>
    </AuthProvider>
  );
}

export default App;
