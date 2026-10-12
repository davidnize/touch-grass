# 🌙 Tonight's Sky

A small web page that tells you when to step outside and look up.

It works out today's sunset time and the moon's phase, then a local AI model (Gemma, running through Ollama) turns those facts into a short, friendly tip:

> Head out a little before sunset at 18:05. It's a new moon, so the sky will get very dark about an hour after, perfect for stargazing. Bring a flashlight.

Built for the Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass.

## How it works

1. `suncalc` calculates sunset, moon phase and moonrise from your coordinates and the clock.
2. The code turns those numbers into one clear sentence (for example "It is a new moon" or "The moon is 60% full and rises at 20:15").
3. Gemma (`gemma3:1b`) writes the tip from that sentence, running locally through Ollama.
4. Express and EJS show the result on one page.

No API key and no online AI service. After the one-time setup, everything runs on your own computer.

## Built with

- Node.js, Express, EJS, Axios
- [suncalc](https://github.com/mourner/suncalc)
- [Ollama](https://ollama.com) with the open-weight [Gemma](https://ai.google.dev/gemma) model

## Setup

1. Install [Node.js](https://nodejs.org) and [Ollama](https://ollama.com).
2. Download the model:
   ```
   ollama pull gemma3:1b
   ```
3. Install the packages:
   ```
   npm install
   ```
4. Start the app:
   ```
   node index.js
   ```
   (or `nodemon index.js` if you have nodemon)
5. Open http://localhost:3000

Make sure Ollama is running before you open the page.

## Change the location

At the top of `index.js`, change `lat` and `lng` to your own coordinates:

```js
const lat = -15.39;
const lng = 28.32;
```

Also change `timeZone: "Africa/Lusaka"` in the `formatTime` function to your own time zone.

## Use it on a phone

If your phone is on the same Wi-Fi (or hotspot) as the computer running the app, find the computer's address and open `http://THAT-ADDRESS:3000` on the phone. On a Mac:

```
ipconfig getifaddr en0
```

## Project structure

```
index.js              server, sky math and the call to Ollama
views/index.ejs       the page
views/partials/       header and footer
public/styles/        main.css
```
