import express from "express";
import axios from "axios";
import * as SunCalc from "suncalc";

const app = express();
const port = 3000;

// Lusaka
const lat = -15.39;
const lng = 28.32;

app.use(express.static("public"));

//  TIME HELPER

function formatTime(date) {
  if (!date) {
    return "not today";
  }
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Lusaka",
  });
}

//  GET TONIGHT'S SKY

app.get("/", async (req, res) => {
  try {
    const now = new Date();

    // 1. Sky math (no internet needed)
    const times = SunCalc.getTimes(now, lat, lng);
    const moon = SunCalc.getMoonIllumination(now);
    const moonTimes = SunCalc.getMoonTimes(now, lat, lng);

    const sunset = formatTime(times.sunset);
    const moonPercent = Math.round(moon.fraction * 100);
    const moonrise = formatTime(moonTimes.rise);

    // 2. Work out if the moon is actually visible tonight
    const moonUpAtSunset =
      SunCalc.getMoonPosition(times.sunset, lat, lng).altitude > 0;
    const risesTonight = moonTimes.rise && moonTimes.rise > times.sunset;

    let moonLine;
    if (moonPercent < 5) {
      moonLine = `It is a new moon (${moonPercent}% full), so the sky will get very dark about an hour after sunset, which is great for stars.`;
    } else if (moonUpAtSunset) {
      moonLine = `The moon is ${moonPercent}% full and is already in the sky at sunset.`;
    } else if (risesTonight) {
      moonLine = `The moon is ${moonPercent}% full and rises at ${moonrise}.`;
    } else {
      moonLine = `The moon is ${moonPercent}% full but it will not be visible tonight.`;
    }

    // 3. Ask Gemma (running locally on Ollama)

    const prompt = `You write short tips for going outside tonight. Copy the style of the example.

Example facts: Sunset is at 18:30. The moon is 60% full and rises at 20:15.
Example tip: Head out a little before sunset at 18:30 to catch the colours. The moon is 60% full and rises at 20:15, so stay out for it. Bring a jacket.

Facts: Sunset is at ${sunset}. ${moonLine}
Tip:`;

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "gemma3:1b",
      prompt: prompt,
      stream: false,
    });

    const plan = response.data.response;

    res.render("index.ejs", {
      sunset: sunset,
      moonPercent: moonPercent,
      moonrise: moonrise,
      plan: plan,
    });
  } catch (error) {
    console.error(error);
  }
});

//  START SERVER

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});