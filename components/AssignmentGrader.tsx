import React, { useState } from 'react';
import { Loader2, Sparkles, ClipboardCheck } from 'lucide-react';
import { getRubricFeedback } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const AssignmentGrader: React.FC = () => {
  const [submission, setSubmission] = useState('');
  const [rubric, setRubric] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFeedbackRequest = async () => {
    if (!submission.trim() || !rubric.trim()) {
      alert('Please provide both the assignment submission and the grading rubric.');
      return;
    }
    setIsLoading(true);
    setFeedback(null);
    try {
      const result = await getRubricFeedback(submission, rubric);
      setFeedback(result);
    } catch (error) {
      console.error('Error getting rubric feedback:', error);
      setFeedback('Sorry, an error occurred while generating feedback. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="p-10 h-full overflow-y-auto animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-3xl flex items-center justify-center">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-800">Assignment Feedback</h1>
            <p className="text-slate-500">Get instant, rubric-aware feedback on your work.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Your Submission</h2>
            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Paste your essay, code, or report here..."
              className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Grading Rubric</h2>
            <textarea
              value={rubric}
              onChange={(e) => setRubric(e.target.value)}
              placeholder="Paste the grading criteria or rubric here. For example: 'Clarity: 10 points, Accuracy: 20 points, ...'"
              className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="text-center my-8">
          <button
            onClick={handleFeedbackRequest}
            disabled={isLoading}
            className="bg-indigo-600 text-white font-bold py-4 px-10 rounded-full hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center mx-auto"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Generating Feedback...</>
            ) : (
              <><Sparkles className="w-5 h-5 mr-3" /> Get Feedback</>
            )}
          </button>
        </div>

        {feedback && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Feedback Report</h2>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentGrader;
