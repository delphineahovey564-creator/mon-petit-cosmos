import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { getStoryById, getStoryQuiz } from "@/data/stories";
import { getChild, setChild } from "@/lib/storage";
import { storyAudio } from "@/lib/audio";

export const Route = createFileRoute("/module/stories/story/$storyId/")({ component: StoryReader });

function StoryReader() {
  const { storyId } = useParams({ from: "/module/stories/story/$storyId/" });
  const story = getStoryById(storyId);
  const nav = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [autoRead, setAutoRead] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
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
  const words = useMemo(() => page.text.split(/\s+/).filter(Boolean), [page]);
  const hlSet = useMemo(() => {
    const s = new Set<string>();
    (page.highlightWord?.toLowerCase().split(/[ ,]+/).filter(Boolean) ?? []).forEach((w) => s.add(w));
    return s;
  }, [page]);

  function handlePlayPage() {
    if (isPlaying) {
      storyAudio.pause();
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    storyAudio.play(
      page.text,
      (idx) => setActiveWordIndex(idx),
      () => {
        setIsPlaying(false);
        setActiveWordIndex(-1);
        if (autoRead && !isLast) setTimeout(() => goNext(), 1500);
      },
    );
  }

  // Stop audio + auto-restart on page change
  useEffect(() => {
    storyAudio.stop();
    setIsPlaying(false);
    setActiveWordIndex(-1);
    if (autoRead) {
      const t = setTimeout(() => handlePlayPage(), 800);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => () => storyAudio.stop(), []);

  function goNext() {
    if (isLast) return finish();
    setCurrentPage((p) => Math.min(total - 1, p + 1));
  }
  function goPrev() { setCurrentPage((p) => Math.max(0, p - 1)); }

  function finish() {
    const c = getChild();
    storyAudio.stop();
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

          {/* text with word-by-word highlight */}
          <div className="mx-4 mt-3 bg-white rounded-[20px] shadow-edu-card p-5">
            <p className="text-[17px] text-[#1A1A2E] font-semibold" style={{ lineHeight: 1.9 }}>
              {words.map((w, i) => {
                const clean = w.replace(/[.,!?"']/g, "").toLowerCase();
                const isActive = i === activeWordIndex;
                const isHl = hlSet.has(clean);
                return (
                  <span
                    key={i}
                    className="rounded transition-colors"
                    style={{
                      background: isActive ? "#FFE14D" : isHl ? "#FFF3B0" : "transparent",
                      padding: isActive || isHl ? "0 3px" : 0,
                      fontWeight: isActive ? 800 : 600,
                      marginRight: 4,
                    }}
                  >{w}</span>
                );
              })}
            </p>
          </div>

          {/* audio control bar */}
          <div className="mx-4 mt-3 bg-white rounded-[20px] shadow-edu-card p-3 flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handlePlayPage}
              className="w-[52px] h-[52px] rounded-full grid place-items-center text-white shrink-0"
              style={{ background: isPlaying ? "#E55A2B" : "#FF6B35", boxShadow: "0 4px 12px rgba(255,107,53,0.3)" }}
              aria-label={isPlaying ? "Pause" : "Lire"}
            >
              {isPlaying ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" />}
            </motion.button>
            <div className="flex-1 min-w-0">
              <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                <motion.div className="h-full bg-edu-primary"
                  animate={{ width: isPlaying && activeWordIndex >= 0 ? `${((activeWordIndex + 1) / words.length) * 100}%` : "0%" }}
                  transition={{ duration: 0.15 }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[11px] text-[#9CA3AF] font-medium">
                  {isPlaying ? "Lecture en cours…" : "Appuie pour écouter"}
                </span>
                <span className="text-[11px] text-[#9CA3AF]">{words.length} mots</span>
              </div>
            </div>
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

