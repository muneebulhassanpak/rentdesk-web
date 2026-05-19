import { expect, test } from "@playwright/test"

test.describe("Auth pages", () => {
  test("login page renders with form fields", async ({ page }) => {
    await page.goto("/login")
    await expect(
      page.getByRole("heading", { name: "Welcome back" })
    ).toBeVisible()
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
  })

  test("login form shows validation errors on empty submit", async ({
    page,
  }) => {
    await page.goto("/login")
    await page.getByRole("button", { name: "Sign in" }).click()
    await expect(page.getByText("Email is required")).toBeVisible()
    await expect(page.getByText("Password is required")).toBeVisible()
  })

  test("login form shows error for invalid email", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel("Email").fill("not-an-email")
    await page.getByPlaceholder("Enter your password").fill("password123")
    await page.getByRole("button", { name: "Sign in" }).click()
    await expect(page.getByText("Invalid email address")).toBeVisible()
  })

  test("register page renders", async ({ page }) => {
    await page.goto("/register")
    await expect(page.getByRole("heading", { name: /create/i })).toBeVisible()
    await expect(page.getByLabel("Full name")).toBeVisible()
    await expect(page.getByLabel("Email")).toBeVisible()
  })

  test("forgot password page renders", async ({ page }) => {
    await page.goto("/forgot-password")
    await expect(page.getByLabel("Email")).toBeVisible()
  })

  test("login page has navigation links", async ({ page }) => {
    await page.goto("/login")
    await expect(
      page.getByRole("link", { name: "Forgot password?" })
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "Create one" })).toBeVisible()
    await expect(page.getByRole("link", { name: /magic link/i })).toBeVisible()
  })

  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/landlord")
    await page.waitForURL("**/login")
    await expect(
      page.getByRole("heading", { name: "Welcome back" })
    ).toBeVisible()
  })
})
