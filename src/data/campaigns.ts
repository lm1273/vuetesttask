import raw from './data.json'
import type { Campaign } from '../types/types'

// A nyers JSON-t itt, egyetlen ponton tipizáljuk. Ha v2-ben API-ra váltunk
export const campaigns: Campaign[] = (raw as { campaigns: Campaign[] }).campaigns
