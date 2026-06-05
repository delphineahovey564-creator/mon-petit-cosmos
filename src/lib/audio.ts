export interface VoiceProfile {
  name: string;
  displayName: string;
  lang: string;
  pitch: number;
  rate: number;
  description: string;
  emoji: string;
  color: string;
  gender: "male" | "female";
}

// Default = Léo (male) so variety is obvious at first launch
export const VOICE_PROFILES: VoiceProfile[] = [
  { name: "leo",    displayName: "Léo 🦁",    lang: "fr-FR", pitch: 0.80, rate: 0.78, description: "Voix grave et rassurante", emoji: "🦁", color: "#FFB3BA", gender: "male"   },
  { name: "max",    displayName: "Max 🐻",    lang: "fr-FR", pitch: 0.70, rate: 0.75, description: "Voix profonde et calme",   emoji: "🐻", color: "#B5EAD7", gender: "male"   },
  { name: "stella", displayName: "Stella ⭐", lang: "fr-FR", pitch: 1.55, rate: 0.85, description: "Voix vive et joyeuse",     emoji: "⭐", color: "#FFE14D", gender: "female" },
  { name: "luna",   displayName: "Luna 🌙",   lang: "fr-FR", pitch: 1.25, rate: 0.72, description: "Voix douce et posée",      emoji: "🌙", color: "#C7CEEA", gender: "female" },
];

const KEY = "educenfant_voice_profile";

class AudioEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private isReady = false;
  private selectedProfile: VoiceProfile = VOICE_PROFILES[0];
  private isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent);

  constructor() {
    if (typeof window === "undefined") return;
    this.init();
  }

  private init(): void {
    if (!("speechSynthesis" in window)) return;
    const loadVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices.length > 0) this.isReady = true;
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    setTimeout(loadVoices, 500);
    setTimeout(loadVoices, 1500);
    setTimeout(loadVoices, 3000);
    if (this.isMobile) {
      setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    }
  }

  setProfile(profile: VoiceProfile): void {
    this.selectedProfile = profile;
    try { localStorage.setItem(KEY, profile.name); } catch {}
  }

  getProfile(): VoiceProfile { return this.selectedProfile; }

  loadSavedProfile(): void {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(KEY);
      if (!saved) return;
      const found = VOICE_PROFILES.find((p) => p.name === saved);
      if (found) this.selectedProfile = found;
    } catch {}
  }

  getBestVoice(gender: "male" | "female" = "female"): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) return null;
    const female = ["female", "femme", "féminin", "amelie", "amélie", "alice", "marie", "julie", "audrey", "céline"];
    const male   = ["male", "homme", "masculin", "thomas", "pierre", "jean", "nicolas", "henri", "google french male"];
    const kw = gender === "female" ? female : male;
    const fr = this.voices.filter((v) => v.lang.toLowerCase().startsWith("fr"));
    const match = fr.find((v) => kw.some((k) => v.name.toLowerCase().includes(k)));
    if (match) return match;
    return fr[0] || this.voices[0] || null;
  }

  speak(text: string, options?: { lang?: string; pitch?: number; rate?: number; onEnd?: () => void; onStart?: () => void }): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!text?.trim()) return;
    try {
      window.speechSynthesis.cancel();
      const p = this.selectedProfile;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = options?.lang || p.lang;
      u.pitch = options?.pitch ?? p.pitch;
      u.rate = options?.rate ?? p.rate;
      u.volume = 1.0;
      if (this.voices.length > 0) {
        const v = this.getBestVoice(p.gender);
        if (v) u.voice = v;
      }
      if (options?.onStart) u.onstart = options.onStart;
      if (options?.onEnd) u.onend = options.onEnd;
      u.onerror = (e) => {
        if (e.error !== "canceled" && e.error !== "interrupted") console.warn("[Audio]", e.error);
      };
      const delay = this.isMobile ? 150 : 50;
      setTimeout(() => { try { window.speechSynthesis.speak(u); } catch {} }, delay);
    } catch {}
  }

  stop(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }
}

