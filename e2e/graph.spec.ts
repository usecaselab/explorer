import { test, expect, Page } from '@playwright/test'

// The transformed group carries the pan/zoom state as
// `translate(x y) scale(k)`. Reading it back is the cleanest observable for
// asserting that an interaction moved or zoomed the view.
async function getView(page: Page): Promise<{ x: number; y: number; k: number }> {
  const g = page.locator('svg[role="application"] > g[transform^="translate"]').first()
  const t = await g.getAttribute('transform')
  const m = t?.match(/translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\)/)
  if (!m) throw new Error(`could not parse transform: ${t}`)
  return { x: parseFloat(m[1]), y: parseFloat(m[2]), k: parseFloat(m[3]) }
}

// Wait for the graph to have rendered its transformed group (data loaded,
// layout computed).
async function waitForGraph(page: Page) {
  await page.locator('svg[role="application"] > g[transform^="translate"]').first().waitFor()
}

test.describe('graph keyboard control', () => {
  test('arrows pan, +/- zoom, 0 resets', async ({ page }) => {
    await page.goto('/')
    await waitForGraph(page)

    const svg = page.locator('svg[role="application"]')
    await svg.focus()

    const before = await getView(page)

    // ArrowRight pans the view left by a fixed step (x decreases).
    await page.keyboard.press('ArrowRight')
    const afterPan = await getView(page)
    expect(afterPan.x).toBeLessThan(before.x)
    expect(afterPan.k).toBeCloseTo(before.k, 5)

    // '+' zooms in (scale increases), '-' zooms out.
    await page.keyboard.press('+')
    const afterZoomIn = await getView(page)
    expect(afterZoomIn.k).toBeGreaterThan(afterPan.k)

    await page.keyboard.press('-')
    const afterZoomOut = await getView(page)
    expect(afterZoomOut.k).toBeLessThan(afterZoomIn.k)

    // '0' resets to the identity view.
    await page.keyboard.press('0')
    const reset = await getView(page)
    expect(reset).toEqual({ x: 0, y: 0, k: 1 })
  })

  test('persona node is focusable and Enter navigates to its page', async ({ page }) => {
    await page.goto('/')
    await waitForGraph(page)

    const persona = page.locator('g[role="button"][aria-label^="Persona:"]').first()
    await persona.focus()

    // Focusing a persona draws a focus ring (a stroked circle inside the node).
    await expect(persona.locator('circle[stroke][fill="none"]')).toHaveCount(1)

    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/persona\//)
  })
})

test.describe('graph touch interaction', () => {
  test.use({ hasTouch: true })

  test('first tap pins (highlights), second tap activates', async ({ page }) => {
    await page.goto('/')
    await waitForGraph(page)

    const persona = page.locator('g[role="button"][aria-label^="Persona:"]').first()
    const box = await persona.boundingBox()
    if (!box) throw new Error('persona node has no bounding box')
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2

    // First tap: pins the persona, highlighting connected edges — does NOT
    // navigate (hover does not exist on touch, so tap stands in for it).
    await page.touchscreen.tap(cx, cy)
    await expect(page).toHaveURL(/\/$/)
    // A pinned persona highlights its edges in orange (#f97316).
    await expect(page.locator('svg line[stroke="#f97316"]').first()).toBeVisible()

    // Second tap on the same node activates it.
    await page.touchscreen.tap(cx, cy)
    await expect(page).toHaveURL(/\/persona\//)
  })

  test('pinch gesture zooms the view in', async ({ page }) => {
    await page.goto('/')
    await waitForGraph(page)

    const before = await getView(page)

    // Playwright has no first-class pinch, so dispatch two synthetic touch
    // pointers and spread them apart. These bubble to React's delegated
    // pointer listeners exactly like real touch input.
    await page.evaluate(() => {
      const svg = document.querySelector('svg[role="application"]') as SVGElement
      const rect = svg.getBoundingClientRect()
      const midX = rect.left + rect.width / 2
      const midY = rect.top + rect.height / 2
      const fire = (type: string, id: number, x: number, y: number) =>
        svg.dispatchEvent(
          new PointerEvent(type, {
            pointerId: id,
            pointerType: 'touch',
            clientX: x,
            clientY: y,
            bubbles: true,
            cancelable: true,
          })
        )
      // Two fingers start 40px apart, end 240px apart -> ~6x finger spread.
      fire('pointerdown', 1, midX - 20, midY)
      fire('pointerdown', 2, midX + 20, midY)
      for (let i = 1; i <= 6; i++) {
        const off = 20 + i * (100 / 6)
        fire('pointermove', 1, midX - off, midY)
        fire('pointermove', 2, midX + off, midY)
      }
      fire('pointerup', 1, midX - 120, midY)
      fire('pointerup', 2, midX + 120, midY)
    })

    const after = await getView(page)
    expect(after.k).toBeGreaterThan(before.k)
  })
})
