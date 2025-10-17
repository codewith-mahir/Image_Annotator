import { useState } from 'react';
import Navbar from '../components/Navbar';
import UploadPanel from '../components/UploadPanel';
import AnnotatePanel from '../components/AnnotatePanel';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="dashboard">
      <Navbar activeTab={activeTab} onChangeTab={setActiveTab} />
      <main>
        {activeTab === 'upload' && <UploadPanel />}
        {activeTab === 'annotate' && <AnnotatePanel />}
      </main>
    </div>
  );
};

export default DashboardPage;
