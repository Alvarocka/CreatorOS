"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Repeat, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { usePlayerStore } from "@/store/player-store";

export function GlobalMediaPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { clearTrack, currentTrack, isLooping, playbackRate, setPlaybackRate, toggleLoop } =
    usePlayerStore();

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = isLooping;
  }, [isLooping]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [currentTrack?.id]);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <Card className="mx-auto flex max-w-4xl flex-col gap-4 border-white/90 bg-white/92 px-4 py-4 shadow-soft md:flex-row md:items-center">
        <audio
          onEnded={() => setPlaying(false)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          ref={audioRef}
        >
          <source src={currentTrack.src} />
        </audio>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="accent">Audio Workspace</Badge>
            {currentTrack.description ? (
              <span className="truncate text-xs text-muted-foreground">{currentTrack.description}</span>
            ) : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground">
                  Reproduce sin bloquear la edición. Ideal para letra, notas mentales y correcciones.
                </p>
              </div>
              <Button
                onClick={() => {
                  clearTrack();
                }}
                size="icon"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatSeconds(currentTime)}</span>
              <span>{formatSeconds(duration)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-center">
          <Button
            onClick={async () => {
              if (!audioRef.current) return;
              if (playing) {
                audioRef.current.pause();
                setPlaying(false);
                return;
              }

              await audioRef.current.play();
              setPlaying(true);
            }}
            size="icon"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <select
            className="h-11 rounded-full border border-input bg-white px-4 text-sm"
            onChange={(event) => setPlaybackRate(Number(event.target.value))}
            value={playbackRate}
          >
            {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
              <option key={rate} value={rate}>
                {rate}x
              </option>
            ))}
          </select>
          <Button onClick={toggleLoop} size="icon" variant={isLooping ? "secondary" : "outline"}>
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

function formatSeconds(value: number) {
  if (!Number.isFinite(value)) return "00:00";
  const mins = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}
