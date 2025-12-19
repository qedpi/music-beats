# 🎵 Music Beats

A practice metronome that syncs to any song's tempo. Search for a song, and instantly start practicing at the correct BPM.

**[Try it live →](https://qedpi.github.io/music-beats)**

## Features

- 🥁 **Smart Metronome** - Visual beat indicator with accented downbeats
- 🔍 **Song Search** - Find any song's BPM instantly
- ⏱️ **Time Signatures** - Switch between 3/4, 4/4, 5/4, 6/4
- 🎹 **One-Click Sync** - Select a song to set the metronome automatically
- 🌙 **Dark Mode** - Respects system preferences
- 📱 **Mobile Ready** - Works great on phones for practice sessions

## Use Cases

- **Musicians** - Practice songs at the correct tempo
- **Drummers** - Lock in to the right groove before playing
- **Dancers** - Find songs at your preferred BPM
- **DJs** - Quick tempo reference for mixing

## Getting Started

```bash
bun install
bun dev
```

## Environment Setup

Create `.env.local` with your API key:

```
VITE_GETSONGBPM_API_KEY=your_key_here
```

Get a free API key at [GetSongBPM](https://getsongbpm.com/api).

## Tech Stack

- [React 19](https://react.dev)
- [Vite](https://vite.dev)
- [TypeScript](https://typescriptlang.org)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) for metronome clicks

## Data Sources

- Song tempo data from [GetSongBPM](https://getsongbpm.com)

## License

MIT
