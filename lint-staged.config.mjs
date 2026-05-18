const lintStagedConfig = {
  "*.{ts,tsx,js,jsx,json,css,md}": (filenames) => {
    const files = filenames.join(" ")
    return [`npx prettier --write ${files}`]
  },
  "*.{ts,tsx}": (filenames) => {
    const files = filenames.join(" ")
    return [`npx eslint --fix --max-warnings=0 ${files}`]
  },
}

export default lintStagedConfig
