import React from 'react';
import { type GradeSystem } from '../lib/airtable';

type GradeScaleProps = {
  gradingSystem: GradeSystem[];
  selectedMode: string;
};

export default function GradeScale({ 
  gradingSystem, 
  selectedMode 
}: GradeScaleProps) {
  const filteredSystem = selectedMode
    ? gradingSystem.filter(gs => gs.grading_mode === selectedMode)
    : gradingSystem;

  const sortedGrades = [...filteredSystem].sort((a, b) => b.grade_points - a.grade_points);

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Grade Scale</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {sortedGrades.map((grade, index) => (
          <div 
            key={`${grade.us_grade_letter}-${grade.grade_points}-${index}`}
            className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100"
          >
            {grade.grade_range_min === grade.grade_range_max ? (
              <span>{grade.us_grade_letter} = {grade.grade_points.toFixed(1)}</span>
            ) : (
              <span>{grade.grade_range_min}-{grade.grade_range_max} = {grade.us_grade_letter} ({grade.grade_points.toFixed(1)})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}