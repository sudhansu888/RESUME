import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useResume } from '../context/ResumeContext';
import { audioEngine } from '../utils/audioEngine';

export default function CyberTerminal({ isOpen, onClose, onOpenResumeModal }) {
  const { resumeData, setIsEditorOpen, setIsAppearanceOpen } = useResume();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'CYBER-OS v4.2 [ONLINE]' },
    { type: 'system', text: 'Type "help" to view available terminal commands.' },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      audioEngine.playClick();
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key !== 'Enter' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
      audioEngine.playTerminalKeystroke();
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIdx < commandHistory.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const rawCmd = inputVal.trim();
      if (!rawCmd) return;

      audioEngine.playClick();
      setCommandHistory((prev) => [...prev, rawCmd]);
      setHistoryIdx(-1);

      const cmd = rawCmd.toLowerCase();
      const newEntries = [{ type: 'user', text: `shyamal@cybercore:~$ ${rawCmd}` }];

      switch (cmd) {
        case 'help':
          newEntries.push({
            type: 'output',
            text: `Available Commands:
  • edit      - Open Live Resume Studio & Content Editor
  • theme     - Open Appearance & Theme Palette Studio
  • bio       - Display developer summary & core focus
  • skills    - List top engineering proficiencies
  • projects  - Explore highlighted production projects
  • resume    - Open ATS Resume Studio & 1-Click PDF export
  • stats     - Show telemetry & experience statistics
  • contact   - Output direct communication channels
  • confetti  - Trigger celebratory spatial particle burst
  • clear     - Purge terminal buffer
  • exit      - Disengage terminal HUD`
          });
          break;

        case 'edit':
        case 'editor':
        case 'studio':
          newEntries.push({
            type: 'output',
            text: 'Opening Live Resume Studio & Content Editor...'
          });
          setTimeout(() => {
            onClose();
            setIsEditorOpen(true);
          }, 300);
          break;

        case 'theme':
        case 'appearance':
          newEntries.push({
            type: 'output',
            text: 'Opening Appearance & Theme Palette Studio...'
          });
          setTimeout(() => {
            onClose();
            setIsAppearanceOpen(true);
          }, 300);
          break;

        case 'resume':
        case 'pdf':
          newEntries.push({
            type: 'output',
            text: 'Opening ATS Resume Studio & 1-Click PDF Export...'
          });
          if (onOpenResumeModal) {
            setTimeout(() => {
              onClose();
              onOpenResumeModal();
            }, 300);
          }
          break;

        case 'bio':
          newEntries.push({
            type: 'output',
            text: `${resumeData.profile.name} — ${resumeData.profile.title}
Status: ${resumeData.profile.status}
Location: ${resumeData.profile.location}

Bio: ${resumeData.profile.bio}`
          });
          break;

        case 'skills':
          {
            const skillSummary = resumeData.skills.map(s => 
              `[${s.category}]\n` + s.items.map(item => `  - ${item.name} (${item.level}%)`).join('\n')
            ).join('\n\n');
            newEntries.push({ type: 'output', text: skillSummary });
          }
          break;

        case 'projects':
          {
            const projSummary = resumeData.projects.map((p, i) => 
              `${i + 1}. ${p.title} [${p.category}]\n   ${p.tagline}\n   Tech: ${p.tech ? p.tech.join(', ') : ''}`
            ).join('\n\n');
            newEntries.push({ type: 'output', text: projSummary });
          }
          break;

        case 'stats':
          {
            const statsSummary = resumeData.profile.stats.map(s => `• ${s.label}: ${s.value}`).join('\n');
            newEntries.push({ type: 'output', text: `Telemetry Metrics:\n${statsSummary}` });
          }
          break;

        case 'contact':
          newEntries.push({
            type: 'output',
            text: `Reach out directly:
• Email:    ${resumeData.profile.email}
• GitHub:   ${resumeData.profile.github}
• LinkedIn: ${resumeData.profile.linkedin}
• X/Twitter: ${resumeData.profile.twitter || 'N/A'}`
          });
          break;

        case 'confetti':
        case 'celebrate':
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#3b82f6', '#8b5cf6', '#ec4899']
          });
          newEntries.push({ type: 'output', text: '⚡ Sparking quantum confetti particle field!' });
          break;

        case 'clear':
          setHistory([]);
          setInputVal('');
          return;

        case 'exit':
        case 'quit':
          onClose();
          setInputVal('');
          return;

        default:
          newEntries.push({
            type: 'error',
            text: `Command not recognized: "${rawCmd}". Type "help" for a list of valid commands.`
          });
          break;
      }

      setHistory((prev) => [...prev, ...newEntries]);
      setInputVal('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md transition-all">
      <div 
        className={`glass-panel border border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
          isExpanded ? 'w-full h-[90vh]' : 'w-full max-w-2xl h-[520px]'
        }`}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-cyan-500/20 select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer hover:opacity-100" onClick={onClose} />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="flex items-center gap-1.5 ml-3 text-xs font-mono text-cyan-400">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>cybercore-hud // {resumeData.profile.name?.toLowerCase() || 'shyamal'}@bash</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-400 hover:text-cyan-300 p-1 rounded transition-colors"
              title={isExpanded ? "Restore" : "Maximize"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors"
              title="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-2 bg-slate-950/90 scanline-effect text-slate-200"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, idx) => (
            <div key={idx} className="leading-relaxed whitespace-pre-wrap">
              {item.type === 'system' && (
                <div className="text-cyan-400/90 font-semibold">{item.text}</div>
              )}
              {item.type === 'user' && (
                <div className="text-emerald-400 font-medium">{item.text}</div>
              )}
              {item.type === 'output' && (
                <div className="text-slate-300 pl-2 border-l border-cyan-500/30">{item.text}</div>
              )}
              {item.type === 'error' && (
                <div className="text-rose-400">{item.text}</div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Command Input Bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/95 border-t border-cyan-500/20">
          <span className="text-cyan-400 font-mono text-xs sm:text-sm font-semibold select-none">
            {resumeData.profile.name?.toLowerCase() || 'shyamal'}@cybercore:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent font-mono text-sm text-cyan-200 focus:outline-none placeholder:text-slate-600"
            placeholder="type 'edit', 'theme', 'help', 'skills'..."
            autoFocus
          />
          <button
            onClick={() => handleCommand({ key: 'Enter', preventDefault: () => {} })}
            className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-mono flex items-center gap-1 transition"
          >
            <Send className="w-3 h-3" />
            <span className="hidden sm:inline">Exec</span>
          </button>
        </div>
      </div>
    </div>
  );
}
