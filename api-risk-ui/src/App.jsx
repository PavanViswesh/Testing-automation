import { useState } from "react";
import QuickTest from "./components/QuickTest";
import VersionTest from "./components/VersionTest";

export default function App() {

  const [mode, setMode] = useState("quick");

  return (
    <div className="app">

      <h1>API Risk Intelligence Engine</h1>

      <div className="toggle-buttons">
        <button onClick={() => setMode("quick")}>Quick Test</button>
        <button onClick={() => setMode("version")}>Version Test</button>
      </div>

      {mode === "quick" ? <QuickTest /> : <VersionTest />}

    </div>
  );
}