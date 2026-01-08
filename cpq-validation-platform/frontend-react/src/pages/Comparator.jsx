/**
 * Smart Data Comparator Page
 * Integrates the cloned comparator tool for CPQ validation
 * 
 * This loads the standalone comparator.html from the public folder
 * The comparator tool allows comparing Form Data with Sainpase/CPQ Data
 */
export default function Comparator() {
  return (
    <div className="comparator-container">
      <iframe
        src="/comparator/comparator.html"
        title="Smart Data Comparator"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
      />
    </div>
  );
}
