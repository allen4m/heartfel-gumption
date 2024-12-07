import React from 'react';
import { 
  BarChart3, 
  Users, 
  Share2, 
  MessageSquareMore,
  Workflow,
  Building
} from 'lucide-react';

export default function AdvancedFeatures() {
  const features = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Standardized Calculations',
      description: 'Ensure consistent GPA results across your institution with automated validation'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Team Onboarding & Training',
      description: 'Automated GPA conversion system maintains standardization regardless of staff changes'
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: 'CRM Integration',
      description: 'Seamlessly connect with your existing systems for streamlined data flow'
    },
    {
      icon: <MessageSquareMore className="w-5 h-5" />,
      title: 'Lead Nurturing',
      description: 'Automated follow-ups and personalized communication workflows'
    },
    {
      icon: <Workflow className="w-5 h-5" />,
      title: 'AI-Powered Workflow',
      description: 'Smart transcript reader automatically extracts and converts grades from any format'
    },
    {
      icon: <Building className="w-5 h-5" />,
      title: 'Multi-Campus Support',
      description: 'Centralized management for multiple locations with custom rules per campus'
    }
  ];

  return (
    <div className="space-y-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="p-3 rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className="text-indigo-600 group-hover:text-indigo-700">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ))}
      <button className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium">
        Subscribe to Advanced Institutional Features for $699 annually
      </button>
    </div>
  );
}