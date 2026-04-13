import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Clock, Calendar, ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Exams() {
  const { currentUser, exams, studentExams } = useApp();

  const availableExams = exams.filter(exam => {
    const isForCourse = exam.course_id === currentUser?.course_id;
    const isAssigned = studentExams.some(se => se.exam_id === exam.exam_id && se.student_id === currentUser?.student_id);
    return isForCourse || isAssigned;
  });

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-light text-[#1a1a1a] tracking-tight">Available <span className="italic">Exams</span></h1>
        <p className="text-[#5A5A40] mt-2 italic">Select an exam to begin. Ensure you have a stable connection.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {availableExams.map((exam, idx) => {
          const attempt = studentExams.find(se => se.exam_id === exam.exam_id && se.student_id === currentUser?.student_id);
          const isCompleted = attempt?.attempt_status === 'Completed';
          
          const today = new Date().toISOString().split('T')[0];
          const isFuture = exam.exam_date > today;

          return (
            <motion.div
              key={exam.exam_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[40px] shadow-sm border border-[#5A5A40]/5 flex flex-col justify-between group hover:shadow-xl transition-all duration-500"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-[#f5f5f0] rounded-2xl flex items-center justify-center text-[#5A5A40] group-hover:bg-[#5A5A40] group-hover:text-white transition-all duration-500">
                    <Calendar size={28} />
                  </div>
                  {isCompleted ? (
                    <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-widest">Completed</span>
                  ) : isFuture ? (
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-widest">Scheduled</span>
                  ) : null}
                </div>
                <h3 className="text-2xl font-medium text-[#1a1a1a] mb-2">{exam.exam_name}</h3>
                <div className="flex items-center gap-6 text-[#5A5A40]/60 text-sm italic mb-8">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{exam.exam_duration} Minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{exam.exam_date}</span>
                  </div>
                </div>
              </div>

              {isCompleted ? (
                <Link to="/results" className="w-full py-4 rounded-full border border-[#5A5A40]/20 text-[#5A5A40] font-medium text-center hover:bg-[#f5f5f0] transition-all">
                  View Result
                </Link>
              ) : isFuture ? (
                <button disabled className="w-full py-4 rounded-full bg-[#f5f5f0] text-[#5A5A40]/40 font-medium text-center cursor-not-allowed">
                  Not Available Yet
                </button>
              ) : (
                <Link to={`/exam/${exam.exam_id}`} className="w-full py-4 rounded-full bg-[#5A5A40] text-white font-medium text-center hover:bg-[#4a4a35] transition-all shadow-md flex items-center justify-center gap-2">
                  Start Examination <ChevronRight size={18} />
                </Link>
              )}
            </motion.div>
          );
        })}

        {availableExams.length === 0 && (
          <div className="col-span-full bg-white p-20 rounded-[40px] text-center border border-dashed border-[#5A5A40]/20">
            <AlertCircle className="mx-auto text-[#5A5A40]/20 mb-4" size={48} />
            <h3 className="text-xl text-[#5A5A40]/60 italic">No exams found for your current course.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
