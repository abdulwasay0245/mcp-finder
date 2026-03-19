export type MCPServer = {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  use_cases: string[]
  github_url: string
  npm_package: string
  supported_os: string[]
  supported_editors: string[]
  config_template: Record<string, any>
  stars: number
  similarity?: number
}

export type ConfigOptions = {
  os: 'mac' | 'windows' | 'linux'
  editor: 'claude' | 'cursor' | 'vscode' | 'windsurf'
}