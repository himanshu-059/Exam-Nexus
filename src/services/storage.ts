import { Student, Course, Exam, Question, Result, StudentExam } from '../types';
import { INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_EXAMS, INITIAL_QUESTIONS } from '../data/mockData';

const KEYS = {
  STUDENTS: 'nexus_students',
  COURSES: 'nexus_courses',
  EXAMS: 'nexus_exams',
  QUESTIONS: 'nexus_questions',
  RESULTS: 'nexus_results',
  STUDENT_EXAMS: 'nexus_student_exams',
  CURRENT_USER: 'nexus_current_user',
};

export const storage = {
  init: () => {
    if (!localStorage.getItem(KEYS.STUDENTS)) {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(KEYS.COURSES)) {
      localStorage.setItem(KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    }
    if (!localStorage.getItem(KEYS.EXAMS)) {
      localStorage.setItem(KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
    }
    if (!localStorage.getItem(KEYS.QUESTIONS)) {
      localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    }
    if (!localStorage.getItem(KEYS.RESULTS)) {
      localStorage.setItem(KEYS.RESULTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.STUDENT_EXAMS)) {
      localStorage.setItem(KEYS.STUDENT_EXAMS, JSON.stringify([]));
    }
  },

  getStudents: (): Student[] => JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]'),
  setStudents: (data: Student[]) => localStorage.setItem(KEYS.STUDENTS, JSON.stringify(data)),

  getCourses: (): Course[] => JSON.parse(localStorage.getItem(KEYS.COURSES) || '[]'),
  setCourses: (data: Course[]) => localStorage.setItem(KEYS.COURSES, JSON.stringify(data)),

  getExams: (): Exam[] => JSON.parse(localStorage.getItem(KEYS.EXAMS) || '[]'),
  setExams: (data: Exam[]) => localStorage.setItem(KEYS.EXAMS, JSON.stringify(data)),

  getQuestions: (): Question[] => JSON.parse(localStorage.getItem(KEYS.QUESTIONS) || '[]'),
  setQuestions: (data: Question[]) => localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(data)),

  getResults: (): Result[] => JSON.parse(localStorage.getItem(KEYS.RESULTS) || '[]'),
  setResults: (data: Result[]) => localStorage.setItem(KEYS.RESULTS, JSON.stringify(data)),

  getStudentExams: (): StudentExam[] => JSON.parse(localStorage.getItem(KEYS.STUDENT_EXAMS) || '[]'),
  setStudentExams: (data: StudentExam[]) => localStorage.setItem(KEYS.STUDENT_EXAMS, JSON.stringify(data)),

  getCurrentUser: (): Student | null => JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null'),
  setCurrentUser: (user: Student | null) => localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user)),
};
