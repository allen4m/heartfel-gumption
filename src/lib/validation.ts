import { GradeSystem } from './airtable';

export function validateCredits(value: string): string | null {
  if (!value) return null;
  
  const num = parseFloat(value);
  if (isNaN(num)) return 'Must be a number';
  if (num <= 0) return 'Must be greater than 0';
  if (num > 12) return 'Must be 12 or less';
  if (!Number.isInteger(num * 2)) return 'Must be in 0.5 increments';
  
  return null;
}

export function validateGrade(value: string, gradingSystem: GradeSystem[]): string | null {
  if (!value) return null;
  if (!gradingSystem?.length) return 'Select a country first';

  const numericGrade = parseFloat(value);
  const isNumeric = !isNaN(numericGrade);
  const letterGrade = value.trim().toUpperCase();

  // Check if it's a valid numeric grade
  const hasValidNumericGrade = isNumeric && gradingSystem.some(grade =>
    numericGrade >= grade.grade_range_min && numericGrade <= grade.grade_range_max
  );

  // Check if it's a valid letter grade
  const hasValidLetterGrade = gradingSystem.some(grade =>
    grade.us_grade_letter?.toUpperCase() === letterGrade
  );

  if (!hasValidNumericGrade && !hasValidLetterGrade) {
    const numericRanges = gradingSystem
      .map(g => `${g.grade_range_min}-${g.grade_range_max}`)
      .filter((v, i, a) => a.indexOf(v) === i);
    
    const letterGrades = gradingSystem
      .map(g => g.us_grade_letter)
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(', ');

    return `Invalid grade. Use ${numericRanges.join(', ')} or ${letterGrades}`;
  }

  return null;
}