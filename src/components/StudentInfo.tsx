import React from 'react';

type StudentInfoProps = {
  studentName: string;
  schoolName: string;
  onStudentNameChange: (value: string) => void;
  onSchoolNameChange: (value: string) => void;
};

export default function StudentInfo({
  studentName,
  schoolName,
  onStudentNameChange,
  onSchoolNameChange
}: StudentInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Student Name
        </label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => onStudentNameChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter student name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          School Name
        </label>
        <input
          type="text"
          value={schoolName}
          onChange={(e) => onSchoolNameChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter school name"
        />
      </div>
    </div>
  );
}