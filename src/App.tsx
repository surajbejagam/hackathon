import React, { useState } from 'react';
import { Activity, BarChart3, Shield, AlertTriangle } from 'lucide-react';
import { APP_CONFIG } from './config/api';
import { PreMulticlassPrediction } from './components/PreMulticlassPrediction';
import { PostBinaryPrediction } from './components/PostBinaryPrediction';
import { StatusSummary } from './components/StatusSummary';

type ActiveTab = 'pre-multiclass' | 'post-binary' | 'status-summary';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pre-multiclass');

  const tabs = [
    {
      id: 'pre-multiclass' as ActiveTab,
      name: 'Pre-Use Severity',
      icon: Shield,
      description: 'Predict device risk classification'
    },
    {
      id: 'post-binary' as ActiveTab,
      name: 'Post-Event Risk',
      icon: AlertTriangle,
      description: 'Assess risk after incidents'
    },
    {
      id: 'status-summary' as ActiveTab,
      name: 'Status Summary',
      icon: BarChart3,
      description: 'Device event analytics'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'pre-multiclass':
        return <PreMulticlassPrediction />;
      case 'post-binary':
        return <PostBinaryPrediction />;
      case 'status-summary':
        return <StatusSummary />;
      default:
        return <PreMulticlassPrediction />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {APP_CONFIG.name}
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              {APP_CONFIG.description}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{tab.name}</div>
                    <div className="text-xs text-gray-500">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2025 {APP_CONFIG.name}. {APP_CONFIG.description}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;