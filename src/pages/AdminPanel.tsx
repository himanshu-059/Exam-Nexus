import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  Book, 
  FileQuestion, 
  ClipboardList, 
  Activity,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-react';
import { storage } from '../services/storage';
import { Student, Course, Exam, Question } from '../types';

type Tab = 'students' | 'courses' | 'exams' | 'questions' | 'monitoring';

export default function AdminPanel() {
  const { students, courses, exams, questions, results, studentExams, addExam, updateExam, addQuestion, updateQuestion, assignExamToStudents, deleteItem } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('students');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', course_id: 'c1' });
  const [newExam, setNewExam] = useState({ exam_name: '', exam_date: '', exam_duration: 30, course_id: 'c1' });
  const [newCourse, setNewCourse] = useState({ course_name: '', course_duration: '' });
  const [newQuestion, setNewQuestion] = useState({ 
    question_text: '', 
    option_a: '', 
    option_b: '', 
    option_c: '', 
    option_d: '', 
    correct_option: 'a' as 'a' | 'b' | 'c' | 'd',
    exam_id: '' 
  });



  const closeModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setNewStudent({ name: '', email: '', course_id: 'c1' });
    setNewExam({ exam_name: '', exam_date: '', exam_duration: 30, course_id: 'c1' });
    setNewCourse({ course_name: '', course_duration: '' });
    setNewQuestion({ 
      question_text: '', 
      option_a: '', 
      option_b: '', 
      option_c: '', 
      option_d: '', 
      correct_option: 'a',
      exam_id: exams[0]?.exam_id || '' 
    });
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const students = storage.getStudents();
      if (editingId) {
        const index = students.findIndex(s => s.student_id === editingId);
        if (index !== -1) {
          students[index] = { ...students[index], ...newStudent };
          storage.setStudents(students);
          alert('Student updated successfully!');
        }
      } else {
        const id = 's' + Date.now();
        students.push({
          ...newStudent,
          student_id: id,
          phone: '0000000000',
        });
        storage.setStudents(students);
        alert('Student added successfully!');
      }
      closeModal();
      window.location.reload();
    } catch (err: any) {
      console.error('Error:', err);
      alert('Error: ' + (err.message || 'Failed to save student'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const exams = storage.getExams();
      if (editingId) {
        const index = exams.findIndex(ex => ex.exam_id === editingId);
        if (index !== -1) {
          exams[index] = { ...exams[index], ...newExam };
          storage.setExams(exams);
          alert('Exam updated successfully!');
        }
      } else {
        const id = 'e' + Date.now();
        exams.push({
          ...newExam,
          exam_id: id,
        } as Exam);
        storage.setExams(exams);
        alert('Exam added successfully!');
      }
      closeModal();
    } catch (err: any) {
      console.error('Error:', err);
      alert('Error: ' + (err.message || 'Failed to save exam'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const courses = storage.getCourses();
      if (editingId) {
        const index = courses.findIndex(c => c.course_id === editingId);
        if (index !== -1) {
          courses[index] = { ...courses[index], ...newCourse };
          storage.setCourses(courses);
          alert('Course updated successfully!');
        }
      } else {
        const id = 'c' + Date.now();
        courses.push({
          ...newCourse,
          course_id: id,
        } as Course);
        storage.setCourses(courses);
        alert('Course added successfully!');
      }
      closeModal();
    } catch (err: any) {
      console.error('Error:', err);
      alert('Error: ' + (err.message || 'Failed to save course'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const questions = storage.getQuestions();
      if (editingId) {
        const index = questions.findIndex(q => q.question_id === editingId);
        if (index !== -1) {
          questions[index] = { ...questions[index], ...newQuestion };
          storage.setQuestions(questions);
          alert('Question updated successfully!');
        }
      } else {
        const id = 'q' + Date.now();
        questions.push({
          ...newQuestion,
          question_id: id,
        } as Question);
        storage.setQuestions(questions);
        alert('Question added successfully!');
      }
      closeModal();
    } catch (err: any) {
      console.error('Error:', err);
      alert('Error: ' + (err.message || 'Failed to save question'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedExamId) return;
    await assignExamToStudents(selectedExamId, selectedStudentIds);
    setShowAssignModal(false);
    setSelectedExamId(null);
    setSelectedStudentIds([]);
  };

  const tabs = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'courses', label: 'Courses', icon: Book },
    { id: 'exams', label: 'Schedule & Assign', icon: ClipboardList },
    { id: 'questions', label: 'Questions', icon: FileQuestion },
    { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
  ];

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-[#1a1a1a] tracking-tight">Admin <span className="italic">Panel</span></h1>
          <p className="text-[#5A5A40] mt-2 italic">Manage your platform resources and users.</p>
        </div>
        <div className="flex gap-4">
          {activeTab !== 'monitoring' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#5A5A40] text-white rounded-full hover:bg-[#4a4a35] transition-all shadow-md"
            >
              <Plus size={18} /> {activeTab === 'exams' ? 'Schedule New Exam' : `Add New ${activeTab.slice(0, -1)}`}
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-3 px-8 py-4 rounded-full transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-[#5A5A40] text-white shadow-lg' 
                : 'bg-white text-[#5A5A40] hover:bg-[#f5f5f0]'
            }`}
          >
            <tab.icon size={20} />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white rounded-[40px] shadow-sm border border-[#5A5A40]/5 overflow-hidden"
        >
          {activeTab === 'monitoring' ? (
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-medium text-[#1a1a1a]">Real-time Activity</h2>
                <div className="flex items-center gap-2 text-green-500 text-sm font-bold animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  LIVE
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#f5f5f0] p-6 rounded-3xl">
                  <p className="text-xs text-[#5A5A40]/60 uppercase tracking-widest font-bold mb-1">Active Attempts</p>
                  <p className="text-3xl font-medium text-[#1a1a1a]">
                    {studentExams.filter(se => se.attempt_status === 'In Progress').length}
                  </p>
                </div>
                <div className="bg-[#f5f5f0] p-6 rounded-3xl">
                  <p className="text-xs text-[#5A5A40]/60 uppercase tracking-widest font-bold mb-1">Completed Today</p>
                  <p className="text-3xl font-medium text-[#1a1a1a]">
                    {results.filter(r => new Date(r.submitted_at).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
                <div className="bg-[#f5f5f0] p-6 rounded-3xl">
                  <p className="text-xs text-[#5A5A40]/60 uppercase tracking-widest font-bold mb-1">Avg. Score</p>
                  <p className="text-3xl font-medium text-[#1a1a1a]">
                    {results.length > 0 ? Math.round(results.reduce((acc, r) => acc + (r.marks_obtained / r.total_marks) * 100, 0) / results.length) + '%' : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#1a1a1a]">Recent Submissions</h3>
                <div className="space-y-3">
                  {results.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()).slice(0, 5).map(result => {
                    const student = students.find(s => s.student_id === result.student_id);
                    const exam = exams.find(e => e.exam_id === result.exam_id);
                    return (
                      <div key={result.result_id} className="flex items-center justify-between p-4 bg-[#f5f5f0]/50 rounded-2xl border border-[#5A5A40]/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#5A5A40] shadow-sm">
                            <Users size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-[#1a1a1a]">{student?.name}</p>
                            <p className="text-xs text-[#5A5A40]/60">{exam?.exam_name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#1a1a1a]">{result.marks_obtained}/{result.total_marks}</p>
                          <p className="text-[10px] text-[#5A5A40]/60">{new Date(result.submitted_at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f5f5f0]/50 border-b border-[#5A5A40]/10">
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#5A5A40]/60">Details</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#5A5A40]/60">Status/Info</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#5A5A40]/60 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A5A40]/5">
                  {activeTab === 'students' && students.map((s) => (
                    <tr key={s.student_id} className="hover:bg-[#f5f5f0]/30 transition-all">
                      <td className="px-8 py-6">
                        <p className="font-semibold text-[#1a1a1a]">{s.name}</p>
                        <p className="text-sm text-[#5A5A40]/60">{s.email}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-[#f5f5f0] text-[#5A5A40] text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {courses.find(c => c.course_id === s.course_id)?.course_name || 'No Course'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setEditingId(s.student_id);
                            setNewStudent({ name: s.name, email: s.email, course_id: s.course_id });
                            setShowAddModal(true);
                          }}
                          className="p-2 text-[#5A5A40] hover:bg-[#f5f5f0] rounded-full transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => {
                          const students = storage.getStudents();
                          const updated = students.filter(st => st.student_id !== s.student_id);
                          storage.setStudents(updated);
                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'courses' && courses.map((c) => (
                    <tr key={c.course_id} className="hover:bg-[#f5f5f0]/30 transition-all">
                      <td className="px-8 py-6">
                        <p className="font-semibold text-[#1a1a1a]">{c.course_name}</p>
                        <p className="text-sm text-[#5A5A40]/60">ID: {c.course_id}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm text-[#5A5A40]">{c.course_duration}</p>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setEditingId(c.course_id);
                            setNewCourse({ course_name: c.course_name, course_duration: c.course_duration });
                            setShowAddModal(true);
                          }}
                          className="p-2 text-[#5A5A40] hover:bg-[#f5f5f0] rounded-full transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => {
                          const courses = storage.getCourses();
                          const updated = courses.filter(crs => crs.course_id !== c.course_id);
                          storage.setCourses(updated);
                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'exams' && exams.map((e) => (
                    <tr key={e.exam_id} className="hover:bg-[#f5f5f0]/30 transition-all">
                      <td className="px-8 py-6">
                        <p className="font-semibold text-[#1a1a1a]">{e.exam_name}</p>
                        <p className="text-sm text-[#5A5A40]/60">{e.exam_date}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm text-[#5A5A40]">{e.exam_duration} Minutes</p>
                        <p className="text-xs text-[#5A5A40]/60 italic">
                          Course: {courses.find(c => c.course_id === e.course_id)?.course_name || 'Unassigned'}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedExamId(e.exam_id);
                            setSelectedStudentIds(studentExams.filter(se => se.exam_id === e.exam_id).map(se => se.student_id));
                            setShowAssignModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                          title="Assign to Students"
                        >
                          <Users size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingId(e.exam_id);
                            setNewExam({ 
                              exam_name: e.exam_name, 
                              exam_date: e.exam_date, 
                              exam_duration: e.exam_duration, 
                              course_id: e.course_id 
                            });
                            setShowAddModal(true);
                          }}
                          className="p-2 text-[#5A5A40] hover:bg-[#f5f5f0] rounded-full transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => {
                          const exams = storage.getExams();
                          const updated = exams.filter(ex => ex.exam_id !== e.exam_id);
                          storage.setExams(updated);
                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'questions' && questions.map((q) => (
                    <tr key={q.question_id} className="hover:bg-[#f5f5f0]/30 transition-all">
                      <td className="px-8 py-6 max-w-md">
                        <p className="font-semibold text-[#1a1a1a] truncate">{q.question_text}</p>
                        <p className="text-sm text-[#5A5A40]/60">Exam: {exams.find(e => e.exam_id === q.exam_id)?.exam_name}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          Correct: {q.correct_option.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setEditingId(q.question_id);
                            setNewQuestion({
                              question_text: q.question_text,
                              option_a: q.option_a,
                              option_b: q.option_b,
                              option_c: q.option_c,
                              option_d: q.option_d,
                              correct_option: q.correct_option,
                              exam_id: q.exam_id
                            });
                            setShowAddModal(true);
                          }}
                          className="p-2 text-[#5A5A40] hover:bg-[#f5f5f0] rounded-full transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => {
                          const questions = storage.getQuestions();
                          const updated = questions.filter(qst => qst.question_id !== q.question_id);
                          storage.setQuestions(updated);
                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add Modals */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-[32px] max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-medium text-[#1a1a1a] mb-6">
              {editingId ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
            </h3>
            
            {activeTab === 'students' && (
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#5A5A40] mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={newStudent.name}
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5A5A40] mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={newStudent.email}
                    onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5A5A40] mb-1">Course</label>
                  <select 
                    value={newStudent.course_id}
                    onChange={e => setNewStudent({...newStudent, course_id: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  >
                    {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
                  </select>
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={closeModal} disabled={isLoading} className="flex-1 py-3 rounded-full border border-[#5A5A40]/20 text-[#5A5A40] disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-full bg-[#5A5A40] text-white shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{editingId ? 'Update' : 'Add'} Student</>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'exams' && (
              <form onSubmit={handleAddExam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#5A5A40] mb-1">Exam Name</label>
                  <input 
                    type="text" 
                    required
                    value={newExam.exam_name}
                    onChange={e => setNewExam({...newExam, exam_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#5A5A40] mb-1">Date</label>
                    <input 
                      type="date" 
                      required
                      value={newExam.exam_date}
                      onChange={e => setNewExam({...newExam, exam_date: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5A5A40] mb-1">Duration (Min)</label>
                    <input 
                      type="number" 
                      required
                      value={newExam.exam_duration}
                      onChange={e => setNewExam({...newExam, exam_duration: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5A5A40] mb-1">Assign to Course</label>
                  <select 
                    value={newExam.course_id}
                    onChange={e => setNewExam({...newExam, course_id: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  >
                    {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
                  </select>
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={closeModal} disabled={isLoading} className="flex-1 py-3 rounded-full border border-[#5A5A40]/20 text-[#5A5A40] disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-full bg-[#5A5A40] text-white shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{editingId ? 'Update' : 'Schedule & Assign'}</>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'courses' && (
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#5A5A40] mb-1">Course Name</label>
                  <input 
                    type="text" 
                    required
                    value={newCourse.course_name}
                    onChange={e => setNewCourse({...newCourse, course_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5A5A40] mb-1">Duration (e.g. 6 Months)</label>
                  <input 
                    type="text" 
                    required
                    value={newCourse.course_duration}
                    onChange={e => setNewCourse({...newCourse, course_duration: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={closeModal} disabled={isLoading} className="flex-1 py-3 rounded-full border border-[#5A5A40]/20 text-[#5A5A40] disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-full bg-[#5A5A40] text-white shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{editingId ? 'Update' : 'Add'} Course</>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'questions' && (
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#5A5A40] mb-1">Question Text</label>
                  <textarea 
                    required
                    value={newQuestion.question_text}
                    onChange={e => setNewQuestion({...newQuestion, question_text: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40] min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#5A5A40] mb-1">Option A</label>
                    <input type="text" required value={newQuestion.option_a} onChange={e => setNewQuestion({...newQuestion, option_a: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5A5A40] mb-1">Option B</label>
                    <input type="text" required value={newQuestion.option_b} onChange={e => setNewQuestion({...newQuestion, option_b: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5A5A40] mb-1">Option C</label>
                    <input type="text" required value={newQuestion.option_c} onChange={e => setNewQuestion({...newQuestion, option_c: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5A5A40] mb-1">Option D</label>
                    <input type="text" required value={newQuestion.option_d} onChange={e => setNewQuestion({...newQuestion, option_d: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#5A5A40] mb-1">Correct Option</label>
                    <select value={newQuestion.correct_option} onChange={e => setNewQuestion({...newQuestion, correct_option: e.target.value as any})} className="w-full px-4 py-3 rounded-xl bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]">
                      <option value="a">A</option>
                      <option value="b">B</option>
                      <option value="c">C</option>
                      <option value="d">D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5A5A40] mb-1">Assign to Exam</label>
                    <select value={newQuestion.exam_id} onChange={e => setNewQuestion({...newQuestion, exam_id: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-[#f5f5f0] border-none outline-none focus:ring-2 focus:ring-[#5A5A40]">
                      <option value="">Select Exam</option>
                      {exams.map(e => <option key={e.exam_id} value={e.exam_id}>{e.exam_name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={closeModal} disabled={isLoading} className="flex-1 py-3 rounded-full border border-[#5A5A40]/20 text-[#5A5A40] disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-full bg-[#5A5A40] text-white shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{editingId ? 'Update' : 'Add'} Question</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Assign Students Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-[32px] max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-medium text-[#1a1a1a] mb-2">Assign Students</h3>
            <p className="text-sm text-[#5A5A40]/60 italic mb-6">
              Exam: {exams.find(e => e.exam_id === selectedExamId)?.exam_name}
            </p>

            <div className="max-h-[300px] overflow-y-auto space-y-2 mb-8 pr-2">
              {students.filter(s => !s.isAdmin).map(student => (
                <label key={student.student_id} className="flex items-center gap-3 p-3 bg-[#f5f5f0] rounded-xl cursor-pointer hover:bg-[#eaeaE0] transition-all">
                  <input 
                    type="checkbox"
                    checked={selectedStudentIds.includes(student.student_id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudentIds([...selectedStudentIds, student.student_id]);
                      } else {
                        setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.student_id));
                      }
                    }}
                    className="w-5 h-5 accent-[#5A5A40]"
                  />
                  <div>
                    <p className="font-medium text-[#1a1a1a]">{student.name}</p>
                    <p className="text-xs text-[#5A5A40]/60">{student.email}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedExamId(null);
                  setSelectedStudentIds([]);
                }} 
                className="flex-1 py-3 rounded-full border border-[#5A5A40]/20 text-[#5A5A40]"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleAssign}
                className="flex-1 py-3 rounded-full bg-[#5A5A40] text-white shadow-md"
              >
                Assign Selected
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

