# 🎵 Music Beats

A simple BPM and key finder for any song. Search for a song and instantly see its tempo, musical key, and time signature.

## Features

- 🔍 Search songs by title and artist
- 🥁 View BPM (beats per minute)
- 🎹 See musical key
- ⏱️ Check time signature
- 🌙 Dark mode support

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Add your GetSongBPM API key to .env.local

# Start development server
bun dev
```

## Environment Variables

Create a `.env.local` file:

```
VITE_GETSONGBPM_API_KEY=your_api_key_here
```

Get your free API key at [GetSongBPM](https://getsongbpm.com/api).

## Tech Stack

- [React](https://react.dev) - UI library
- [Vite](https://vite.dev) - Build tool
- [TypeScript](https://typescriptlang.org) - Type safety

## Data Source

Song data powered by [GetSongBPM](https://getsongbpm.com) - the comprehensive database for BPM, key, and tempo information.

## License

MIT
