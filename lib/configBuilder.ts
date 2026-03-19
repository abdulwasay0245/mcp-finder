// Fills in OS-specific paths in config templates
export function buildConfig(
  template: Record<string, any>,
  os: string
): Record<string, any> {
  // Deep clone so we don't mutate the original
  const config = JSON.parse(JSON.stringify(template))
  const str = JSON.stringify(config)
    .replace(/\{\{CONFIG_DIR\}\}/g, getConfigDir(os))
    .replace(/\{\{HOME\}\}/g, getHome(os))
  return JSON.parse(str)
}

function getConfigDir(os: string): string {
  const map: Record<string, string> = {
    mac:     '~/Library/Application Support',
    windows: '%APPDATA%',
    linux:   '~/.config'
  }
  return map[os] ?? '~/.config'
}

function getHome(os: string): string {
  const map: Record<string, string> = {
    mac:     '~',
    windows: '%USERPROFILE%',
    linux:   '~'
  }
  return map[os] ?? '~'
}

// Returns where the config file lives per editor + OS
export function getConfigFilePath(os: string, editor: string): string {
  const paths: Record<string, Record<string, string>> = {
    claude: {
      mac:     '~/Library/Application Support/Claude/claude_desktop_config.json',
      windows: '%APPDATA%\\Claude\\claude_desktop_config.json',
      linux:   '~/.config/claude/claude_desktop_config.json'
    },
    cursor: {
      mac:     '~/.cursor/mcp.json',
      windows: '%USERPROFILE%\\.cursor\\mcp.json',
      linux:   '~/.cursor/mcp.json'
    },
    vscode: {
      mac:     '~/Library/Application Support/Code/User/settings.json',
      windows: '%APPDATA%\\Code\\User\\settings.json',
      linux:   '~/.config/Code/User/settings.json'
    },
    windsurf: {
      mac:     '~/.codeium/windsurf/mcp_config.json',
      windows: '%USERPROFILE%\\.codeium\\windsurf\\mcp_config.json',
      linux:   '~/.codeium/windsurf/mcp_config.json'
    }
  }
  return paths[editor]?.[os] ?? 'check your editor documentation'
}