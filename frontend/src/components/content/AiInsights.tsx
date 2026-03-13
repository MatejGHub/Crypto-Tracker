import HeaderSettings from "../Header-settings";

export function AiInsights() {
  return (
    <>
      <section className="ai-insights-container p-3 w-full">
        <div className="ai-insights-header h-16 flex justify-between w-full">
          <div>AI Insights Header</div>
          <HeaderSettings />
        </div>
        <div className="ai-insights-content bg-black">AI Insights Content</div>
      </section>
    </>
  );
}

export default AiInsights;
