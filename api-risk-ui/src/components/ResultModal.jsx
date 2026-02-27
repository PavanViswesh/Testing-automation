import React from "react";

export default function ResultModal({ result, onClose }) {
  if (!result) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <h2>ANALYSIS RESULT</h2>

        <div className="modal-body">

          <p><strong>Status Code:</strong> {result.statusCode}</p>
          <p><strong>Response Time:</strong> {result.responseTimeMs} ms</p>
          {result.responseSize && (
            <p><strong>Response Size:</strong> {result.responseSize} bytes</p>
          )}

          {/* FUNCTIONAL */}
          {result.functional && (
            <>
              <h3>FUNCTIONAL</h3>
              <p><strong>Status:</strong> {result.functional.status}</p>
              <p>{result.functional.message}</p>
            </>
          )}

          {/* STRUCTURE */}
          {result.structure && (
            <>
              <h3>STRUCTURE</h3>

              <p><strong>Missing Fields:</strong> {result.structure.missingFields}</p>
              <p><strong>Type Changes:</strong> {result.structure.typeChanges}</p>
              <p><strong>New Fields:</strong> {result.structure.newFields}</p>

              {result.structure.missingFieldPaths?.length > 0 && (
                <>
                  <h4>Missing Field Paths</h4>
                  <ul>
                    {result.structure.missingFieldPaths.map((path, i) => (
                      <li key={i}>{path}</li>
                    ))}
                  </ul>
                </>
              )}

              {result.structure.typeChangedPaths?.length > 0 && (
                <>
                  <h4>Type Changed Paths</h4>
                  <ul>
                    {result.structure.typeChangedPaths.map((path, i) => (
                      <li key={i}>{path}</li>
                    ))}
                  </ul>
                </>
              )}

              {result.structure.newFieldPaths?.length > 0 && (
                <>
                  <h4>New Field Paths</h4>
                  <ul>
                    {result.structure.newFieldPaths.map((path, i) => (
                      <li key={i}>{path}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}

          {/* IMPACT BREAKDOWN */}
          {result.fieldImpactBreakdown && (
            <>
              <h3>FIELD IMPACT BREAKDOWN</h3>
              <ul>
                {Object.entries(result.fieldImpactBreakdown).map(([field, score]) => (
                  <li key={field}>
                    {field}: {score}
                  </li>
                ))}
              </ul>
            </>
          )}

          {result.primaryRootCauseField && (
            <p>
              <strong>Primary Root Cause Field:</strong> {result.primaryRootCauseField}
            </p>
          )}

          {result.primaryImpactScore && (
            <p>
              <strong>Primary Impact Score:</strong> {result.primaryImpactScore}
            </p>
          )}

          {/* RISK ENGINE */}
          {result.risk && (
            <>
              <h3>RISK ENGINE</h3>

              <p><strong>CRI:</strong> {result.risk.cri}</p>
              <p><strong>Risk Category:</strong> {result.risk.riskCategory}</p>
              <p><strong>Break Probability:</strong> {result.risk.breakProbability}%</p>

              {result.risk.axiomContributions && (
                <>
                  <h4>Axiom Contributions</h4>
                  <ul>
                    {Object.entries(result.risk.axiomContributions).map(
                      ([key, value]) => (
                        <li key={key}>
                          {key}: {value}
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}

              {result.risk.systemicImpactCount > 0 && (
                <>
                  <h4>Systemic Impact Fields</h4>
                  <p>Count: {result.risk.systemicImpactCount}</p>
                  <ul>
                    {result.risk.systemicImpactFields?.map((field, i) => (
                      <li key={i}>{field}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}

          {result.evolution && (
            <>
              <h3>EVOLUTION ANALYSIS</h3>
              <p>Complexity Growth: {result.evolution.complexityGrowthPercentage}%</p>
              <p>Evolution Pattern: {result.evolution.evolutionPattern}</p>
              <p>Systemic Amplification: {result.evolution.systemicAmplificationLevel}</p>
              <p>Contract Stability: {result.evolution.contractStability}</p>
            </>
          )}

          {/* STRUCTURAL COMPLEXITY */}
          {result.structuralComplexity && (
            <>
              <h3>STRUCTURAL COMPLEXITY (SCS)</h3>
              <p>Total Fields: {result.structuralComplexity.totalFields}</p>
              <p>Max Depth: {result.structuralComplexity.maxDepth}</p>
              <p>Array Count: {result.structuralComplexity.arrayCount}</p>
              <p>Object Count: {result.structuralComplexity.objectCount}</p>
              <p>SCS Score: {result.structuralComplexity.score}</p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}