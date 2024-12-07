import React, { useState } from 'react';
import { School, Search } from 'lucide-react';

type University = {
  name: string;
  location: string;
  type: string;
  ranking: number;
  acceptance: string;
  tuition: string;
  image: string;
};

const universities: University[] = [
  {
    name: "Harvard University",
    location: "Cambridge, MA",
    type: "Private",
    ranking: 1,
    acceptance: "5%",
    tuition: "$54,768",
    image: "https://images.unsplash.com/photo-1583657763691-3f4a917cc9f0?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Stanford University",
    location: "Stanford, CA",
    type: "Private",
    ranking: 2,
    acceptance: "4%",
    tuition: "$56,169",
    image: "https://images.unsplash.com/photo-1584721478725-982f8a7aff1c?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "MIT",
    location: "Cambridge, MA",
    type: "Private",
    ranking: 3,
    acceptance: "7%",
    tuition: "$55,878",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=800"
  }
];

export default function UniversityFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    maxTuition: '',
  });

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === 'all' || uni.type.toLowerCase() === filters.type;
    const matchesTuition = !filters.maxTuition || 
                          parseInt(uni.tuition.replace(/[^0-9]/g, '')) <= parseInt(filters.maxTuition);
    
    return matchesSearch && matchesType && matchesTuition;
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <School className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">U.S. University Finder</h2>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search universities by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="mt-4 flex gap-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>

          <input
            type="number"
            placeholder="Max Tuition ($)"
            value={filters.maxTuition}
            onChange={(e) => setFilters({...filters, maxTuition: e.target.value})}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUniversities.map((uni, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src={uni.image}
              alt={uni.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{uni.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Location:</span> {uni.location}</p>
                <p><span className="font-medium">Type:</span> {uni.type}</p>
                <p><span className="font-medium">Ranking:</span> #{uni.ranking}</p>
                <p><span className="font-medium">Acceptance Rate:</span> {uni.acceptance}</p>
                <p><span className="font-medium">Annual Tuition:</span> {uni.tuition}</p>
              </div>
              <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUniversities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No universities found matching your criteria.
        </div>
      )}
    </div>
  );
}