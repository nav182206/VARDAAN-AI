import React, { useState } from 'react';
import { generatePracticeTest } from '../services/geminiService';
import { Language, SUBJECTS } from '../types';
import { BookOpen, Check, X, Loader2, Award } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Props {
  language: Language;
}

const PracticeTest: React.FC<Props> = ({ language }) => {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTest = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setSubmitted(false);
    setAnswers([]);
    const result = await generatePracticeTest(subject, topic, language);
    setQuestions(result);
    setAnswers(new Array(result.length).fill(''));
    setIsLoading(false);
  };

  const handleAnswerChange = (qIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = questions.reduce((acc, q, i) => acc + (q.correctAnswer === answers[i] ? 1 : 0), 0);

  return (
    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm w-full mt-10">
      <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
        <BookOpen className="w-7 h-7 text-purple-500" />
        AI-Powered Practice Tests
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Subject</label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value as any)} 
              className="mt-2 w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-purple-50 focus:border-purple-500 outline-none transition-all"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Topic</label>
            <input 
              type="text" 
              placeholder="e.g., Thermodynamics" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              className="mt-2 w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-purple-50 focus:border-purple-500 outline-none transition-all"
            />
          </div>
        </div>
        <button 
          onClick={handleStartTest} 
          disabled={isLoading || !topic.trim()} 
          className="w-full bg-purple-500 text-white px-8 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <>Start Test</>}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="mt-10">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="font-bold text-slate-800 mb-4">{qIndex + 1}. {q.question}</p>
              <div className="space-y-3">
                {q.options.map((option, oIndex) => (
                  <label key={oIndex} className={`flex items-center p-4 rounded-xl cursor-pointer border-2 ${submitted ? (option === q.correctAnswer ? 'border-emerald-400 bg-emerald-50' : (answers[qIndex] === option ? 'border-rose-400 bg-rose-50' : 'border-slate-200')) : (answers[qIndex] === option ? 'border-purple-400 bg-purple-50' : 'border-slate-200')}`}>
                    <input 
                      type="radio" 
                      name={`q-${qIndex}`} 
                      value={option} 
                      checked={answers[qIndex] === option} 
                      onChange={() => handleAnswerChange(qIndex, option)} 
                      disabled={submitted} 
                      className="mr-4"
                    />
                    <span>{option}</span>
                    {submitted && option === q.correctAnswer && <Check className="ml-auto w-5 h-5 text-emerald-600" />}
                    {submitted && answers[qIndex] === option && option !== q.correctAnswer && <X className="ml-auto w-5 h-5 text-rose-600" />}
                  </label>
                ))}
              </div>
            </div>
          ))}
          {!submitted ? (
            <button onClick={handleSubmit} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">Submit Answers</button>
          ) : (
            <div className="mt-10 p-8 bg-purple-50 rounded-3xl border-2 border-purple-200 text-center">
              <Award className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h4 className="text-2xl font-black text-slate-800">Test Complete!</h4>
              <p className="text-lg font-bold text-slate-600">Your score:</p>
              <p className="text-6xl font-black text-purple-600 my-2">{score} / {questions.length}</p>
              <button onClick={handleStartTest} className="mt-6 bg-purple-500 text-white px-8 py-4 rounded-2xl font-black">Try Another Topic</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeTest;
