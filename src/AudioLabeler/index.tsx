import { Box, Button, ButtonGroup, Chip, Stack } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Label } from "./Label";
import { TrackWithHandle } from "./TrackWithHandle";
import { formatAudioTime } from "./utils";

type Props = {
  src: string;
};

export const AudioLabeler = ({ src }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioEl = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [editingLabel, setEditingLable] = useState<Label>();

  //TODO: find less hacky way of updating duration
  useEffect(() => {
    const id = setTimeout(() => setDuration(audioEl.current?.duration || 0), 100);
    return () => clearTimeout(id);
  }, [audioEl.current?.readyState, (audioEl.current as any)?.loadedmetadata]);

  useUpdateAudioTime(setCurrentTime, audioEl);

  const handlePlayPause = async () => {
    if (isPlaying) {
      audioEl.current?.pause();
    } else {
      await audioEl.current?.play();
    }
  };

  const handleAddCancelLabel = () => {
    if (editingLabel) {
      setEditingLable(undefined);
      return;
    }
    const newLabel: Label = { name: "Label 1", start: currentTime, end: Math.min(currentTime + 2, duration) };
    setEditingLable(newLabel);
  };

  const setAudioTime = (time: number) => {
    audioEl.current!.currentTime = time;
  };

  return (
    <Box margin={5} mt={10}>
      <audio loop ref={audioEl} src={src} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />

      <TrackWithHandle
        editingLabel={editingLabel}
        onEditingLabelChange={setEditingLable}
        duration={duration}
        currentTime={currentTime}
        setCurrentTime={setAudioTime}
      />

      <Stack direction={"row"} mt={1} justifyContent="space-between">
        <Chip label={formatAudioTime(currentTime)} variant="outlined" />
        <Chip label={formatAudioTime(duration)} variant="outlined" />
      </Stack>

      <ButtonGroup variant="outlined" sx={{ mt: 1 }}>
        <Button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</Button>
        <Button onClick={handleAddCancelLabel}>{editingLabel ? "Cancel add label" : "Add label"}</Button>
      </ButtonGroup>
    </Box>
  );
};

function useUpdateAudioTime(setCurrentTime: (time: number) => void, audioEl: React.RefObject<HTMLAudioElement>) {
  const animationFrameRequest = useRef<number>(-1);

  const updateAudioTime = useCallback(() => {
    setCurrentTime(audioEl.current?.currentTime || 0);
    animationFrameRequest.current = requestAnimationFrame(updateAudioTime);
  }, [setCurrentTime, audioEl, animationFrameRequest]);

  useEffect(() => {
    animationFrameRequest.current = requestAnimationFrame(updateAudioTime);
    return () => cancelAnimationFrame(animationFrameRequest.current);
  }, [updateAudioTime, animationFrameRequest]);
}
