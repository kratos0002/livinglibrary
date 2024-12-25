import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Create the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


// GET /api/books
app.get('/api/books', async (req, res) => {
  try {
    const { data: books, error } = await supabase
      .from('books')
      .select('*');

    if (error) {
      console.error('Error fetching books:', error);
      return res.status(500).json({ error: 'Error fetching books' });
    }

    // Return books array
    res.json(books || []);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});



// GET /api/book/:id
app.get("/api/book/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch book data
    const { data: book, error: bookError } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single();

    if (bookError || !book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Fetch characters for the book
    const { data: characters, error: charactersError } = await supabase
      .from("characters")
      .select("*")
      .eq("book_id", id);

    if (charactersError) {
      console.error("Error fetching characters:", charactersError);
    }

    res.json({
      book,
      characters: characters || [], // Include characters in response
    });
  } catch (error) {
    console.error("Error fetching book data:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/dashboard/:userId
app.get("/api/dashboard/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user insights
    const { data: insights, error: insightsError } = await supabase
      .from("insights")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (insightsError || !insights) {
      console.error("Error fetching insights:", insightsError);
      return res.status(404).json({ error: "No insights found for the user." });
    }

    res.json({
      username: insights.username || "Reader",
      total_books: insights.total_books || 0,
      total_pages: insights.total_pages || 0,
      top_genres: insights.top_genres || [],
      top_authors: insights.top_authors || [],
      places_visited: insights.places_visited || [],
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});


// POST /api/chat/librarian
app.post("/api/chat/librarian", async (req, res) => {
  try {
    const { userMessage, bookId } = req.body;

    const { data: book, error: bookError } = await supabase
      .from("books")
      .select("*")
      .eq("id", bookId)
      .single();

    if (bookError || !book) {
      return res.status(400).json({ error: "Invalid bookId" });
    }

    const systemPrompt = `
      You are a well-informed librarian for the book "${book.title}" by ${book.author}.
      The user will ask questions about historical context, publication data, plot summary, etc.
      Use the following data for reference:
      - Published Year: ${book.published_year}
      - Description: ${book.description}
      Answer in a helpful, factual way.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    res.json({ librarianMessage: response.choices[0].message.content });
  } catch (error) {
    console.error("Error in librarian chat:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});


// POST /api/chat/raskolnikov
app.post("/api/chat/character/:characterName", async (req, res) => {
  try {
    const { characterName } = req.params; // Character name from URL
    const { userMessage } = req.body;

    // Fetch character data from the database
    const { data: character, error } = await supabase
      .from("characters")
      .select("*")
      .eq("name", characterName)
      .single();

    if (error || !character) {
      return res.status(404).json({ error: "Character not found" });
    }

    const systemPrompt = `
      You are ${character.name}, a character from the book "${character.book_title}" by ${character.book_author}.
      ${character.description}
      Roleplay as ${character.name} in your responses, reflecting their personality, motivations, and mental state.
    `;

    // Generate chat response using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const characterMessage = response.choices[0].message.content;
    res.json({ characterMessage });
  } catch (error) {
    console.error("Error in character chat:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
