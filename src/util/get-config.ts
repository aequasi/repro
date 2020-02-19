import EnvPath from 'env-paths'
import fs from 'fs'
import path from 'path'
import downloadUrlToFile from './download-url'

const packageJson = require('../../package.json')
const configPath  = EnvPath(packageJson.name).config // eslint-disable-line new-cap

interface Config {
  package: {
    [key: string]: any;
  };
  files: {
    path: string;
    content?: string;
    url?: string;
    localUrl?: string;
    permissions?: number;
  }[];
}

type ConfigFn = (config: {version: string; repo: string}) => Config;

export function getLocalConfig(repo: string, version: string): ConfigFn | undefined {
  const pth = path.join(configPath, repo)

  if (fs.existsSync(path.join(process.cwd(), '.repro.js'))) {
    return require(path.join(process.cwd(), '.repro.js'))
  }

  if (fs.existsSync(path.join(pth, version + '.js'))) {
    return require(path.join(pth, version + '.js'))
  }
}

export async function getRemoteConfig(repo: string, version: string): Promise<void> {
  const vrs = version === 'latest' ? 'master' : version

  await downloadUrlToFile(
    `https://raw.githubusercontent.com/${repo}/${vrs}/.repro.js`,
    path.join(configPath, repo, version + '.js')
  )
}

export default async function getConfig(repo: string, version = 'latest'): Promise<Config | undefined> {
  let config = getLocalConfig(repo, version)
  if (!config) {
    await getRemoteConfig(repo, version)
    config = getLocalConfig(repo, version)
  }

  if (!config) {
    throw new Error('Config not found for ' + repo + '@' + version)
  }

  return config({repo, version})
}
