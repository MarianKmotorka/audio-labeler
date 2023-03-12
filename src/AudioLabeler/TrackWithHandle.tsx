import { Box, Stack } from "@mui/material";
import { blue, blueGrey, green, grey, red } from "@mui/material/colors";
import shadows from "@mui/material/styles/shadows";
import { useEffect, useRef, useState } from "react";
import { Label, LabelComponent } from "./Label";

type Props = {
  onDrag: (newTime: number) => void;
  duration: number;
  currentTime: number;
  editingLabel?: Label;
  onEditingLabelChange: (newLabel: Label) => void;
};

export const TrackWithHandle = ({ onDrag, duration, currentTime, editingLabel, onEditingLabelChange }: Props) => {
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

  const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!mouseDown || !wrapperRef.current) return;
    const wrapperOffsetX = wrapperRef.current.getBoundingClientRect().left;
    const wrapperWidth = wrapperRef.current.clientWidth;
    const newTime = duration * ((e.clientX - wrapperOffsetX) / wrapperWidth);
    onDrag(newTime);
  };

  return (
    <Box
      borderRadius={4}
      boxShadow={shadows[2]}
      ref={wrapperRef}
      height={100}
      bgcolor={grey[200]}
      onMouseMove={handleDrag}
      position="relative"
    >
      {editingLabel && (
        <LabelComponent {...editingLabel} wrapperRef={wrapperRef} duration={duration} onChange={onEditingLabelChange} />
      )}

      <Stack
        width={`${percentagePlayed}%`}
        bgcolor={green[100]}
        borderRadius={1}
        overflow="hidden"
        height={"100%"}
        direction="row-reverse"
        sx={{ transition: "width 0.4s" }}
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
