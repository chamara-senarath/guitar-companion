import type { NoteRole } from './music'

export const ROLE_COLORS: Record<NoteRole, string> = {
  root: '#f5b942',
  third: '#fb7185',
  fifth: '#38bdf8',
  seventh: '#a78bfa',
  second: '#2dd4bf',
  fourth: '#2dd4bf',
}

export const ROLE_LABELS: Record<NoteRole, string> = {
  root: 'Root',
  third: 'Third',
  fifth: 'Fifth',
  seventh: 'Seventh',
  second: '2nd (sus)',
  fourth: '4th (sus)',
}
