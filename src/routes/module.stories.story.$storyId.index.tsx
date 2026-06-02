import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";
import { getStoryById, getStoryQuiz, type Story } from "@/data/stories";
import { getChild, setChild } from "@/lib/storage";
import { speak } from "@/lib/audio";

export const Route = createFileRoute("/module/stories/story/$storyId/")({ component: StoryReader });

function StoryReader() {
  const { storyId } = useParams({ from: "/module/stories/story/$storyId/" });
  const story = getStoryById(storyId);
  const nav = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [autoRead, setAutoRead] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const touchStart = useRef<number | null>(null);

  if (!story) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#FFF9F0]">
        <p className="font-bold">Histoire introuvable</p>
        <Link to="/module/stories" className="text-edu-primary font-bold mt-2">← Retour</Link>
      </div>
    );
  }

  const page = story.content[currentPage];
  const total = story.content.length;
  const isLast = currentPage === total - 1;

  function readPage(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPlaying(true);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR"; u.rate = 0.75; u.pitch = 1.15;
    u.onend = () => {
      setIsPlaying(false);
      if (autoRead) setTimeout(() => goNext(), 1000);
    };
    window.speechSynthesis.speak(u);
  }

  useEffect(() => {
    if (!autoRead) return;
    const t = setTimeout(() => readPage(page.text), 800);
    return () => { clearTimeout(t); window.speechSynthesis?.cancel(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, autoRead]);

  function goNext() {
    if (isLast) return finish();
    setCurrentPage((p) => Math.min(total - 1, p + 1));
  }
  function goPrev() { setCurrentPage((p) => Math.max(0, p - 1)); }

  function finish() {
    const c = getChild();
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setChild({
      stars: c.stars + story!.stars,
      progress: { ...c.progress, stories: Math.min(100, c.progress.stories + 8) },
      activities: [
        { id: Date.now().toString(), moduleId: "stories", title: `Histoire : ${story!.title}`, starsEarned: story!.stars, timestamp: new Date().toISOString() },
        ...c.activities,
      ].slice(0, 20),
    });
    const hasQuiz = (getStoryQuiz(story!.id) || []).length > 0;
    nav({ to: hasQuiz ? "/module/stories/story/$storyId/quiz" : "/victory",
      params: hasQuiz ? { storyId: story!.id } : undefined as any,
      search: hasQuiz ? undefined : { moduleName: "Histoires", starsEarned: story!.stars, achievementText: `Tu as lu "${story!.title}" !`, nextRoute: "/module/stories" } as any });
  }

  function onTouchStart(e: React.TouchEvent) { touchStart.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 60) { dx < 0 ? goNext() : goPrev(); }
    touchStart.current = null;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-28" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* progress bar */}
      <div className="h-1 w-full bg-[#F3F4F6]">
        <motion.div className="h-full bg-edu-primary" animate={{ width: `${((currentPage + 1) / total) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>

      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/module/stories" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="font-bold text-[16px] text-[#1A1A2E] truncate max-w-[60%]">{story.title}</h1>
        <button onClick={() => setAutoRead((v) => !v)} aria-label="Lecture auto">
          {autoRead ? <Volume2 size={22} color="#FF6B35" /> : <VolumeX size={22} color="#9CA3AF" />}
        </button>
      </header>

      <AnimatePresence mode="wait">
        <motion.div key={currentPage}
          initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}
          transition={{ duration: 0.3 }}>

          {/* illustration */}
          <div className="relative mx-4 mt-4 rounded-[20px] grid place-items-center" style={{ background: story.bg, height: 180 }}>
            <span className="text-[80px] leading-none">{page.illustration}</span>
            <span className="absolute top-2 right-2 bg-white text-[#1A1A2E] font-extrabold text-[12px] rounded-full px-2.5 py-1 shadow-edu-card">
              {currentPage + 1} / {total}
            </span>
          </div>

          {/* text */}
          <div className="relative mx-4 mt-3 bg-white rounded-[20px] shadow-edu-card p-5 pr-16">
            <PageText text={page.text} highlight={page.highlightWord} />
            <button onClick={() => readPage(page.text)}
              className="absolute right-3 top-3 w-[52px] h-[52px] rounded-full bg-edu-primary text-white grid place-items-center shadow-edu-btn active:scale-95"
              aria-label="Écouter">
              <Play size={22} fill="white" className={isPlaying ? "animate-pulse" : ""} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* nav controls */}
      <div className="mx-4 mt-5 flex items-center justify-between">
        <button onClick={goPrev} disabled={currentPage === 0}
          className="w-12 h-12 rounded-full bg-white shadow-edu-card grid place-items-center disabled:opacity-30">
          <ChevronLeft size={24} color="#FF6B35" />
        </button>
        <div className="flex items-center gap-1.5">
          {story.content.map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i)}
              className="rounded-full transition-all"
              style={{ width: i === currentPage ? 18 : 8, height: 8, background: i === currentPage ? "#FF6B35" : "#E5E7EB" }} />
          ))}
        </div>
        <button onClick={goNext}
          className="w-12 h-12 rounded-full bg-edu-primary text-white grid place-items-center shadow-edu-btn active:scale-95">
          <ChevronRight size={24} />
        </button>
      </div>

      {isLast && (
        <div className="mx-4 mt-5">
          <button onClick={finish} className="w-full h-[52px] rounded-xl bg-edu-primary text-white font-extrabold shadow-edu-btn active:scale-95">
            {(getStoryQuiz(story.id) || []).length ? "Quiz de l'histoire →" : "J'ai terminé ! ✓"}
          </button>
          <p className="mt-3 text-center text-[13px] text-[#6B7280] font-semibold italic">« {story.moral} »</p>
        </div>
      )}
    </div>
  );
}

function PageText({ text, highlight }: { text: string; highlight?: string }) {
  const words = text.split(/(\s+)/);
  const hl = highlight?.toLowerCase().split(/[ ,]+/).filter(Boolean) ?? [];
  return (
    <p className="text-[17px] text-[#1A1A2E] font-semibold" style={{ lineHeight: 1.9 }}>
      {words.map((w, i) => {
        const clean = w.replace(/[.,!?"']/g, "").toLowerCase();
        const isHl = hl.includes(clean);
        return isHl ? (
          <span key={i} className="font-extrabold rounded px-1" style={{ background: "#FFE14D" }}>{w}</span>
        ) : <span key={i}>{w}</span>;
      })}
    </p>
  );
}
