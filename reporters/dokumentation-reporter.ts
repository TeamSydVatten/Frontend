import type { Reporter, FullResult, TestCase, TestResult } from '@playwright/test/reporter';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

type Rad = {
  namn: string;
  status: string;
  tid: number;
  fel?: string;
};

/**
 * Skriver en markdown-rapport till mappen rapporter/ efter varje körning.
 */
export default class DokumentationReporter implements Reporter {
  private startTid = new Date();
  private rader: Rad[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    const fel = result.errors
      .map((e) => e.message ?? '')
      .join('\n')
      .trim();

    // Ett test markerat med test.fail() som misslyckas är ett känt fel, inte ett nytt.
    const kantFel = result.status === 'failed' && test.expectedStatus === 'failed';

    this.rader.push({
      namn: `[${test.parent.project()?.name ?? 'okänt'}] ${test.title}`,
      status: kantFel ? 'known-bug' : result.status,
      tid: result.duration,
      fel: kantFel ? undefined : fel || undefined,
    });
  }

  onEnd(result: FullResult) {
    const slut = new Date();
    const godkanda = this.rader.filter((r) => r.status === 'passed').length;
    const kandaFel = this.rader.filter((r) => r.status === 'known-bug').length;
    const misslyckade = this.rader.filter(
      (r) => !['passed', 'skipped', 'known-bug'].includes(r.status)
    ).length;
    const etikett = (status: string) =>
      ({ passed: 'Godkänd', skipped: 'Överhoppad', 'known-bug': 'Känt fel' })[status] ??
      'Misslyckad';

    const innehall: string[] = [
      `# Testrapport, Sydvatten kommuner`,
      ``,
      `- **Startad:** ${this.startTid.toLocaleString('sv-SE')}`,
      `- **Avslutad:** ${slut.toLocaleString('sv-SE')}`,
      `- **Miljö:** http://localhost:5173`,
      `- **Totalt resultat:** ${result.status}`,
      `- **Godkända:** ${godkanda} av ${this.rader.length}`,
      `- **Misslyckade:** ${misslyckade}`,
      `- **Kända fel:** ${kandaFel}`,
      ``,
      `## Tester`,
      ``,
      `| Test | Status | Tid (ms) |`,
      `|---|---|---|`,
      ...this.rader.map(
        (r) =>
          `| ${r.namn} | ${etikett(r.status)} | ${r.tid} |`
      ),
      ``,
    ];

    const misslyckadeRader = this.rader.filter((r) => r.fel);
    if (misslyckadeRader.length) {
      innehall.push(`## Felmeddelanden`, ``);
      for (const r of misslyckadeRader) {
        innehall.push(`### ${r.namn}`, '```', r.fel!, '```', ``);
      }
    }

    const mapp = join(process.cwd(), 'rapporter');
    mkdirSync(mapp, { recursive: true });
    const datum = slut.toISOString().replace(/[:.]/g, '-');
    const filnamn = `rapport-${datum}.md`;
    writeFileSync(join(mapp, filnamn), innehall.join('\n'));
    console.log(`Rapport sparad: rapporter/${filnamn}`);
  }
}