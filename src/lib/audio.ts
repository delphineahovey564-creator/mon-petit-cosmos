export interface VoiceProfile {
  name: string;
  displayName: string;
  lang: string;
  pitch: number;
  rate: number;
  description: string;
  emoji: string;
  color: string;
}

export const VOICE_PROFILES: VoiceProfile[] = [
  { name: "auto_fr",         displayName: "Léo 🦁",    lang: "fr-FR", pitch: 1.4, rate: 0.75, description: "Voix douce et lente",     emoji: "🦁", color: "#FFB3BA" },
  { name: "auto_fr_fast",    displayName: "Stella ⭐", lang: "fr-FR", pitch: 1.6, rate: 0.9,  description: "Voix vive et joyeuse",    emoji: "⭐", color: "#FFE14D" },
  { name: "auto_fr_deep",    displayName: "Max 🐻",    lang: "fr-FR", pitch: 0.9, rate: 0.7,  description: "Voix grave et calme",     emoji: "🐻", color: "#B5EAD7" },
  { name: "auto_fr_whisper", displayName: "Luna 🌙",   lang: "fr-FR", pitch: 1.2, rate: 0.65, description: "Voix douce et posée",     emoji: "🌙", color: "#C7CEEA" },
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

  private getBestVoice(lang: string): SpeechSynthesisVoice | null {
    let voice = this.voices.find((v) => v.lang === lang);
    if (!voice) voice = this.voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
    return voice || this.voices[0] || null;
  }

  speak(text: string, options?: { lang?: string; pitch?: number; rate?: number; onEnd?: () => void; onStart?: () => void }): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const p = this.selectedProfile;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = options?.lang || p.lang;
      u.pitch = options?.pitch ?? p.pitch;
      u.rate = options?.rate ?? p.rate;
      u.volume = 1.0;
      if (this.voices.length > 0) {
        const v = this.getBestVoice(u.lang);
        if (v) u.voice = v;
      }
      if (options?.onStart) u.onstart = options.onStart;
      if (options?.onEnd) u.onend = options.onEnd;
      u.onerror = (e) => console.warn("[Audio] Speech error:", e.error);
      setTimeout(() => window.speechSynthesis.speak(u), 100);
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