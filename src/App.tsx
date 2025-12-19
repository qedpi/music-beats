import { useState } from 'react'
import './App.css'

interface Song {
  id: string
  title: string
  artist: { name: string }
  tempo: string
  key_of: string
  time_sig: string
}

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchSongs = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setResults([])

    try {
      // Note: In production, proxy through backend to protect API key
      const apiKey = import.meta.env.VITE_GETSONGBPM_API_KEY
      if (!apiKey) {
        setError('API key not configured')
        return
      }

      const response = await fetch(
        `https://api.getsongbpm.com/search/?api_key=${apiKey}&type=song&lookup=${encodeURIComponent(query)}`
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setResults(data.search || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🎵 Music Beats</h1>
        <p>Find BPM, key, and tempo for any song</p>
      </header>

      <form onSubmit={searchSongs} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song..."
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="results">
        {results.map((song) => (
          <div key={song.id} className="song-card">
            <h3>{song.title}</h3>
            <p className="artist">{song.artist?.name || 'Unknown Artist'}</p>
            <div className="song-details">
              {song.tempo && (
                <span className="detail">
                  <strong>BPM:</strong> {song.tempo}
                </span>
              )}
              {song.key_of && (
                <span className="detail">
                  <strong>Key:</strong> {song.key_of}
                </span>
              )}
              {song.time_sig && (
                <span className="detail">
                  <strong>Time:</strong> {song.time_sig}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <footer>
        <p>
          Powered by <a href="https://getsongbpm.com" target="_blank" rel="noopener noreferrer">GetSongBPM</a>
        </p>
      </footer>
    </div>
  )
}

export default App
