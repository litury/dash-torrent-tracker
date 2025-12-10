export interface Torrent {
  identifier: string
  name: string
  description: string
  magnet: string
  owner: string
  timestamp: Date
}

export const createTorrent = (
  _identifier: string,
  _name: string,
  _description: string,
  _magnet: string,
  _owner: string,
  _timestamp: Date
): Torrent => ({
  identifier: _identifier,
  name: _name,
  description: _description,
  magnet: _magnet,
  owner: _owner,
  timestamp: _timestamp
})
