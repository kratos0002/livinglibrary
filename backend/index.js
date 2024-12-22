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

// GET /api/book/:id
app.get("/api/book/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch book data from Supabase
    const { data: book, error: bookError } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single();

    if (bookError || !book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Fetch reviews for the book
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .eq("book_id", id);

    if (reviewsError) {
      console.error("Error fetching reviews:", reviewsError);
    }

    res.json({ book, reviews: reviews || [] });
  } catch (error) {
    console.error("Error fetching book data:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/chat/librarian
app.post("/api/chat/librarian", async (req, res) => {
  try {
    const { userMessage, bookId } = req.body;

    // Fetch book data from Supabase
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
      - Fun Facts: ${book.fun_facts.join(", ")}
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

    const librarianMessage = response.choices[0].message.content;
    res.json({ librarianMessage });
  } catch (error) {
    console.error("Error in librarian chat:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/chat/raskolnikov
app.post("/api/chat/raskolnikov", async (req, res) => {
  try {
    const { userMessage } = req.body;

    const systemPrompt = `
      You are Rodion Raskolnikov from the novel "Crime and Punishment" by Fyodor Dostoevsky.
      You feel guilt and anguish over your crime.
      You are intelligent, philosophical, but also paranoid and conflicted.
      Roleplay as Raskolnikov in your responses, reflecting his mental turmoil.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const raskolnikovMessage = response.choices[0].message.content;
    res.json({ raskolnikovMessage });
  } catch (error) {
    console.error("Error in Raskolnikov chat:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
