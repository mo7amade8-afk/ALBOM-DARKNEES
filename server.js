
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import images from "./images.js";
import videos from "./videos.js";
import audios from "./audios.js";
import texts from "./texts.js";
import links from "./links.js";
import file from "./file.js";

const app = express();
app.use(bodyParser.json());

const TOKEN = process.env.BOT_TOKEN;
const TELEGRAM = `https://api.telegram.org/bot${TOKEN}/`;

async function sendMessage(chatId, text) {
  await axios.post(TELEGRAM + "sendMessage", { chat_id: chatId, text });
}

async function sendPhoto(chatId, url) {
  await axios.post(TELEGRAM + "sendPhoto", { chat_id: chatId, photo: url });
}

async function sendVideo(chatId, url) {
  await axios.post(TELEGRAM + "sendVideo", { chat_id: chatId, video: url });
}

async function sendAudio(chatId, url) {
  await axios.post(TELEGRAM + "sendAudio", { chat_id: chatId, audio: url });
}

async function sendFile(chatId, url) {
  await axios.post(TELEGRAM + "sendDocument", { chat_id: chatId, document: url });
}

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  try {
    const msg = req.body.message;
    if (!msg) return;

    const chatId = msg.chat.id;
    const text = msg.text?.trim();

    if (text === "/start") return sendMessage(chatId, "Bot is ready. 👑");

    if (images[text]) return sendPhoto(chatId, images[text]);
    if (videos[text]) return sendVideo(chatId, videos[text]);
    if (audios[text]) return sendAudio(chatId, audios[text]);
    if (texts[text]) return sendMessage(chatId, texts[text]);
    if (links[text]) return sendMessage(chatId, links[text]);
    if (files[text]) return sendFile(chatId, files[text]);

    sendMessage(chatId, "Unknown command 👑");
  } catch (e) {
    console.log("Error:", e);
  }
});

app.listen(3000, () => console.log("Bot server is running..."));
