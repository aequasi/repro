import fetch from 'node-fetch'
import fs from 'fs'

export async function downloadUrl(url: string): Promise<string> {
  const response = await fetch(url)

  return response.text()
}

export default async function downloadUrlToFile(url: string, location: string): Promise<void> {
  return fs.promises.writeFile(location, await downloadUrl(url))
}
