type ResearchMetadata = {
  hIndex?: number | null;
  citedByCount?: number | null;
  worksCount?: number | null;
};

const count = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value.toLocaleString("en-US")
    : "—";

export function FacultyMetrics({ metadata }: { metadata?: ResearchMetadata }) {
  const metrics = [
    { label: "H-index", value: metadata?.hIndex, tone: "blue" },
    { label: "Citations", value: metadata?.citedByCount, tone: "violet" },
    { label: "Publications", value: metadata?.worksCount, tone: "teal" },
  ];
  return (
    <section className="faculty-research-stats" aria-label="OpenAlex research metrics">
      <dl>{metrics.map(metric => <div key={metric.label} className={`faculty-stat ${metric.tone}`}>
        <dt>{metric.label}</dt><dd>{count(metric.value)}</dd>
      </div>)}</dl>
      <small>OpenAlex research metrics</small>
    </section>
  );
}
