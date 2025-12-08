export class Torrent {
  identifier
  name
  description
  magnet
  owner
  timestamp

  constructor (identifier, name, description, magnet, owner, timestamp) {
    this.identifier = identifier
    this.name = name
    this.description = description
    this.magnet = magnet
    this.owner = owner
    this.timestamp = timestamp
  }
}
