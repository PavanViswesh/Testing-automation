import { useState, useEffect } from "react";
import ResultModal from "./ResultModal";

export default function VersionTest() {

  const projectId = 1; // change if needed

  const [form, setForm] = useState({
    method: "GET",
    url: "",
    version: "",
    compareWith: "",
    expectedStatus: "",
    maxTime: "",
    headers: "",
    cookies: "",
  });

  const [versions, setVersions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [useHeaders, setUseHeaders] = useState(false);
  const [useCookies, setUseCookies] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // -------------------------------
  // FETCH VERSIONS
  // -------------------------------
  const fetchVersions = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/analyze/versions/${projectId}`
      );
      const data = await res.json();
      setVersions(data || []);
    } catch (err) {
      console.log("Could not fetch versions");
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  // -------------------------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);

    let headersObj = null;

    try {

      if (useHeaders && form.headers.trim() !== "") {
        headersObj = JSON.parse(form.headers);
      }

      if (useCookies && form.cookies.trim() !== "") {
        headersObj = {
          ...headersObj,
          Cookie: form.cookies
        };
      }

    } catch (err) {
      alert("Invalid JSON in headers");
      setLoading(false);
      return;
    }

    try {

      const response = await fetch("http://localhost:8080/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          method: form.method,
          url: form.url,
          version: form.version || null,
          compareWith: form.compareWith || null,
          expectedStatus: form.expectedStatus
            ? Number(form.expectedStatus)
            : null,
          maxResponseTimeMs: form.maxTime
            ? Number(form.maxTime)
            : null,
          headers: headersObj,
          projectId: projectId
        })
      });

      const data = await response.json();
      setResult(data);
      setShowModal(true);

      // refresh versions after save
      fetchVersions();

    } catch (error) {
      setResult({
        functional: { status: "ERROR" },
        message: "Backend not reachable"
      });
      setShowModal(true);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="version-layout">

        {/* LEFT SIDE */}
        <div className="left-panel">

          <h2>VERSION TEST</h2>

          <form onSubmit={handleSubmit}>

            <select name="method" value={form.method} onChange={handleChange}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>

            <input
              name="url"
              placeholder="API URL"
              value={form.url}
              onChange={handleChange}
              required
            />

            <input
              name="version"
              placeholder="New Version Name (e.g. v2)"
              value={form.version}
              onChange={handleChange}
              required
            />

            {/* DROPDOWN INSTEAD OF TEXT INPUT */}
            <select
              name="compareWith"
              value={form.compareWith}
              onChange={handleChange}
            >
              <option value="">
                -- No Comparison (Baseline) --
              </option>
              {versions.map((v, index) => (
                <option key={index} value={v}>
                  {v}
                </option>
              ))}
            </select>

            <input
              name="expectedStatus"
              placeholder="Expected Status"
              value={form.expectedStatus}
              onChange={handleChange}
            />

            <input
              name="maxTime"
              placeholder="Max Response Time (ms)"
              value={form.maxTime}
              onChange={handleChange}
            />

            {/* Toggles */}
            <div className="toggles">
              <label>
                <input
                  type="checkbox"
                  checked={useHeaders}
                  onChange={() => setUseHeaders(!useHeaders)}
                />
                Headers
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={useCookies}
                  onChange={() => setUseCookies(!useCookies)}
                />
                Cookies
              </label>

            </div>

            <button type="submit">
              {loading ? "Analyzing..." : "ANALYZE VERSION"}
            </button>

          </form>
        </div>

        {/* RIGHT SIDE (ADVANCED PANEL) */}
        <div className="right-panel">

          {useHeaders && (
            <div className="advanced-block">
              <h3>HEADERS</h3>
              <textarea
                name="headers"
                placeholder='{
  "Authorization": "Bearer token"
}'
                value={form.headers}
                onChange={handleChange}
              />
            </div>
          )}

          {useCookies && (
            <div className="advanced-block">
              <h3>COOKIES</h3>
              <textarea
                name="cookies"
                placeholder="sessionId=abc123"
                value={form.cookies}
                onChange={handleChange}
              />
            </div>
          )}

        </div>
      </div>

      <ResultModal
        result={showModal ? result : null}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}