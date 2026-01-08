function ResultSummary({ summary }) {
  if (!summary) {
    return <p>No results yet.</p>;
  }

  return (
    <div>
      <p><strong>Matched:</strong> {String(summary.matched)}</p>
      <p><strong>Expected Rows:</strong> {summary.expectedCount}</p>
      <p><strong>Actual Rows:</strong> {summary.actualCount}</p>
      <p><strong>Verified At:</strong> {summary.verifiedAt}</p>
    </div>
  );
}

export default ResultSummary;
