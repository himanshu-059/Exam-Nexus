/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  student_id: string;
  name: string;
  email: string;
  phone: string;
  course_id?: string;
  isAdmin?: boolean;
}

export interface Course {
  course_id: string;
  course_name: string;
  course_duration: string;
}

export interface Exam {
  exam_id: string;
  exam_name: string;
  exam_date: string;
  exam_duration: number; // in minutes
  course_id: string;
}

export interface Question {
  question_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'a' | 'b' | 'c' | 'd';
  exam_id: string;
}

export interface Result {
  result_id: string;
  marks_obtained: number;
  total_marks: number;
  exam_status: 'Pass' | 'Fail';
  student_id: string;
  exam_id: string;
  submitted_at: string;
  answers: Record<string, string>; // question_id -> selected_option
}

export interface StudentExam {
  student_id: string;
  exam_id: string;
  attempt_status: 'Not Attempted' | 'In Progress' | 'Completed';
}
