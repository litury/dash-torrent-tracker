import { useState, useEffect } from 'react'
import { NETWORK } from '../../config/constants'
import githubIcon from '../../assets/socials/github.svg'
import xIcon from '../../assets/socials/x.svg'
import discordIcon from '../../assets/socials/discord.svg'
import telegramIcon from '../../assets/socials/telegram.svg'

const SOCIALS = [
  { icon: githubIcon, href: 'https://github.com/dashpay', label: 'GitHub' },
  { icon: xIcon, href: 'https://twitter.com/Dashpay', label: 'X' },
  { icon: discordIcon, href: 'https://discord.gg/dash', label: 'Discord' },
  { icon: telegramIcon, href: 'https://t.me/dash_chat', label: 'Telegram' }
]

export const Footer = () => {
  const [time, setTime] = useState(new Date())
  const isTestnet = NETWORK === 'testnet'

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = () => {
    const timeStr = time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    const dateStr = time.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return `${timeStr} · ${dateStr} (${timezone})`
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 lg:left-64 bg-dash-white dark:bg-dash-dark border-t border-dash-dark-15 dark:border-dash-white-15 px-4 lg:px-8 py-4 z-40">
      <div className="flex items-center justify-between text-dash-dark-75 dark:text-dash-white-75">
        {/* Left: Network + Copyright */}
        <div className="text-xs font-mono hidden sm:flex sm:items-center sm:gap-2">
          <span className={`font-medium ${
            isTestnet ? 'text-warning' : 'text-success'
          }`}>
            {isTestnet ? 'testnet' : 'mainnet'}
          </span>
          <span>·</span>
          <span>2025 © Dash Torrent Tracker</span>
        </div>

        {/* Center: Socials with pshenmic.dev in middle */}
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          {SOCIALS.slice(0, 2).map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-dash-dark-5 dark:bg-dash-white-15 hover:bg-dash-dark-15 dark:hover:bg-dash-white-25 transition-colors"
              title={label}
            >
              <img src={icon} alt={label} className="w-4 h-4 dark:invert" />
            </a>
          ))}
          <a
            href="https://pshenmic.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono hover:text-dash-blue transition-colors px-2"
          >
            pshenmic.dev
          </a>
          {SOCIALS.slice(2).map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-dash-dark-5 dark:bg-dash-white-15 hover:bg-dash-dark-15 dark:hover:bg-dash-white-25 transition-colors"
              title={label}
            >
              <img src={icon} alt={label} className="w-4 h-4 dark:invert" />
            </a>
          ))}
        </div>

        {/* Right: Clock */}
        <div className="text-xs font-mono text-right hidden sm:block">
          {formatTime()}
        </div>
      </div>
    </footer>
  )
}
