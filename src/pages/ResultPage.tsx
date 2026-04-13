import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Award, CheckCircle2, XCircle, ArrowLeft, RotateCcw } from 'lucide-react';

export default function ResultPage() {
  const { resultId } = useParams();
  const { results, exams, questions } = useApp();

  const result = results.find(r => r.result_id === resultId);
  const exam = exams.find(e => e.exam_id === result?.exam_id);
  const examQuestions = questions.filter(q => q.exam_id === result?.exam_id);

  if (!result || !exam) return null;

  const percentage = Math.round((result.marks_obtained / result.total_marks) * 100);

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-[#1a1a1a] tracking-tight">Exam <span className="italic">Result</span></h1>
          <p className="text-[#5A5A40] mt-2 italic">{exam.exam_name}</p>
        </div>
        <Link to="/dashboard" className="flex items-center gap-2 text-[#5A5A40] hover:underline italic">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 bg-white p-10 rounded-[40px] shadow-xl border border-[#5A5A40]/5 text-center flex flex-col items-center justify-center"
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${result.exam_status === 'Pass' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            <Award size={48} />
          </div>
          <h2 className={`text-5xl font-bold mb-2 ${result.exam_status === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
            {result.exam_status}
          </h2>
          <p className="text-[#5A5A40]/60 uppercase tracking-widest font-bold text-sm mb-8">Overall Performance</p>
          
          <div className="w-full space-y-6">
            <div className="flex justify-between items-center px-4">
              <span className="text-[#5A5A40] italic">Score</span>
              <span className="text-2xl font-medium text-[#1a1a1a]">{result.marks_obtained} / {result.total_marks}</span>
            </div>
            <div className="flex justify-between items-center px-4">
              <span className="text-[#5A5A40] italic">Percentage</span>
              <span className="text-2xl font-medium text-[#1a1a1a]">{percentage}%</span>
            </div>
            <div className="flex justify-between items-center px-4">
              <span className="text-[#5A5A40] italic">Time Spent</span>
              <span className="text-2xl font-medium text-[#1a1a1a]">--</span>
            </div>
          </div>

          <Link to="/exams" className="mt-12 w-full py-4 rounded-full bg-[#5A5A40] text-white font-medium hover:bg-[#4a4a35] transition-all flex items-center justify-center gap-2 shadow-md">
            <RotateCcw size={18} /> Try Another Exam
          </Link>
        </motion.div>

        {/* Question Review */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-medium text-[#1a1a1a]">Review Answers</h3>
          <div className="space-y-4">
            {examQuestions.map((q, idx) => {
              const selectedOpt = result.answers[q.question_id];
              const isCorrect = selectedOpt === q.correct_option;
              return (
                <div key={q.question_id} className="bg-white p-8 rounded-3xl border border-[#5A5A40]/5 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <span className="text-[#5A5A40]/40 font-bold text-xl">{idx + 1}.</span>
                      <p className="text-[#1a1a1a] text-lg leading-relaxed">{q.question_text}</p>
                    </div>
                    {isCorrect ? (
                      <CheckCircle2 className="text-green-500 shrink-0" size={24} />
                    ) : (
                      <XCircle className="text-red-500 shrink-0" size={24} />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['a', 'b', 'c', 'd'].map((opt) => {
                      const optionKey = `option_${opt}` as keyof typeof q;
                      const isSelected = selectedOpt === opt;
                      const isCorrectOpt = q.correct_option === opt;
                      
                      let bgColor = 'bg-[#f5f5f0]';
                      let textColor = 'text-[#1a1a1a]';
                      let borderColor = 'border-transparent';

                      if (isSelected && isCorrect) {
                        bgColor = 'bg-green-50';
                        borderColor = 'border-green-200';
                      } else if (isSelected && !isCorrect) {
                        bgColor = 'bg-red-50';
                        borderColor = 'border-red-200';
                      } else if (isCorrectOpt) {
                        bgColor = 'bg-green-50';
                        borderColor = 'border-green-200';
                      }

                      return (
                        <div key={opt} className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${bgColor} ${borderColor}`}>
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCorrectOpt ? 'bg-green-500 text-white' : (isSelected ? 'bg-red-500 text-white' : 'bg-white text-[#5A5A40]')
                          }`}>
                            {opt.toUpperCase()}
                          </span>
                          <span className={`text-sm font-medium ${textColor}`}>{q[optionKey] as string}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
