import { useState, useRef, useEffect, useCallback } from 'react'
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

  // Metronome state
  const [bpm, setBpm] = useState<number>(120)
  const [isPlaying, setIsPlaying] = useState(false)
  const [beat, setBeat] = useState(0)
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4)
  const audioContextRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<number | null>(null)

  const searchSongs = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setResults([])

    try {
      const apiKey = import.meta.env.VITE_GETSONGBPM_API_KEY
      if (!apiKey) {
        setError('API key not configured. Add VITE_GETSONGBPM_API_KEY to .env.local')
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

  const selectSong = (song: Song) => {
    const songBpm = parseInt(song.tempo, 10)
    if (songBpm > 0) {
      setBpm(songBpm)
      // Parse time signature for beats per measure
      if (song.time_sig) {
        const beats = parseInt(song.time_sig.split('/')[0], 10)
        if (beats > 0) setBeatsPerMeasure(beats)
      }
    }
    setResults([])
    setQuery('')
  }

  const playClick = useCallback((isDownbeat: boolean) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = isDownbeat ? 1000 : 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }, [])

  const startMetronome = useCallback(() => {
    if (intervalRef.current) return

    const interval = (60 / bpm) * 1000
    let currentBeat = 0

    const tick = () => {
      const isDownbeat = currentBeat === 0
      playClick(isDownbeat)
      setBeat(currentBeat)
      currentBeat = (currentBeat + 1) % beatsPerMeasure
    }

    tick() // Play immediately
    intervalRef.current = window.setInterval(tick, interval)
    setIsPlaying(true)
  }, [bpm, beatsPerMeasure, playClick])

  const stopMetronome = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPlaying(false)
    setBeat(0)
  }, [])

  const toggleMetronome = () => {
    if (isPlaying) {
      stopMetronome()
    } else {
      startMetronome()
    }
  }

  // Restart metronome when BPM changes while playing
  useEffect(() => {
    if (isPlaying) {
      stopMetronome()
      startMetronome()
    }
  }, [bpm, beatsPerMeasure])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="app">
      <header>
        <h1>🎵 Music Beats</h1>
        <p>Practice any song at the right tempo</p>
      </header>

      <section className="metronome">
        <div className="bpm-display">
          <button
            className="bpm-adjust"
            onClick={() => setBpm(b => Math.max(20, b - 5))}
          >
            −5
          </button>
          <div className="bpm-value">
            <span className="bpm-number">{bpm}</span>
            <span className="bpm-label">BPM</span>
          </div>
          <button
            className="bpm-adjust"
            onClick={() => setBpm(b => Math.min(300, b + 5))}
          >
            +5
          </button>
        </div>

        <div className="beat-indicator">
          {Array.from({ length: beatsPerMeasure }).map((_, i) => (
            <span
              key={i}
              className={`beat-dot ${beat === i && isPlaying ? 'active' : ''} ${i === 0 ? 'downbeat' : ''}`}
            />
          ))}
        </div>

        <button
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={toggleMetronome}
        >
          {isPlaying ? '⏹ Stop' : '▶ Start'}
        </button>

        <div className="time-sig-selector">
          <label>Time:</label>
          {[3, 4, 5, 6].map(n => (
            <button
              key={n}
              className={`time-sig-btn ${beatsPerMeasure === n ? 'active' : ''}`}
              onClick={() => setBeatsPerMeasure(n)}
            >
              {n}/4
            </button>
          ))}
        </div>
      </section>

      <section className="search-section">
        <h2>Find a song's tempo</h2>
        <form onSubmit={searchSongs} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter song title..."
            className="search-input"
          />
          <button type="submit" disabled={loading} className="search-button">
            {loading ? '...' : '🔍'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {results.length > 0 && (
          <div className="results">
            {results.slice(0, 5).map((song) => (
              <button
                key={song.id}
                className="song-card"
                onClick={() => selectSong(song)}
              >
                <div className="song-info">
                  <span className="song-title">{song.title}</span>
                  <span className="song-artist">{song.artist?.name}</span>
                </div>
                <div className="song-tempo">
                  {song.tempo ? `${song.tempo} BPM` : '—'}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <footer>
        <p>
          Song data from <a href="https://getsongbpm.com" target="_blank" rel="noopener noreferrer">GetSongBPM</a>
        </p>
      </footer>
    </div>
  )
}

export default App
