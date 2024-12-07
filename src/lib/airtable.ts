import Airtable from 'airtable';

// Get environment variables
const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  throw new Error('Missing required environment variables');
}

// Initialize Airtable with environment variables
const base = new Airtable({ apiKey }).base(baseId);

// Rate limiting configuration
const RATE_LIMIT = 5; // requests per second
const REQUEST_QUEUE: (() => Promise<any>)[] = [];
let lastRequestTime = 0;

// Rate limiter function
async function executeWithRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const minRequestInterval = 1000 / RATE_LIMIT;

  if (timeSinceLastRequest < minRequestInterval) {
    await new Promise(resolve => 
      setTimeout(resolve, minRequestInterval - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();
  return fn();
}

export type GradeSystem = {
  country_name: string;
  grading_mode: string;
  us_grade_letter: string;
  grade_range_min: number;
  grade_range_max: number;
  grade_points: number;
};

// Cache implementation
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function fetchGradingSystems(): Promise<Record<string, GradeSystem[]>> {
  try {
    // Check cache first
    const cached = getFromCache<Record<string, GradeSystem[]>>('gradingSystems');
    if (cached) return cached;

    const records = await executeWithRateLimit(() => 
      base('WorldGPA')
        .select({
          maxRecords: 1000,
          view: 'Grid view'
        })
        .all()
    );

    const systems = records.reduce((acc, record) => {
      const fields = record.fields as GradeSystem;
      const country = fields.country_name;
      
      if (!acc[country]) {
        acc[country] = [];
      }
      
      acc[country].push(fields);
      return acc;
    }, {} as Record<string, GradeSystem[]>);

    // Cache the results
    setCache('gradingSystems', systems);
    return systems;
  } catch (error) {
    console.error('Error fetching grading systems:', error);
    throw new Error('Failed to fetch grading systems');
  }
}

export async function fetchCountries(): Promise<string[]> {
  try {
    // Check cache first
    const cached = getFromCache<string[]>('countries');
    if (cached) return cached;

    const records = await executeWithRateLimit(() => 
      base('WorldGPA')
        .select({
          maxRecords: 1000,
          view: 'Grid view',
          fields: ['country_name']
        })
        .all()
    );

    const countries = [...new Set(records.map(record => 
      record.get('country_name') as string
    ))].filter(Boolean).sort();

    // Cache the results
    setCache('countries', countries);
    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw new Error('Failed to fetch countries');
  }
}

export function convertGradeToGPA(gradeInput: string, gradingSystem: GradeSystem[]): number | null {
  try {
    const numericGrade = parseFloat(gradeInput);

    if (!isNaN(numericGrade)) {
      // Handle numeric grades
      const matchingGrade = gradingSystem.find(grade => 
        numericGrade >= grade.grade_range_min && 
        numericGrade <= grade.grade_range_max
      );
      return matchingGrade ? matchingGrade.grade_points : null;
    } else {
      // Handle letter grades
      const normalizedInput = gradeInput.trim().toUpperCase();
      const matchingGrade = gradingSystem.find(grade => 
        grade.us_grade_letter?.toUpperCase() === normalizedInput
      );
      return matchingGrade ? matchingGrade.grade_points : null;
    }
  } catch (error) {
    console.error('Error converting grade to GPA:', error);
    return null;
  }
}