import { CssBaseline } from "@mui/material";
import { ChangeEvent, useMemo, useState } from "react";
import { AudioLabeler } from "./AudioLabeler";

function App() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const src = useMemo(() => (selectedFile ? URL.createObjectURL(selectedFile) : undefined), [selectedFile]);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event?.target.files?.[0]) {
      return;
    }
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="App">
      <CssBaseline />

      <input type="file" accept=".mp3,audio/*" onChange={handleFileSelect} />
      {src && <AudioLabeler src={src} />}
    </div>
  );
}

export default App;
