import { Box, Stack } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import shadows from "@mui/material/styles/shadows";
import { useEffect, useRef, useState } from "react";
import { Label, LabelComponent } from "./Label";

type Props = {
  duration: number;
  currentTime: number;
  editingLabel?: Label;
  setCurrentTime: (newTime: number) => void;
  onEditingLabelChange: (newLabel: Label) => void;
};

export const TrackWithHandle = ({
  duration,
  currentTime,
  editingLabel,
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
    <Box
      boxShadow={shadows[2]}
      ref={wrapperRef}
      height={100}
      bgcolor={grey[200]}
      onMouseMove={handleDrag}
      position="relative"
      borderRadius={3}
    >
      {editingLabel && (
        <LabelComponent {...editingLabel} wrapperRef={wrapperRef} duration={duration} onChange={onEditingLabelChange} />
      )}

      <Stack
        width={`${percentagePlayed}%`}
        bgcolor={green[100]}
        sx={{ borderRadius: "12px 4px 4px 12px" }}
        overflow="hidden"
        height={"100%"}
        direction="row-reverse"
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
  );
};
