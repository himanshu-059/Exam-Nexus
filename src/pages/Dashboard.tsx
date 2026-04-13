import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Calendar, Clock, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, exams, results, studentExams } = useApp();

  const availableExams = exams.filter(exam => {
    const isForCourse = exam.course_id === currentUser?.course_id;
    const isAssigned = studentExams.some(se => se.exam_id === exam.exam_id && se.student_id === currentUser?.student_id);
    return isForCourse || isAssigned;
  });
  const attemptedExamsCount = studentExams.filter(se => se.student_id === currentUser?.student_id && se.attempt_status === 'Completed').length;
  const latestResults = results
    .filter(r => r.student_id === currentUser?.student_id)
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 3);

  const stats = [
    { label: 'Available Exams', value: availableExams.length, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'Exams Attempted', value: attemptedExamsCount, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Average Score', value: latestResults.length > 0 ? Math.round(latestResults.reduce((acc, r) => acc + (r.marks_obtained / r.total_marks) * 100, 0) / latestResults.length) + '%' : 'N/A', icon: Award, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-12">
      <header>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-light text-[#1a1a1a] tracking-tight"
        >
          Welcome back, <span className="italic font-normal">{currentUser?.name.split(' ')[0]}</span>
        </motion.h1>
        <p className="text-[#5A5A40] mt-4 text-lg italic">Here is an overview of your academic progress.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-[#5A5A40]/5 flex items-center gap-6"
          >
            <div className={`p-4 rounded-2xl ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm text-[#5A5A40]/60 uppercase tracking-widest font-semibold">{stat.label}</p>
              <p className="text-3xl font-medium text-[#1a1a1a] mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Exams */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-[#1a1a1a]">Upcoming Exams</h2>
            <Link to="/exams" className="text-[#5A5A40] text-sm hover:underline italic">View all</Link>
          </div>
          <div className="space-y-4">
            {availableExams.slice(0, 3).map((exam) => {
              const status = studentExams.find(se => se.exam_id === exam.exam_id && se.student_id === currentUser?.student_id)?.attempt_status || 'Not Attempted';
              const today = new Date().toISOString().split('T')[0];
              const isFuture = exam.exam_date > today;

              return (
                <div key={exam.exam_id} className="bg-white p-6 rounded-3xl border border-[#5A5A40]/5 flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f5f5f0] rounded-2xl flex items-center justify-center text-[#5A5A40]">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1a1a1a]">{exam.exam_name}</h3>
                      <p className="text-sm text-[#5A5A40]/60">{exam.exam_duration} mins • {exam.exam_date}</p>
                    </div>
                  </div>
                  {status === 'Completed' ? (
                    <span className="px-4 py-1.5 bg-green-50 text-green-600 text-xs font-bold rounded-full uppercase tracking-wider">Completed</span>
                  ) : isFuture ? (
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">Scheduled</span>
                  ) : (
                    <Link to={`/exam/${exam.exam_id}`} className="px-6 py-2 bg-[#5A5A40] text-white text-sm rounded-full hover:bg-[#4a4a35] transition-all shadow-sm">
                      Start
                    </Link>
                  )}
                </div>
              );
            })}
            {availableExams.length === 0 && (
              <div className="bg-[#f5f5f0] p-8 rounded-3xl text-center border border-dashed border-[#5A5A40]/20">
                <AlertCircle className="mx-auto text-[#5A5A40]/40 mb-2" size={32} />
                <p className="text-[#5A5A40]/60 italic">No exams available for your course.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Results */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-[#1a1a1a]">Recent Performance</h2>
            <Link to="/results" className="text-[#5A5A40] text-sm hover:underline italic">View all</Link>
          </div>
          <div className="space-y-4">
            {latestResults.map((result) => {
              const exam = exams.find(e => e.exam_id === result.exam_id);
              return (
                <div key={result.result_id} className="bg-white p-6 rounded-3xl border border-[#5A5A40]/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${result.exam_status === 'Pass' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      <Award size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1a1a1a]">{exam?.exam_name}</h3>
                      <p className="text-sm text-[#5A5A40]/60">{new Date(result.submitted_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#1a1a1a]">{result.marks_obtained}/{result.total_marks}</p>
                    <p className={`text-xs font-bold uppercase tracking-wider ${result.exam_status === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>{result.exam_status}</p>
                  </div>
                </div>
              );
            })}
            {latestResults.length === 0 && (
              <div className="bg-[#f5f5f0] p-8 rounded-3xl text-center border border-dashed border-[#5A5A40]/20">
                <AlertCircle className="mx-auto text-[#5A5A40]/40 mb-2" size={32} />
                <p className="text-[#5A5A40]/60 italic">No results to display yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
