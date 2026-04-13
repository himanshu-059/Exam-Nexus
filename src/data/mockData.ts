import { Student, Course, Exam, Question } from '../types';

export const INITIAL_COURSES: Course[] = [
  { course_id: 'c1', course_name: 'Computer Science', course_duration: '4 Years' },
  { course_id: 'c2', course_name: 'Information Technology', course_duration: '4 Years' },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    student_id: 's1',
    name: 'Admin User',
    email: 'admin@nexus.com',
    phone: '1234567890',
    course_id: 'c1',
    isAdmin: true,
  },
  {
    student_id: 's2',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    course_id: 'c1',
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    exam_id: 'e1',
    exam_name: 'Data Structures Midterm',
    exam_date: '2026-04-15',
    exam_duration: 30,
    course_id: 'c1',
  },
  {
    exam_id: 'e2',
    exam_name: 'Database Management Systems',
    exam_date: '2026-04-20',
    exam_duration: 45,
    course_id: 'c1',
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    question_id: 'q1',
    exam_id: 'e1',
    question_text: 'What is the time complexity of searching in a balanced Binary Search Tree?',
    option_a: 'O(n)',
    option_b: 'O(log n)',
    option_c: 'O(n log n)',
    option_d: 'O(1)',
    correct_option: 'b',
  },
  {
    question_id: 'q2',
    exam_id: 'e1',
    question_text: 'Which data structure uses LIFO principle?',
    option_a: 'Queue',
    option_b: 'Linked List',
    option_c: 'Stack',
    option_d: 'Tree',
    correct_option: 'c',
  },
  {
    question_id: 'q3',
    exam_id: 'e1',
    question_text: 'Which of the following is not a linear data structure?',
    option_a: 'Array',
    option_b: 'Stack',
    option_c: 'Queue',
    option_d: 'Graph',
    correct_option: 'd',
  },
  {
    question_id: 'q4',
    exam_id: 'e2',
    question_text: 'What does SQL stand for?',
    option_a: 'Structured Query Language',
    option_b: 'Simple Query Language',
    option_c: 'Structured Question Language',
    option_d: 'Sequential Query Language',
    correct_option: 'a',
  },
];
