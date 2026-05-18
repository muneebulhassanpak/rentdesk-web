import fs from "fs"

const filePath = ".env.example"

if (!fs.existsSync(filePath)) {
  console.warn(".env.example not found — skipping check.")
  process.exit(0)
}

const content = fs.readFileSync(filePath, "utf-8")
const lines = content.split("\n").filter((l) => l.trim() && !l.startsWith("#"))

const violations = lines.filter((line) => {
  const [, value] = line.split("=")
  return value && value.trim().length > 0
})

if (violations.length > 0) {
  console.error("ERROR: .env.example must not contain values:")
  violations.forEach((v) => console.error(`  ${v}`))
  process.exit(1)
}

console.error(".env.example check passed.")
