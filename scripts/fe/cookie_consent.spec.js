// @ts-check
import { test, expect } from "@playwright/test";
test("No tracking before consent", async ({ page }) => {
  await page.route('**/*analytics*', route => route.abort());
  await page.goto(process.env.STAGE_URL || "https://staging.example.tld/");
  const cookies = await page.context().cookies();
  const tracking = cookies.filter(c => /_ga|_fbp|amplitude/i.test(c.name));
  expect(tracking.length).toBe(0);
});
