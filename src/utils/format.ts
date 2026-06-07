export function formatPercent(ratio: number, digits = 0): string {
    return `${(ratio * 100).toFixed(digits)}%`
}
  
export function formatNumber(n: number): string {
    return n.toLocaleString('hu-HU')
}