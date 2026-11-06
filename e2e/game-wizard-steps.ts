import type { Locator } from "@playwright/test";

/**
 * The New Game wizard's current step title. The classic layout heads each step with an h4; the new
 * desktop layout drops it for a row of numbered step tabs, where the current one is marked.
 */
export function wizardStepHeading(wizard: Locator): Locator {
  return wizard
    .locator('nav[aria-label="Setup steps"] [aria-current="step"]')
    .or(wizard.getByRole("heading", { level: 4 }))
    .first();
}

/** The step's title without the tab's number. */
export async function wizardStepTitle(wizard: Locator): Promise<string> {
  return (await wizardStepHeading(wizard).innerText()).replace(/^\s*\d+\s*/u, "").trim();
}

/** Next, which the new layout names with the step it leads to ("Next: World"). */
export function wizardNextButton(wizard: Locator): Locator {
  return wizard.getByRole("button", { name: /^Next(?::.*)?$/u });
}
