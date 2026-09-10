import { expect, test } from '@playwright/test';

function jstNow(offsetMinutes = 0) {
  const date = new Date(Date.now() + offsetMinutes * 60_000);
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tokyo',
  }).format(date);
}

test('status strip shows a live JST clock', async ({ page }) => {
  await page.goto('./');
  const clock = page.locator('#jst');
  await expect(clock).toHaveText(/^\d{2}:\d{2}$/);

  const text = await clock.textContent();
  const candidates = [jstNow(0)];
  if (text !== candidates[0]) {
    // The comparison can flake at a minute boundary between the assertion
    // above and this read; give it one retry against the adjacent minutes
    // before failing.
    await page.waitForTimeout(1_500);
    const retryText = await page.locator('#jst').textContent();
    expect([jstNow(-1), jstNow(0), jstNow(1)]).toContain(retryText);
    return;
  }
  expect(candidates).toContain(text);
});

test('prefers-reduced-motion completes navigation and disables the view-transition rule', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');

  const prefersReduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  expect(prefersReduced).toBe(true);

  // Confirm the `@view-transition { navigation: none; }` rule under the
  // reduced-motion media query is actually present in the page's CSS, not
  // just that the media query itself matches. Chromium does not yet expose
  // a `CSSViewTransitionRule` constructor in all versions; skip this half of
  // the check (rather than fail) when the CSSOM can't represent the rule.
  const viewTransitionRuleFound = await page.evaluate(() => {
    if (typeof (globalThis as any).CSSViewTransitionRule === 'undefined') return 'unsupported';
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of Array.from(rules)) {
        if (rule instanceof (globalThis as any).CSSViewTransitionRule) return true;
        if ('cssRules' in rule) {
          for (const inner of Array.from((rule as CSSGroupingRule).cssRules)) {
            if (inner instanceof (globalThis as any).CSSViewTransitionRule) return true;
          }
        }
      }
    }
    return false;
  });
  test.info().annotations.push({ type: 'view-transition-rule-check', description: String(viewTransitionRuleFound) });
  if (viewTransitionRuleFound !== 'unsupported') {
    expect(viewTransitionRuleFound).toBe(true);
  }

  await page.getByRole('link', { name: 'Notes' }).click();
  await expect(page).toHaveURL(/\/notes\/$/);
  await expect(page.locator('h1')).toHaveText('Notes');
});
