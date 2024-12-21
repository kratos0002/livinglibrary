// index.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

import booksData from './books.json' assert { type: 'json' };

dotenv.config();
const app = express();
app.use(cors({
  origin: "https://animated-fiesta-645p5wwpvv4347g9-3000.app.github.dev",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Create the OpenAI client (new usage)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // organization: "org-xxxx",   // optional
});

// GET /api/book/:id
app.get('/api/book/:id', (req, res) => {
  const { id } = req.params;
  if (booksData[id]) {
    return res.json(booksData[id]);
  } else {
    return res.status(404).json({ error: 'Book not found' });
  }
});

// POST /api/chat/librarian
app.post('/api/chat/librarian', async (req, res) => {
  try {
    const { userMessage, bookId } = req.body;
    const book = booksData[bookId];

    if (!book) {
      return res.status(400).json({ error: 'Invalid bookId' });
    }

    const systemPrompt = `
      You are a well-informed librarian for the book "${book.title}" by ${book.author}.
      The user will ask questions about historical context, publication data, plot summary, etc.
      Use the following data for reference:
      - Published Year: ${book.publishedYear}
      - Characters: ${book.characters.map(c => c.name).join(', ')}
      - Themes: ${book.keyThemes.join(', ')}
      - Description: ${book.description}
      - Fun Facts: ${book.funFacts.join(', ')}
      Answer in a helpful, factual way.
    `;

    // Use the new client: openai.chat.completions.create
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const librarianMessage = response.choices[0].message.content;
    res.json({ librarianMessage });
  } catch (error) {
    console.error('Error in librarian chat:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/chat/raskolnikov
app.post('/api/chat/raskolnikov', async (req, res) => {
  try {
    const { userMessage } = req.body;

    const systemPrompt = `
      You are Rodion Raskolnikov from the novel "Crime and Punishment" by Fyodor Dostoevsky.
      You feel guilt and anguish over your crime.
      You are intelligent, philosophical, but also paranoid and conflicted.
      Roleplay as Raskolnikov in your responses, reflecting his mental turmoil.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const raskolnikovMessage = response.choices[0].message.content;
    res.json({ raskolnikovMessage });
  } catch (error) {
    console.error('Error in Raskolnikov chat:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
