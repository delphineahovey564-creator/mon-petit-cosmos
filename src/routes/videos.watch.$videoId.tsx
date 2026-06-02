import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, Youtube } from "lucide-react";
import { getVideoById, getVideosByModule } from "@/data/videos";
import { addWatchedVideo } from "@/lib/storage";

export const Route = createFileRoute("/videos/watch/$videoId")({ component: VideoPlayer });

function VideoPlayer() {
  const { videoId } = useParams({ from: "/videos/watch/$videoId" });
  const video = getVideoById(videoId);
  const nav = useNavigate();
  useEffect(() => { if (video) addWatchedVideo(video.id); }, [video]);

  if (!video) return <div className="min-h-screen grid place-items-center text-white bg-black"><Link to="/videos" className="text-edu-primary">← Retour</Link></div>;

  const related = getVideosByModule(video.moduleId).filter((v) => v.id !== video.id).slice(0, 3);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-black">
      <header className="absolute top-0 left-0 right-0 z-10 h-12 px-4 flex items-center gap-3">
        <button onClick={() => nav({ to: "/videos" })} className="w-9 h-9 rounded-full bg-black/40 grid place-items-center"><ArrowLeft size={20} color="#fff" /></button>
        <p className="text-white font-bold text-[14px] truncate flex-1">{video.title}</p>
      </header>

      <div className="w-full" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&playsinline=1&controls=1&autoplay=1&origin=${origin}`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen title={video.title}
        />
      </div>

      <div className="-mt-2 rounded-t-[24px] bg-[#FFF9F0] p-5 min-h-[60vh]">
        <h1 className="font-extrabold text-[18px] text-[#1A1A2E]">{video.title}</h1>
        <div className="mt-1 flex items-center gap-2 text-[#6B7280] font-semibold text-[13px]">
          <Youtube size={16} color="#FF0000" /> {video.channel}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[video.category, `${video.ageMin}-${video.ageMax} ans`, `${video.durationMin} min`].map((t) => (
            <span key={t} className="bg-[#F3F4F6] text-[#6B7280] font-semibold text-[12px] rounded-full px-2.5 py-1">{t}</span>
          ))}
        </div>
        <p className="mt-3 text-[#6B7280] font-medium text-[14px]">{video.description}</p>

        {related.length > 0 && (
          <>
            <h2 className="mt-6 font-bold text-[16px] text-[#1A1A2E]">Tu pourrais aussi aimer</h2>
            <div className="mt-2 space-y-2">
              {related.map((r) => (
                <Link key={r.id} to="/videos/watch/$videoId" params={{ videoId: r.id }} className="flex gap-3 bg-white rounded-[14px] shadow-edu-card p-2 active:scale-[0.99]">
                  <img src={`https://img.youtube.com/vi/${r.youtubeId}/mqdefault.jpg`} alt={r.title} className="w-24 h-16 rounded-lg object-cover bg-black" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[13px] text-[#1A1A2E] line-clamp-2 leading-tight">{r.title}</p>
                    <p className="mt-1 text-[11px] text-[#9CA3AF] truncate">{r.channel} • {r.durationMin} min</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}