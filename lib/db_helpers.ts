export type PaginationArgs = {
  limit: number
  cursor?: string
}

// format array so it can be used within SQL IN clause
// Ex. ['A','B','C'] => `("A","B","C")`
export function arrayToSqlList(array: string[]): string {
  if (!array.length) return '()'
  return `("${array.join('","')}")`
}
