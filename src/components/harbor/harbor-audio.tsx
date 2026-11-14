import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import sound from "@/assets/pelabuhan.mp3.asset.json";

export function HarborAudio() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    let disposed = false;
    player.volume = 0.45;
    const start = () => {
      void player.play().then(() => {
        if (disposed) player.pause();
      }).catch(() => { /* Browsers may require a user gesture. */ });
    };
    const retry = (event: Event) => {
      if (event.target instanceof Element && event.target.closest("[data-harbor-sound]")) return;
      start();
    };
    const stopRetry = () => {
      document.removeEventListener("pointerdown", retry);
      document.removeEventListener("keydown", retry);
    };
    player.addEventListener("play", stopRetry);
    document.addEventListener("pointerdown", retry);
    document.addEventListener("keydown", retry);
    start();
    return () => {
      disposed = true;
      stopRetry();
      player.removeEventListener("play", stopRetry);
      player.pause();
    };
  }, []);

  const label = playing ? "Matikan suara pelabuhan" : "Putar suara pelabuhan";
  return <>
    <audio ref={audio} src={sound.url} autoPlay loop preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <Button data-harbor-sound size="icon" variant="outline" className="harbor-sound" aria-label={label} title={label} aria-pressed={playing} onClick={() => {
      const player = audio.current;
      if (!player) return;
      if (!player.paused) player.pause();
      else void player.play().catch(() => setPlaying(false));
    }}>{playing ? <Volume2 /> : <VolumeX />}</Button>
  </>;
}