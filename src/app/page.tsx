import CardPreview from "@/components/CardPreview";
import AppHeader from "@/components/AppHeader";

const REPO_URL = "https://github.com/kareemalaa1/github-pr-stats";

const API_PARAMETERS: Array<{
  name: string;
  type: string;
  required: "yes" | "no";
  description: string;
}> = [
  { name: "username", type: "string", required: "yes", description: "GitHub username to fetch merged PRs for." },
  { name: "style", type: "detailed | compact", required: "no", description: "Card layout style. Default is detailed." },
  { name: "max_prs", type: "number (1-10)", required: "no", description: "Maximum PR rows returned. Default is 5." },
  { name: "exclude", type: "owner/repo CSV", required: "no", description: "Exact repo names to exclude from the card." },
  { name: "theme", type: "string", required: "no", description: "Theme key from available themes." },
  { name: "hide_border", type: "true | false", required: "no", description: "Hide outer card border." },
  { name: "hide_title", type: "true | false", required: "no", description: "Hide title at the top of the card." },
  { name: "hide_meta", type: "true | false", required: "no", description: "Hide subtitle (shown/excluded summary line)." },
  { name: "border_radius", type: "number (0-50)", required: "no", description: "Roundness of card corners." },
  { name: "custom_title", type: "string", required: "no", description: "Custom title text." },
  
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      <AppHeader repoUrl={REPO_URL} />

      <CardPreview />

      <section className="rounded-xl app-panel p-5 space-y-2">
        <h2 className="text-lg font-bold app-title">API Quick Example</h2>
        <p className="text-sm app-muted break-all">
          /api/pr-card?username=kareemalaa1&amp;style=detailed&amp;max_prs=5&amp;exclude=owner/repo-one,owner/repo-two
        </p>
      </section>

      <section className="rounded-xl app-panel p-5 space-y-4">
        <h2 className="text-lg font-bold app-title">API Parameters</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left app-muted" style={{ borderColor: "var(--app-border)" }}>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Required</th>
                <th className="py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {API_PARAMETERS.map((param) => (
                <tr key={param.name} className="border-b align-top" style={{ borderColor: "var(--app-border-soft)" }}>
                  <td className="py-2 pr-4 app-title">{param.name}</td>
                  <td className="py-2 pr-4" style={{ color: "var(--app-text)" }}>{param.type}</td>
                  <td className="py-2 pr-4" style={{ color: "var(--app-text)" }}>{param.required}</td>
                  <td className="py-2 app-muted">{param.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
