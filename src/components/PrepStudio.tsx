import React, { useState } from 'react';
import { Brain, MessageSquare, Code, Mic, Loader2, Play } from 'lucide-react';
import EngineStatusChip from './EngineStatusChip.tsx';

export default function PrepStudio({ resumeText }: { resumeText: string }) {
  const [activeModule, setActiveModule] = useState<"behavioral" | "technical" | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [meta, setMeta] = useState<any>(null);

  const generateQuestion = async () => {
    if (!activeModule) return;
    setIsProcessing(true);
    setAnswer("");
    setFeedback("");
    try {
      const response = await fetch("/api/prep/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: resumeText, type: activeModule })
      });
      const data = await response.json();
      setQuestion(data.data);
      setMeta(data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!question || !answer) return;
    setIsProcessing(true);
    try {
      const response = await fetch("/api/prep/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, type: activeModule })
      });
      const data = await response.json();
      setFeedback(data.data);
      setMeta(data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
       <div className="flex items-center gap-4 mb-8">
          <Brain className="w-8 h-8 text-purple-400" />
          <h2 className="text-xl font-black text-white">Interview Prep Studio</h2>
       </div>

       {!activeModule ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div 
               onClick={() => setActiveModule("behavioral")}
               className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-all cursor-pointer">
               <h3 className="font-bold text-indigo-400 mb-2 uppercase tracking-widest text-[10px]">Behavioral</h3>
               <p className="text-sm text-white font-bold mb-2">STAR Method Master</p>
               <p className="text-xs text-slate-400">Practice common culture-fit questions with AI feedback.</p>
            </div>
            <div 
               onClick={() => setActiveModule("technical")}
               className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all cursor-pointer">
               <h3 className="font-bold text-emerald-400 mb-2 uppercase tracking-widest text-[10px]">Technical</h3>
               <p className="text-sm text-white font-bold mb-2">System Design & DSA</p>
               <p className="text-xs text-slate-400">Deep dives into stack-specific concepts and coding challenges.</p>
            </div>
         </div>
       ) : (
         <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => { setActiveModule(null); setQuestion(""); setAnswer(""); setFeedback(""); }}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Modules
              </button>
              {meta && <EngineStatusChip source={meta.source} latency={meta.latency} />}
            </div>
            
            {!question ? (
              <div className="text-center py-12 space-y-6">
                 {activeModule === "behavioral" ? <MessageSquare className="w-12 h-12 text-indigo-500 mx-auto" /> : <Code className="w-12 h-12 text-emerald-500 mx-auto" />}
                 <div>
                   <h3 className="text-lg font-bold text-white mb-2">{activeModule === "behavioral" ? "STAR Method Practice" : "Technical Challenge"}</h3>
                   <p className="text-sm text-slate-400 max-w-md mx-auto">
                     The AI will generate a tailored question based on your resume experience.
                   </p>
                 </div>
                 <button
                    onClick={generateQuestion}
                    disabled={isProcessing}
                    className={`px-6 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 mx-auto transition-all ${activeModule === "behavioral" ? "bg-indigo-600 hover:bg-indigo-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
                 >
                   {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                   Generate Question
                 </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className={`text-xs font-bold uppercase tracking-widest ${activeModule === "behavioral" ? "text-indigo-400" : "text-emerald-400"}`}>Question</h4>
                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {question}
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-6">Your Answer</h4>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-[200px] bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 focus:border-indigo-500 outline-none transition-all resize-none"
                  />
                  <button
                    onClick={evaluateAnswer}
                    disabled={isProcessing || !answer.trim()}
                    className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${activeModule === "behavioral" ? "bg-indigo-600 hover:bg-indigo-500" : "bg-emerald-600 hover:bg-emerald-500"} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    Evaluate Answer
                  </button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400">AI Feedback</h4>
                  <div className="bg-slate-950/50 h-full min-h-[300px] border border-slate-800 rounded-2xl p-6 overflow-y-auto">
                    {feedback ? (
                      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {feedback}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-50">
                        <Brain className="w-8 h-8" />
                        <p className="text-xs font-bold uppercase tracking-widest text-center">Feedback will appear here after evaluation</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
         </div>
       )}
    </div>
  );
}