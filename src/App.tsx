import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import GPACalculator from './components/GPACalculator';
import UniversityFinder from './components/UniversityFinder';

function App() {
  const [activeTab, setActiveTab] = useState<'gpa' | 'finder'>('gpa');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">1Admission</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('gpa')}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeTab === 'gpa'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                GPA Calculator
              </button>
              <button
                onClick={() => setActiveTab('finder')}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeTab === 'finder'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                University Finder
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'gpa' ? <GPACalculator /> : <UniversityFinder />}
      </main>

      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} 1Admission. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;