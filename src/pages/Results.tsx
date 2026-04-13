import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { FileText, Award, Calendar, ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Results() {
  const { currentUser, results, exams } = useApp();

  const studentResults = results
    .filter(r => r.student_id === currentUser?.student_id)
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-light text-[#1a1a1a] tracking-tight">Your <span className="italic">Results</span></h1>
        <p className="text-[#5A5A40] mt-2 italic">A detailed history of your examination performance.</p>
      </header>

      <div className="space-y-6">
        {studentResults.map((result, idx) => {
          const exam = exams.find(e => e.exam_id === result.exam_id);
          const percentage = Math.round((result.marks_obtained / result.total_marks) * 100);
          
          return (
            <motion.div
              key={result.result_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-8 rounded-[32px] shadow-sm border border-[#5A5A40]/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${result.exam_status === 'Pass' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  <Award size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1a1a1a]">{exam?.exam_name || 'Unknown Exam'}</h3>
                  <div className="flex items-center gap-4 text-[#5A5A40]/60 text-sm italic mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(result.submitted_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText size={14} />
                      <span>{result.total_marks} Questions</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-3xl font-medium text-[#1a1a1a]">{result.marks_obtained} / {result.total_marks}</p>
                  <p className={`text-xs font-bold uppercase tracking-widest ${result.exam_status === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                    {result.exam_status} ({percentage}%)
                  </p>
                </div>
                <Link 
                  to={`/result/${result.result_id}`}
                  className="p-4 bg-[#f5f5f0] text-[#5A5A40] rounded-full hover:bg-[#5A5A40] hover:text-white transition-all shadow-sm"
                >
                  <ChevronRight size={24} />
                </Link>
              </div>
            </motion.div>
          );
        })}

        {studentResults.length === 0 && (
          <div className="bg-white p-20 rounded-[40px] text-center border border-dashed border-[#5A5A40]/20">
            <AlertCircle className="mx-auto text-[#5A5A40]/20 mb-4" size={48} />
            <h3 className="text-xl text-[#5A5A40]/60 italic">You haven't attempted any exams yet.</h3>
            <Link to="/exams" className="mt-6 inline-block px-8 py-3 bg-[#5A5A40] text-white rounded-full hover:bg-[#4a4a35] transition-all shadow-md">
              Browse Exams
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
