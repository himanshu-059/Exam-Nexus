import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronRight, ChevronLeft, Send, AlertTriangle } from 'lucide-react';
import { Result } from '../types';

export default function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { exams, questions, currentUser, addResult, studentExams, updateStudentExamStatus } = useApp();

  const exam = exams.find(e => e.exam_id === examId);
  const examQuestions = questions.filter(q => q.exam_id === examId);
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!exam || !currentUser) {
      navigate('/dashboard');
      return;
    }

    // Check if already attempted
    const attempt = studentExams.find(se => se.exam_id === examId && se.student_id === currentUser.student_id);
    if (attempt?.attempt_status === 'Completed') {
      navigate('/results');
      return;
    }

    // Mark as In Progress
    updateStudentExamStatus(examId!, 'In Progress');

    setTimeLeft(exam.exam_duration * 60);
  }, [exam, currentUser, examId, studentExams, navigate]);


  useEffect(() => {
    if (timeLeft <= 0 && exam) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, exam]);

  const handleSelectOption = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [examQuestions[currentQuestionIdx].question_id]: option
    }));
  };

  const handleSubmit = () => {
    if (!exam || !currentUser) return;
    setIsSubmitting(true);

    let score = 0;
    examQuestions.forEach(q => {
      if (answers[q.question_id] === q.correct_option) {
        score++;
      }
    });

    const passMarks = Math.ceil(examQuestions.length * 0.4);
    const result: Result = {
      result_id: 'r' + Date.now(),
      student_id: currentUser.student_id,
      exam_id: exam.exam_id,
      marks_obtained: score,
      total_marks: examQuestions.length,
      exam_status: score >= passMarks ? 'Pass' : 'Fail',
      submitted_at: new Date().toISOString(),
      answers: answers
    };

    addResult(result);
    setTimeout(() => {
      navigate(`/result/${result.result_id}`);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!exam || examQuestions.length === 0) return null;

  const currentQuestion = examQuestions[currentQuestionIdx];
  const progress = ((currentQuestionIdx + 1) / examQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-serif p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="bg-white p-6 rounded-[32px] shadow-sm border border-[#5A5A40]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-[#1a1a1a]">{exam.exam_name}</h1>
            <p className="text-sm text-[#5A5A40]/60 italic">Question {currentQuestionIdx + 1} of {examQuestions.length}</p>
          </div>
          <div className="flex items-center gap-4 bg-[#f5f5f0] px-6 py-3 rounded-full">
            <Clock className={timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-[#5A5A40]'} size={20} />
            <span className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-[#1a1a1a]'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-[#5A5A40]/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-[#5A5A40]"
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 md:p-12 rounded-[40px] shadow-lg border border-[#5A5A40]/5 min-h-[400px] flex flex-col"
          >
            <div className="flex-1">
              <h2 className="text-2xl text-[#1a1a1a] leading-relaxed mb-10">
                {currentQuestion.question_text}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['a', 'b', 'c', 'd'].map((opt) => {
                  const optionKey = `option_${opt}` as keyof typeof currentQuestion;
                  const isSelected = answers[currentQuestion.question_id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-6 rounded-3xl text-left transition-all border-2 flex items-center gap-4 ${
                        isSelected 
                          ? 'border-[#5A5A40] bg-[#5A5A40]/5 shadow-inner' 
                          : 'border-transparent bg-[#f5f5f0] hover:bg-[#eaeaE0]'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isSelected ? 'bg-[#5A5A40] text-white' : 'bg-white text-[#5A5A40]'
                      }`}>
                        {opt.toUpperCase()}
                      </span>
                      <span className="text-[#1a1a1a] font-medium">{currentQuestion[optionKey] as string}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 flex items-center justify-between">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-[#5A5A40] hover:bg-[#f5f5f0] disabled:opacity-30 transition-all font-medium"
              >
                <ChevronLeft size={20} /> Previous
              </button>

              {currentQuestionIdx === examQuestions.length - 1 ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#5A5A40] text-white shadow-md hover:bg-[#4a4a35] transition-all font-medium"
                >
                  <Send size={18} /> Submit Exam
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#5A5A40] text-white shadow-md hover:bg-[#4a4a35] transition-all font-medium"
                >
                  Next <ChevronRight size={20} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirm && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-8 rounded-[32px] max-w-md w-full shadow-2xl text-center"
              >
                <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-2xl font-medium text-[#1a1a1a] mb-2">Finish Exam?</h3>
                <p className="text-[#5A5A40]/70 italic mb-8">
                  You have answered {Object.keys(answers).length} out of {examQuestions.length} questions. Are you sure you want to submit?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-4 rounded-full border border-[#5A5A40]/20 text-[#5A5A40] font-medium hover:bg-[#f5f5f0] transition-all"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-4 rounded-full bg-[#5A5A40] text-white font-medium hover:bg-[#4a4a35] transition-all shadow-md"
                  >
                    Yes, Submit
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Submitting Overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 border-4 border-[#5A5A40]/10 border-t-[#5A5A40] rounded-full mb-6"
              />
              <h2 className="text-2xl font-light text-[#1a1a1a] italic">Evaluating your performance...</h2>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
