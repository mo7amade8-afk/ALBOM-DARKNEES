

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

// =============================
// Import Data Files
// =============================
import images from "./Data/images.js";
import videos from "./Data/Videos.js";
import texts from "./Data/texts.js";
import links from "./Data/Links.js";
import audios from "./Data/Oudeos.js";

const app = express();
app.use(bodyParser.json());

const TOKEN = process.env.BOT_TOKEN;
const TELEGRAM = `https://api.telegram.org/bot${TOKEN}/`;

// =============================
// Send Text Message
// =============================
async function sendMessage(chatId, text) {
  await axios.post(TELEGRAM + "sendMessage", {
    chat_id: chatId,
    text: text,
  });
}

// =============================
// Send Photo
// =============================
async function sendPhoto(chatId, url) {
  await axios.post(TELEGRAM + "sendPhoto", {
    chat_id: chatId,
    photo: url,
  });
}

// =============================
// Send Video
// =============================
async function sendVideo(chatId, url) {
  await axios.post(TELEGRAM + "sendVideo", {
    chat_id: chatId,
    video: url,
  });
}

// =============================
// Send Audio
// =============================
async function sendAudio(chatId, url) {
  await axios.post(TELEGRAM + "sendAudio", {
    chat_id: chatId,
    audio: url,
  });
}

// =============================
// Webhook Endpoint
// =============================
app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  try {
    const msg = req.body.message;
    if (!msg) return;

    const chatId = msg.chat.id;
    const text = msg.text?.trim();

    if (text === "/start") {
      return sendMessage(chatId, "Bot is ready. Send a command.");
    }

    if (images[text]) return sendPhoto(chatId, images[text]);
    if (videos[text]) return sendVideo(chatId, videos[text]);
    if (audios[text]) return sendAudio(chatId, audios[text]);
    if (texts[text]) return sendMessage(chatId, texts[text]);
    if (links[text]) return sendMessage(chatId, links[text]);

    sendMessage(chatId, "Unknown command.");
  } catch (error) {
    console.log("Error:", error);
  }
});

// =============================
// Run Server
// =============================
app.listen(3000, () => {
  console.log("Bot server is running...");
});
