import { Box, Button, Chip, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
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
    const middleTime = duration / 2;
    const offset = duration / 5;
    const newLabel: Label = { name: "Label 1", start: middleTime - offset, end: middleTime + offset };
    setEditingLable(newLabel);
  };

  return (
    <Box margin={5}>
      <audio
        onTimeUpdate={() => setCurrentTime(audioEl.current!.currentTime)}
        ref={audioEl}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      ></audio>
      <Button variant="outlined" onClick={handlePlayPause}>
        {isPlaying ? "Pause" : "Play"}
      </Button>
      <Button variant="outlined" onClick={handleAddCancelLabel}>
        {editingLabel ? "Cancel add label" : "Add label"}
      </Button>

      <TrackWithHandle
        editingLabel={editingLabel}
        onEditingLabelChange={setEditingLable}
        duration={duration}
        currentTime={currentTime}
        onDrag={(time) => (audioEl.current!.currentTime = time)}
      />

      <Stack direction={"row"} mt={1} justifyContent="space-between">
        <Chip label={formatAudioTime(currentTime)} variant="outlined" />
        <Chip label={formatAudioTime(duration)} variant="outlined" />
      </Stack>
    </Box>
  );
};
