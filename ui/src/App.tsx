import CesiumViewer from './components/CesiumViewer';
import BusDashboard from './components/BusDashboard';
import { BusDataProvider } from './context/BusData';

import './index.css';
import { CesiumProvider } from './context/Cesium';
import ProjectInfo from './components/ProjectInfo';
import { useTranslation } from 'react-i18next';

function App() {
  return (
    <BusDataProvider>
      <CesiumProvider>
        <div className="w-full h-full relative">
          <BusDashboard />
          <ProjectInfo />
          <CesiumViewer />
        </div>
      </CesiumProvider>
    </BusDataProvider>
  );
}

export default App
