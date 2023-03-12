import { Box, Chip } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import ArrowCircleDown from "@mui/icons-material/ArrowCircleDownTwoTone";
import { useEffect, useState } from "react";

export type Label = {
  start: number;
  end: number;
  name: string;
};

const MIN_LABEL_DURATION = 1;

type Props = {
  onChange: (newLabel: Label) => void;
  duration: number;
  wrapperRef: React.MutableRefObject<HTMLDivElement | undefined>;
} & Label;

export const LabelComponent = ({ start, end, name, wrapperRef, duration, onChange }: Props) => {
  const [handleDown, setHandleDown] = useState<"start" | "end">();
  if (!wrapperRef.current) return null;

  const wrapperWidth = wrapperRef.current.clientWidth;
  const left = (start / duration) * wrapperWidth;
  const width = ((end - start) / duration) * wrapperWidth;

  useEffect(() => {
    const handleMouseUp = () => setHandleDown(undefined);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    const handleDrag = (e: MouseEvent) => {
      if (!handleDown || !wrapperEl) return;
      const wrapperOffsetX = wrapperEl.getBoundingClientRect().left;
      const newTime = duration * ((e.clientX - wrapperOffsetX) / wrapperWidth);

      const newStart = handleDown === "start" ? Math.max(Math.min(newTime, end - MIN_LABEL_DURATION), 0) : start;
      const newEnd = handleDown === "end" ? Math.min(Math.max(newTime, start + MIN_LABEL_DURATION), duration) : end;
      onChange({
        start: newStart,
        end: newEnd,
        name,
      });
    };
    document?.addEventListener("mousemove", handleDrag);
    return () => {
      document?.removeEventListener("mousemove", handleDrag);
    };
  }, [handleDown]);

  return (
    <Box
      position="absolute"
      bgcolor={blue[200] + "66"}
      top={0}
      bottom={0}
      left={left}
      width={width}
      display="flex"
      justifyContent="space-between"
    >
      <Box height="100%" width={2} bgcolor={blue[200]} position="relative">
        <Box
          position="absolute"
          top={-20}
          sx={{ cursor: "pointer", transform: "translateX(-50%)" }}
          onMouseDown={() => setHandleDown("start")}
        >
          <ArrowCircleDown />
        </Box>
      </Box>
      <Box height="100%" width={2} bgcolor={blue[200]} position="relative">
        <Box
          position="absolute"
          top={-20}
          right={0}
          sx={{ cursor: "pointer", transform: "translateX(50%)" }}
          onMouseDown={() => setHandleDown("end")}
        >
          <ArrowCircleDown />
        </Box>
      </Box>
    </Box>
  );
};
