import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Course, Exam, Question, Result, StudentExam } from '../types';
import { storage } from '../services/storage';
import { handleFirestoreError, OperationType } from '../firebase';

// Demo credentials database
const DEMO_CREDENTIALS = [
  { email: 'student@exam.com', password: 'password123', isAdmin: false, name: 'John Student' },
  { email: 'admin@exam.com', password: 'admin123', isAdmin: true, name: 'Admin User' },
];

interface AppContextType {
  currentUser: Student | null;
  students: Student[];
  courses: Course[];
  exams: Exam[];
  questions: Question[];
  results: Result[];
  studentExams: StudentExam[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addResult: (result: Result) => Promise<void>;
  updateStudentExamStatus: (examId: string, status: StudentExam['attempt_status']) => Promise<void>;
  addExam: (exam: Partial<Exam>) => Promise<void>;
  updateExam: (id: string, exam: Partial<Exam>) => Promise<void>;
  addQuestion: (question: Partial<Question>) => Promise<void>;
  updateQuestion: (id: string, question: Partial<Question>) => Promise<void>;
  assignExamToStudents: (examId: string, studentIds: string[]) => Promise<void>;
  deleteItem: (collectionName: string, id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [studentExams, setStudentExams] = useState<StudentExam[]>([]);

  // Check localStorage on mount for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error restoring session:', err);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Load data from localStorage on mount and setup polling
  useEffect(() => {
    // Initialize storage if needed
    storage.init();
    
    // Load initial data from localStorage
    setStudents(storage.getStudents());
    setCourses(storage.getCourses());
    setExams(storage.getExams());
    setQuestions(storage.getQuestions());
    setResults(storage.getResults());
    setStudentExams(storage.getStudentExams());
    
    // Poll localStorage for changes every second
    const interval = setInterval(() => {
      setStudents(storage.getStudents());
      setCourses(storage.getCourses());
      setExams(storage.getExams());
      setQuestions(storage.getQuestions());
      setResults(storage.getResults());
      setStudentExams(storage.getStudentExams());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Validate credentials against demo database
      const credential = DEMO_CREDENTIALS.find(
        c => c.email === email && c.password === password
      );

      if (!credential) {
        return false;
      }

      // Create user object
      const userData: Student = {
        student_id: email.replace('@', '_').replace('.', '_'),
        name: credential.name,
        email: email,
        phone: '',
        course_id: credential.isAdmin ? 'admin' : 'general',
        isAdmin: credential.isAdmin
      };

      setCurrentUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const addResult = async (result: Result) => {
    try {
      const results = storage.getResults();
      results.push(result);
      storage.setResults(results);
      setResults(results);
    } catch (err) {
      console.error('Error adding result:', err);
    }
  };

  const updateStudentExamStatus = async (examId: string, status: StudentExam['attempt_status']) => {
    if (!currentUser) return;
    try {
      const studentExams = storage.getStudentExams();
      const index = studentExams.findIndex(se => se.student_id === currentUser.student_id && se.exam_id === examId);
      if (index !== -1) {
        studentExams[index] = { student_id: currentUser.student_id, exam_id: examId, attempt_status: status };
      } else {
        studentExams.push({ student_id: currentUser.student_id, exam_id: examId, attempt_status: status });
      }
      storage.setStudentExams(studentExams);
      setStudentExams(studentExams);
    } catch (err) {
      console.error('Error updating exam status:', err);
    }
  };

  const addExam = async (exam: Partial<Exam>) => {
    try {
      const exams = storage.getExams();
      const id = 'e' + Date.now();
      exams.push({ ...exam, exam_id: id } as Exam);
      storage.setExams(exams);
      setExams(exams);
    } catch (err) {
      console.error('Error adding exam:', err);
    }
  };

  const updateExam = async (id: string, exam: Partial<Exam>) => {
    try {
      const exams = storage.getExams();
      const index = exams.findIndex(e => e.exam_id === id);
      if (index !== -1) {
        exams[index] = { ...exams[index], ...exam };
        storage.setExams(exams);
        setExams(exams);
      }
    } catch (err) {
      console.error('Error updating exam:', err);
    }
  };

  const addQuestion = async (question: Partial<Question>) => {
    try {
      const questions = storage.getQuestions();
      const id = 'q' + Date.now();
      questions.push({ ...question, question_id: id } as Question);
      storage.setQuestions(questions);
      setQuestions(questions);
    } catch (err) {
      console.error('Error adding question:', err);
    }
  };

  const updateQuestion = async (id: string, question: Partial<Question>) => {
    try {
      const questions = storage.getQuestions();
      const index = questions.findIndex(q => q.question_id === id);
      if (index !== -1) {
        questions[index] = { ...questions[index], ...question };
        storage.setQuestions(questions);
        setQuestions(questions);
      }
    } catch (err) {
      console.error('Error updating question:', err);
    }
  };

  const assignExamToStudents = async (examId: string, studentIds: string[]) => {
    try {
      const studentExams = storage.getStudentExams();
      
      // Remove students no longer selected
      const filtered = studentExams.filter(se => !(se.exam_id === examId && !studentIds.includes(se.student_id)));
      
      // Add new students
      for (const studentId of studentIds) {
        if (!filtered.find(se => se.student_id === studentId && se.exam_id === examId)) {
          filtered.push({
            student_id: studentId,
            exam_id: examId,
            attempt_status: 'Not Attempted'
          });
        }
      }
      
      storage.setStudentExams(filtered);
      setStudentExams(filtered);
    } catch (err) {
      console.error('Error assigning exam:', err);
    }
  };

  const deleteItem = async (collectionName: string, id: string) => {
    try {
      if (collectionName === 'students') {
        const students = storage.getStudents();
        storage.setStudents(students.filter(s => s.student_id !== id));
        setStudents(storage.getStudents());
      } else if (collectionName === 'courses') {
        const courses = storage.getCourses();
        storage.setCourses(courses.filter(c => c.course_id !== id));
        setCourses(storage.getCourses());
      } else if (collectionName === 'exams') {
        const exams = storage.getExams();
        storage.setExams(exams.filter(e => e.exam_id !== id));
        setExams(storage.getExams());
      } else if (collectionName === 'questions') {
        const questions = storage.getQuestions();
        storage.setQuestions(questions.filter(q => q.question_id !== id));
        setQuestions(storage.getQuestions());
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        students,
        courses,
        exams,
        questions,
        results,
        studentExams,
        login,
        logout,
        addResult,
        updateStudentExamStatus,
        addExam,
        updateExam,
        addQuestion,
        updateQuestion,
        assignExamToStudents,
        deleteItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

