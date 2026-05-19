import { expect, test } from "@playwright/test"

// Generate unique email per test run to avoid 409 Conflict
const uniqueEmail = () =>
  `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.demo`

test.describe("Authenticated flows", () => {
  test.describe.configure({ mode: "serial" })

  let email: string

  test.beforeAll(() => {
    email = uniqueEmail()
  })

  test("register a new landlord and land on dashboard", async ({ page }) => {
    await page.goto("/register")

    await page.getByLabel("Full name").fill("E2E Test User")
    await page.getByLabel("Email").fill(email)
    await page.getByLabel("Organization name").fill("E2E Test Properties")
    await page.getByPlaceholder("Min. 8 characters").fill("testpass123")
    await page.getByPlaceholder("Repeat your password").fill("testpass123")

    await page.getByRole("button", { name: "Create account" }).click()

    // Should redirect to landlord dashboard
    await page.waitForURL("**/landlord", { timeout: 15000 })
    await expect(page).toHaveURL(/\/landlord/)

    // Sidebar should be visible with nav items
    await expect(page.getByTestId("app-sidebar")).toBeVisible()
  })

  test("sidebar navigation works after login", async ({ page }) => {
    // Re-register to get a fresh session (login has backend 500)
    const freshEmail = uniqueEmail()
    await page.goto("/register")
    await page.getByLabel("Full name").fill("Nav Test User")
    await page.getByLabel("Email").fill(freshEmail)
    await page.getByLabel("Organization name").fill("Nav Test Org")
    await page.getByPlaceholder("Min. 8 characters").fill("testpass123")
    await page.getByPlaceholder("Repeat your password").fill("testpass123")
    await page.getByRole("button", { name: "Create account" }).click()
    await page.waitForURL("**/landlord", { timeout: 15000 })

    // Navigate to Properties
    await page.getByTestId("nav-item-properties").click()
    await page.waitForURL("**/properties")
    await expect(page.getByTestId("page-header")).toBeVisible()
    await expect(page.getByTestId("page-title")).toHaveText("Properties")

    // Navigate to Tenants
    await page.getByTestId("nav-item-tenants").click()
    await page.waitForURL("**/tenants")
    await expect(page.getByTestId("page-title")).toHaveText("Tenants")

    // Navigate to Leases
    await page.getByTestId("nav-item-leases").click()
    await page.waitForURL("**/leases")
    await expect(page.getByTestId("page-title")).toHaveText("Leases")

    // Navigate to Payments
    await page.getByTestId("nav-item-payments").click()
    await page.waitForURL("**/payments")
    await expect(page.getByTestId("page-title")).toHaveText("Payments", {
      timeout: 15000,
    })
  })

  test("properties page shows empty state", async ({ page }) => {
    const freshEmail = uniqueEmail()
    await page.goto("/register")
    await page.getByLabel("Full name").fill("Empty State User")
    await page.getByLabel("Email").fill(freshEmail)
    await page.getByLabel("Organization name").fill("Empty Org")
    await page.getByPlaceholder("Min. 8 characters").fill("testpass123")
    await page.getByPlaceholder("Repeat your password").fill("testpass123")
    await page.getByRole("button", { name: "Create account" }).click()
    await page.waitForURL("**/landlord", { timeout: 15000 })

    await page.getByTestId("nav-item-properties").click()
    await page.waitForURL("**/properties")

    // Fresh org has no properties — expect empty state
    await expect(page.getByTestId("empty-state")).toBeVisible()
  })

  test("payments page loads for authenticated user", async ({ page }) => {
    const freshEmail = uniqueEmail()
    await page.goto("/register")
    await page.getByLabel("Full name").fill("Payments User")
    await page.getByLabel("Email").fill(freshEmail)
    await page.getByLabel("Organization name").fill("Payments Org")
    await page.getByPlaceholder("Min. 8 characters").fill("testpass123")
    await page.getByPlaceholder("Repeat your password").fill("testpass123")
    await page.getByRole("button", { name: "Create account" }).click()
    await page.waitForURL("**/landlord", { timeout: 15000 })

    await page.getByTestId("nav-item-payments").click()
    await page.waitForURL("**/payments")

    // Should see page header and either empty state or payment list
    await expect(page.getByTestId("page-title")).toHaveText("Payments", {
      timeout: 15000,
    })
    // Wait for content to load — either empty state or data table
    await expect(
      page.getByTestId("empty-state").or(page.getByTestId("data-table"))
    ).toBeVisible({ timeout: 15000 })
  })

  test("logout redirects to login page", async ({ page }) => {
    const freshEmail = uniqueEmail()
    await page.goto("/register")
    await page.getByLabel("Full name").fill("Logout User")
    await page.getByLabel("Email").fill(freshEmail)
    await page.getByLabel("Organization name").fill("Logout Org")
    await page.getByPlaceholder("Min. 8 characters").fill("testpass123")
    await page.getByPlaceholder("Repeat your password").fill("testpass123")
    await page.getByRole("button", { name: "Create account" }).click()
    await page.waitForURL("**/landlord", { timeout: 15000 })

    // Click sign out in sidebar footer
    await page.getByRole("button", { name: "Sign out" }).click()

    await page.waitForURL("**/login")
    await expect(
      page.getByRole("heading", { name: "Welcome back" })
    ).toBeVisible()

    // Verify we can't access protected pages anymore
    await page.goto("/landlord")
    await page.waitForURL("**/login")
  })
})
