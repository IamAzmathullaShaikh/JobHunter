import React, { useState } from 'react';
import { FileSignature, Sparkles, Loader2, Check, Copy } from 'lucide-react';
import EngineStatusChip from './EngineStatusChip.tsx';

export default function CoverLetterEngine({ resumeText }: { resumeText: string }) {
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [copied, setCopied] = useState(false);
  const [meta, setMeta] = useState<any>(null);

  const generateLetter = async () => {
    if (!resumeText || !jobDescription) return;
    setIsGenerating(true);
    try {
      const response = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription })
      });
      const data = await response.json();
      setCoverLetter(data.data);
      setMeta(data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileSignature className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Tiered Cover Letter Engine</h2>
          </div>
          {meta && <EngineStatusChip source={meta.source} latency={meta.latency} />}
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Target Job Description</label>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-800 px-2 py-0.5 rounded">Context limit: 8k chars</span>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here..."
              className="w-full h-[400px] bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:border-indigo-500 outline-none transition-all resize-none font-sans leading-relaxed"
            />
            <button
              onClick={generateLetter}
              disabled={isGenerating || !resumeText || !jobDescription}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 transition-all uppercase tracking-widest text-sm"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Cover Letter
            </button>
          </div>

          <div className="space-y-4 flex flex-col">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Generated Draft</h3>
              {coverLetter && (
                <button
                  onClick={copyText}
                  className="text-[10px] font-bold bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all text-white"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy Draft"}
                </button>
              )}
            </div>
            <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-3xl p-6 overflow-y-auto max-h-[500px]">
              {coverLetter ? (
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {coverLetter}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <FileSignature className="w-12 h-12" />
                  <p className="text-xs font-bold uppercase tracking-tighter max-w-[250px]">Your tailored cover letter will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}