import EnvPath from 'env-paths'
import fs from 'fs-extra'
import path from 'path'
import downloadUrlToFile, {downloadUrl} from './download-url'

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

export async function getLocalConfig(repo: string, version: string): Promise<ConfigFn | undefined> {
  const pth = path.join(configPath, repo)

  if (await fs.pathExists(path.join(process.cwd(), '.repro.js'))) {
    return require(path.join(process.cwd(), '.repro.js'))
  }

  if (await fs.pathExists(path.join(pth, version, '.repro.js'))) {
    return require(path.join(pth, version, '.repro.js'))
  }
}

export async function getRemoteConfig(repo: string, version: string): Promise<void> {
  const vrs = version === 'latest' ? 'master' : version

  await fs.mkdirp(path.join(configPath, repo, version));
  const content = await downloadUrl(`https://raw.githubusercontent.com/${repo}/${vrs}/.repro.js`);
  if (!content.startsWith('404: Not Found')) {
    await fs.writeFile(path.join(configPath, repo, version, '.repro.js'), content);
  }
}

export default async function getConfig(repo: string, version = 'latest'): Promise<Config | undefined> {
  let config = await getLocalConfig(repo, version)
  if (!config) {
    await getRemoteConfig(repo, version)
    config = await getLocalConfig(repo, version)
  }

  if (!config) {
    const pth = path.join(configPath, repo)
    console.log('Create your own config by creating a .repro.js file in: ' + path.join(pth, version) + '/\n')

    throw new Error('Config not found for ' + repo + '@' + version)
  }

  return config({repo, version})
}