export const audioEngine = new AudioEngine();
audioEngine.loadSavedProfile();

export const speak = (text: string, onEnd?: () => void): void => audioEngine.speak(text, { onEnd });
export const speakLetter = (letter: string, wordExample: string): void =>
  audioEngine.speak(`${letter}... ${letter} comme dans ${wordExample}`, { rate: 0.6, pitch: 1.3 });
export const speakNumber = (num: number, word: string): void =>
  audioEngine.speak(`${word}... ${num}`, { rate: 0.65, pitch: 1.2 });
export const speakSyllable = (s: string): void => audioEngine.speak(s, { rate: 0.5, pitch: 1.4 });
export const speakWord = (w: string): void => audioEngine.speak(w, { rate: 0.7 });
export const speakEncouragement = (): void => {
  const msgs = ["Bravo !", "Excellent travail !", "Super !", "Tu es incroyable !", "Fantastique !", "Continue comme ça !"];
  audioEngine.speak(msgs[Math.floor(Math.random() * msgs.length)], { pitch: 1.5, rate: 0.9 });
};

export const unlockAudio = (): void => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    u.rate = 10;
    window.speechSynthesis.speak(u);
  } catch {}
};

// ── STORY AUDIO ENGINE ────────────────────────────────────────────
// Reads the entire page as ONE utterance for gap-less narration.
// Uses onboundary to highlight words.
class StoryAudioEngine {
  private isPlaying = false;
  private onWord: ((i: number) => void) | null = null;
  private onEnd: (() => void) | null = null;
  private keepAlive: ReturnType<typeof setInterval> | null = null;

  play(text: string, onWord: (i: number) => void, onEnd: () => void): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try { window.speechSynthesis.cancel(); } catch {}
    this.isPlaying = false;
    this.onWord = onWord;
    this.onEnd = onEnd;
    const isAndroid = /Android/i.test(navigator.userAgent);
    setTimeout(() => this.doPlay(text), isAndroid ? 200 : 80);
  }

  private doPlay(text: string): void {
    const p = audioEngine.getProfile();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.pitch = p.pitch;
    u.rate = 0.78;
    u.volume = 1.0;
    const v = audioEngine.getBestVoice(p.gender);
    if (v) u.voice = v;

    u.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.name && event.name !== "word") return;
      const spoken = text.substring(0, event.charIndex || 0);
      const idx = spoken.trim().length === 0 ? 0 : spoken.trim().split(/\s+/).length - 1;
      this.onWord?.(idx);
    };
    u.onstart = () => { this.isPlaying = true; };
    u.onend = () => {
      this.isPlaying = false;
      this.clearKeepAlive();
      this.onWord?.(-1);
      this.onEnd?.();
    };
    u.onerror = (e) => {
      this.isPlaying = false;
      this.clearKeepAlive();
      if (e.error !== "canceled" && e.error !== "interrupted") console.warn("[StoryAudio]", e.error);
    };

    if (/Android/i.test(navigator.userAgent)) {
      this.keepAlive = setInterval(() => {
        if (this.isPlaying && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else if (!this.isPlaying) {
          this.clearKeepAlive();
        }
      }, 8000);
    }
    try { window.speechSynthesis.speak(u); } catch (e) { console.warn("[StoryAudio] speak failed", e); }
  }

  private clearKeepAlive(): void {
    if (this.keepAlive) { clearInterval(this.keepAlive); this.keepAlive = null; }
  }

  pause(): void { try { window.speechSynthesis.pause(); } catch {} this.isPlaying = false; }
  resume(): void { try { window.speechSynthesis.resume(); } catch {} this.isPlaying = true; }
  stop(): void {
    try { window.speechSynthesis.cancel(); } catch {}
    this.isPlaying = false;
    this.clearKeepAlive();
    this.onWord?.(-1);
  }
  get playing(): boolean { return this.isPlaying; }
}

export const storyAudio = new StoryAudioEngine();