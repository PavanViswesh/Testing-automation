import { useState } from "react";
import ResultModal from "./ResultModal";

export default function QuickTest() {

  const [form, setForm] = useState({
    method: "GET",
    url: "",
    expectedStatus: "",
    maxTime: "",
    headers: "",
    cookies: "",
    businessRules: "",
    expectedSchema: ""   // ✅ Added
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [useHeaders, setUseHeaders] = useState(false);
  const [useCookies, setUseCookies] = useState(false);
  const [useRules, setUseRules] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [useSchema, setUseSchema] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);

    let headersObj = null;
    let businessRulesObj = null;
    let schemaObj = null;   // ✅ Added

    try {

      if (useHeaders && form.headers) {
        headersObj = JSON.parse(form.headers);
      }

      if (useCookies && form.cookies) {
        headersObj = {
          ...headersObj,
          Cookie: form.cookies
        };
      }

      if (useRules && form.businessRules) {
        businessRulesObj = JSON.parse(form.businessRules);
      }

      if (form.expectedSchema) {    // ✅ Added
        schemaObj = JSON.parse(form.expectedSchema);
      }

    } catch (err) {
      alert("Invalid JSON in headers, business rules, or expected schema");
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
          expectedStatus: form.expectedStatus
            ? Number(form.expectedStatus)
            : null,
          maxResponseTimeMs: form.maxTime
            ? Number(form.maxTime)
            : null,
          headers: headersObj,
          businessRules: businessRulesObj,
          expectedSchema: schemaObj   // ✅ Added
        })
      });

      const data = await response.json();
      setResult(data);
      setShowModal(true);

    } catch (error) {
      setResult({
        functional: { status: "ERROR" },
        message: "Backend not reachable"
      });
    }

    setLoading(false);
  };

  return (
    <>
      <div className="version-layout">

        {/* LEFT PANEL */}
        <div className="left-panel">

          <h2>QUICK TEST</h2>

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

              <label>
                <input
                  type="checkbox"
                  checked={useRules}
                  onChange={() => setUseRules(!useRules)}
                />
                Business Rules
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={useSchema}
                  onChange={() => setUseSchema(!useSchema)}
                />
                Expected Schema
              </label>

            </div>

            <button type="submit">
              {loading ? "Analyzing..." : "ANALYZE"}
            </button>

          </form>

        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          {useHeaders && (
            <div className="advanced-block">
              <h3>HEADERS</h3>
              <textarea
                name="headers"
                placeholder={`{
  "Authorization": "Bearer token"
}`}
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

          {useRules && (
            <div className="advanced-block">
              <h3>BUSINESS RULES</h3>
              <textarea
                name="businessRules"
                placeholder={`[
  {
    "field": "id",
    "operator": ">",
    "value": 0
  }
]`}
                value={form.businessRules}
                onChange={handleChange}
              />
            </div>
          )}

          {useSchema && (
            <div className="advanced-block">
              <h3>EXPECTED SCHEMA</h3>
              <textarea
                name="expectedSchema"
                placeholder={`{
            "id": "number",
            "name": "string",
            "email": "string"
          }`}
                value={form.expectedSchema}
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