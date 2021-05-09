export function toEncodedString(string: string): string {
  return Buffer.from(string).toString('base64')
}

export function fromEncodedString(string: string): string {
  return Buffer.from(string, 'base64').toString('ascii')
}
