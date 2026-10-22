export function getUrl(filename: string): string {
  return (process.env.NEXT_PUBLIC_URL_PREFIX ?? '') + filename
}
