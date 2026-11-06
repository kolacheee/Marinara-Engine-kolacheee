import { expect, type Page } from "@playwright/test";
import { openChatTool } from "./chat-settings-tools.js";

/**
 * Opens the game's journal: in the new layout (desktop) its Journal tab beside the game, else the Session
 * window's Journal, opened from its bubble (or the phone's Chat tools menu).
 */
export async function openGameJournal(page: Page) {
  await expect(
    page
      .locator(
        '.ov-gwrap, .mari-window-bubble[data-window="control:session"], .mari-window[data-window="control:session"], [data-chat-tools-menu-button]',
      )
      .first(),
  ).toBeVisible({ timeout: 40_000 });
  if (await page.locator(".ov-gwrap").first().isVisible()) {
    await page.locator(".ov-gpane__tabs").getByRole("tab", { name: "Journal", exact: true }).click();
    return;
  }
  const session = await openChatTool(page, "control:session");
  await session.getByRole("button", { name: "Journal", exact: true }).click();
}
