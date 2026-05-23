import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bookmark, Play, Pause } from "lucide-react";
import { getStory, speak } from "@/lib/eduData";
import { getChild, setChild } from "@/lib/storage";

export const Route = createFileRoute("/module/stories/story/$storyId")({ component: StoryReader });

function StoryReader() {
  const { storyId } = useParams({ from: "/module/stories/story/$storyId" });
  const story = getStory(storyId);
  const nav = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [activeWord, setActiveWord] = useState(-1);
  const [speed, setSpeed] = useState<0.7 | 1 | 1.3>(1);

  if (!story) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#FFF9F0]">
        <p className="font-bold">Histoire introuvable</p>
      </div>
    );
  }

  const words = story.content.split(/\s+/);

  function play() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(story!.content);
    u.lang = "fr-FR"; u.rate = speed; u.pitch = 1.1;
    let idx = 0;
    u.onboundary = (e) => { if (e.name === "word") { setActiveWord(idx); idx++; } };
    u.onend = () => { setPlaying(false); setActiveWord(-1); };
    window.speechSynthesis.speak(u);
    setPlaying(true);
  }
  function pause() {
    window.speechSynthesis?.cancel();
    setPlaying(false);
  }
  function cycleSpeed() {
    setSpeed((s) => (s === 1 ? 0.7 : s === 0.7 ? 1.3 : 1));
  }
  function finish() {
    const c = getChild();
    setChild({
      stars: c.stars + story!.stars,
      progress: { ...c.progress, stories: Math.min(100, c.progress.stories + 8) },
      activities: [{ id: Date.now().toString(), moduleId: "stories", title: `Histoire : ${story!.title}`, starsEarned: story!.stars, timestamp: new Date().toISOString() }, ...c.activities].slice(0, 20),
    });
    nav({ to: "/victory", search: { moduleName: "Histoires", starsEarned: story!.stars, achievementText: `Tu as lu "${story!.title}" !`, nextRoute: "/module/stories" } });
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-32">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/module/stories" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="font-bold text-[16px] text-[#1A1A2E] truncate max-w-[60%]">{story.title}</h1>
        <button><Bookmark size={22} color="#9CA3AF" /></button>
      </header>

      <div className="mx-4 mt-4 rounded-[24px] p-6 text-center" style={{ background: story.bg, minHeight: 180 }}>
        <div className="text-[64px] leading-none">{story.emoji}</div>
        <h2 className="mt-3 font-black text-[22px] text-[#1A1A2E]">{story.title}</h2>
        <span className="inline-block mt-2 bg-white text-[#6B7280] font-bold text-[10px] rounded-full px-2 py-0.5">{story.category}</span>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-[20px] shadow-edu-card p-4 flex items-center gap-3">
        <button
          onClick={playing ? pause : play}
          className="w-14 h-14 rounded-full bg-edu-primary text-white grid place-items-center shadow-edu-btn"
        >
          {playing ? <Pause size={24} /> : <Play size={24} fill="white" />}
        </button>
        <div className="flex-1">
          <div className="h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
            <div className="h-full bg-edu-primary" style={{ width: `${activeWord >= 0 ? (activeWord / words.length) * 100 : 0}%` }} />
          </div>
          <p className="mt-1 text-[12px] text-[#9CA3AF] font-medium">{story.duration}</p>
        </div>
        <button onClick={cycleSpeed} className="px-3 py-1.5 rounded-full border-[1.5px] border-[#E5E7EB] font-bold text-[12px]">{speed}×</button>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-[20px] shadow-edu-card p-5">
        <div className="flex flex-wrap gap-1 leading-[1.8]">
          {words.map((w, i) => (
            <span
              key={i}
              className={`text-[16px] font-semibold ${i === activeWord ? "bg-[#FFE14D] rounded font-bold px-1" : "text-[#1A1A2E]"}`}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-6">
        <button onClick={finish} className="w-full h-[52px] rounded-xl bg-edu-primary text-white font-extrabold shadow-edu-btn">
          J'ai terminé ! ✓
        </button>
      </div>
    </div>
  );
}