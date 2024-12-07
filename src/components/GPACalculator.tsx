import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Info, Building2, RefreshCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CountrySelector from './CountrySelector';
import StudentInfo from './StudentInfo';
import CourseTable from './CourseTable';
import GradeScale from './GradeScale';
import ExportButtons from './ExportButtons';
import AdvancedFeatures from './AdvancedFeatures';
import { fetchGradingSystems, convertGradeToGPA, type GradeSystem } from '../lib/airtable';
import { validateCredits, validateGrade } from '../lib/validation';
import { CourseEntry } from '../types';

export default function GPACalculator() {
  const [studentName, setStudentName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [country, setCountry] = useState('');
  const [gradingMode, setGradingMode] = useState('');
  const [showGradeScale, setShowGradeScale] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [courses, setCourses] = useState<CourseEntry[]>([
    { id: '1', course: '', grade: '', credits: '' }
  ]);
  const [gradingSystems, setGradingSystems] = useState<Record<string, GradeSystem[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGradingSystems = async () => {
      try {
        const systems = await fetchGradingSystems();
        setGradingSystems(systems);
      } catch (error) {
        toast.error('Failed to load grading systems');
      } finally {
        setIsLoading(false);
      }
    };
    loadGradingSystems();
  }, []);

  useEffect(() => {
    setGradingMode('');
  }, [country]);

  const currentGradingSystem = country ? gradingSystems[country] : undefined;
  const gradingModes = currentGradingSystem 
    ? [...new Set(currentGradingSystem.map(gs => gs.grading_mode))]
    : [];

  const filteredGradingSystem = useMemo(() => {
    if (!currentGradingSystem) return undefined;
    return gradingMode
      ? currentGradingSystem.filter(gs => gs.grading_mode === gradingMode)
      : currentGradingSystem;
  }, [currentGradingSystem, gradingMode]);

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: Date.now().toString(), course: '', grade: '', credits: '' }
    ]);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateCourse = (index: number, field: keyof CourseEntry, value: string) => {
    const newCourses = [...courses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    setCourses(newCourses);
  };

  const clearAll = () => {
    setStudentName('');
    setSchoolName('');
    setCountry('');
    setGradingMode('');
    setCourses([{ id: Date.now().toString(), course: '', grade: '', credits: '' }]);
    setShowGradeScale(false);
    setShowAdvanced(false);
    toast.success('Calculator cleared');
  };

  const hasValidationErrors = useMemo(() => {
    return courses.some(course => {
      const creditError = validateCredits(course.credits);
      const gradeError = validateGrade(course.grade, filteredGradingSystem || []);
      return creditError || gradeError;
    });
  }, [courses, filteredGradingSystem]);

  const calculatedGPA = useMemo(() => {
    if (!filteredGradingSystem || hasValidationErrors) {
      return null;
    }

    const validCourses = courses.filter(course => 
      course.grade && course.credits && parseFloat(course.credits) > 0
    );
    
    if (validCourses.length === 0) {
      return null;
    }

    let totalPoints = 0;
    let totalCredits = 0;
    let hasError = false;

    for (const course of validCourses) {
      const credits = parseFloat(course.credits);
      const gradePoints = convertGradeToGPA(course.grade, filteredGradingSystem);

      if (gradePoints === null) {
        hasError = true;
        break;
      }

      totalPoints += credits * gradePoints;
      totalCredits += credits;
    }

    if (hasError || totalCredits === 0) {
      return null;
    }

    return totalPoints / totalCredits;
  }, [courses, filteredGradingSystem, hasValidationErrors]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">International GPA Calculator</h2>
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            title="Clear all entries"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>

        <StudentInfo
          studentName={studentName}
          schoolName={schoolName}
          onStudentNameChange={setStudentName}
          onSchoolNameChange={setSchoolName}
        />

        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Select Country/System
            </label>
            {currentGradingSystem && (
              <button
                onClick={() => setShowGradeScale(!showGradeScale)}
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                aria-expanded={showGradeScale}
                aria-controls="grade-scale-panel"
              >
                <Info className="w-4 h-4" />
                <span>{showGradeScale ? 'Hide' : 'Show'} Grade Scale</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CountrySelector selected={country} onChange={setCountry} />
            </div>

            {gradingModes.length > 1 && (
              <div>
                <select
                  value={gradingMode}
                  onChange={(e) => setGradingMode(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  aria-label="Select Grading Mode"
                >
                  <option key="default" value="">Select Grading Mode</option>
                  {gradingModes.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {currentGradingSystem && (
          <div
            id="grade-scale-panel"
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showGradeScale ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'
            }`}
            role="region"
            aria-hidden={!showGradeScale}
          >
            <GradeScale
              gradingSystem={currentGradingSystem}
              selectedMode={gradingMode}
            />
          </div>
        )}

        <CourseTable
          courses={courses}
          gradingSystem={filteredGradingSystem}
          selectedMode={gradingMode}
          onUpdateCourse={updateCourse}
          onRemoveCourse={removeCourse}
        />

        <div className="flex justify-between items-center mb-8">
          <button
            onClick={addCourse}
            className="flex items-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          >
            <span>Add Course</span>
          </button>
          <div className="text-xl font-bold">
            Cumulative GPA: {calculatedGPA !== null ? calculatedGPA.toFixed(2) : '0.00'}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span className="font-medium text-gray-800">Advanced Institutional Features</span>
          </button>
          <ExportButtons
            studentName={studentName}
            schoolName={schoolName}
            courses={courses}
            gpa={calculatedGPA}
            country={country}
          />
        </div>
      </div>

      {showAdvanced && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Advanced Institutional Features</h3>
          <AdvancedFeatures />
        </div>
      )}
    </div>
  );
}