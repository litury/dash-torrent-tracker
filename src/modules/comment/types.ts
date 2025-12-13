export interface Comment {
  id: string
  torrentId: string
  text: string
  owner: string
  createdAt: Date
}

// TODO: Set to false when backend adds comment to Data Contract
export const USE_MOCK = true

// Mock data for development
export const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    torrentId: 'mock-torrent-id',
    text: 'Great torrent, thanks for sharing!',
    owner: '7abc123def456ghi789jkl012mno345pqr678stu901vwx',
    createdAt: new Date('2025-12-12T10:00:00')
  },
  {
    id: '2',
    torrentId: 'mock-torrent-id',
    text: 'Works perfectly, fast download. The quality is amazing and everything is as described.',
    owner: '8xyz789ghi012jkl345mno678pqr901stu234vwx567yza',
    createdAt: new Date('2025-12-13T15:30:00')
  }
]
