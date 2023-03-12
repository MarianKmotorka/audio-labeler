import { Box, Stack } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { useEffect, useRef, useState } from "react";
import { Label, LabelComponent } from "./Label";
import wavesurfer from "wavesurfer.js";

type Props = {
  duration: number;
  currentTime: number;
  editingLabel?: Label;
  audioSrc: string;
  setCurrentTime: (newTime: number) => void;
  onEditingLabelChange: (newLabel: Label) => void;
};

export const TrackWithHandle = ({
  duration,
  currentTime,
  editingLabel,
  audioSrc,
  setCurrentTime,
  onEditingLabelChange,
}: Props) => {
  const [mouseDown, setMouseDown] = useState(false);
  const percentagePlayed = duration === 0 ? 0 : (currentTime / duration) * 100;
  const handleRef = useRef<HTMLDivElement>();
  const wrapperRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const handleMouseUp = () => setMouseDown(false);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!editingLabel) {
      return;
    }
    if (currentTime < editingLabel.start || currentTime >= editingLabel.end) {
      setCurrentTime(editingLabel.start);
    }
  }, [editingLabel, currentTime, setCurrentTime]);

  const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!mouseDown || !wrapperRef.current) return;
    const wrapperOffsetX = wrapperRef.current.getBoundingClientRect().left;
    const wrapperWidth = wrapperRef.current.clientWidth;
    const newTime = duration * ((e.clientX - wrapperOffsetX) / wrapperWidth);
    setCurrentTime(newTime);
  };

  return (
    <>
      <Box ref={wrapperRef} height={100} onMouseMove={handleDrag} position="relative" zIndex={1}>
        <Waveform audioSrc={audioSrc} />

        {editingLabel && (
          <LabelComponent
            {...editingLabel}
            wrapperRef={wrapperRef}
            duration={duration}
            onChange={onEditingLabelChange}
          />
        )}

        <Stack
          width={`${percentagePlayed}%`}
          bgcolor={green[100] + "88"}
          sx={{ borderRadius: "0 4px 4px 0" }}
          overflow="hidden"
          height={"100%"}
          direction="row-reverse"
          position="relative"
          zIndex={3}
        >
          <Box
            ref={handleRef}
            onMouseDown={() => setMouseDown(true)}
            width={8}
            height="100%"
            bgcolor={green[600]}
            sx={{ ":hover": { cursor: "pointer" } }}
          ></Box>
        </Stack>
      </Box>
    </>
  );
};

const Waveform = ({ audioSrc }: { audioSrc: string }) => {
  const wavesurferContainer = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!wavesurferContainer.current) {
      return;
    }
    const wavesurferObj = wavesurfer.create({
      container: wavesurferContainer.current,
      height: 100,
      waveColor: grey[800],
    });
    wavesurferObj.load(audioSrc);
    return () => {
      wavesurferObj.destroy();
    };
  }, [wavesurferContainer, audioSrc]);

  return <Box ref={wavesurferContainer} zIndex={1} position="absolute" top={0} height="100%" left={0} width="100%" />;
};
