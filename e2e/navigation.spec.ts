import { expect, test } from "@playwright/test"

test.describe("Navigation", () => {
  test("root redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/")
    await page.waitForURL("**/login")
    await expect(page).toHaveURL(/\/login/)
  })

  test("auth pages are accessible without login", async ({ page }) => {
    for (const path of [
      "/login",
      "/register",
      "/forgot-password",
      "/magic-link",
    ]) {
      await page.goto(path)
      await expect(page).toHaveURL(new RegExp(path))
    }
  })

  test("protected routes redirect to login", async ({ page }) => {
    for (const path of [
      "/landlord",
      "/tenants",
      "/properties",
      "/leases",
      "/payments",
    ]) {
      await page.goto(path)
      await page.waitForURL("**/login")
    }
  })
})
