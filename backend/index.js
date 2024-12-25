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

app.get("/api/dashboard/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user insights from the `insights` table
    const { data: insights, error: insightsError } = await supabase
      .from("insights")
      .select(
        "total_books_read, total_pages_read, top_genres, top_themes, top_authors, favorite_locations"
      )
      .eq("user_id", userId)
      .single();

    if (insightsError) {
      console.error("Error fetching insights:", insightsError);
      return res.status(500).json({ error: "Error fetching user insights" });
    }

    // Fetch the user's name from the `users` table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("username")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return res.status(500).json({ error: "Error fetching user data" });
    }

    // Construct the response object
    const dashboardData = {
      username: user?.username || "User",
      total_books: insights.total_books_read || 0,
      total_pages: insights.total_pages_read || 0,
      top_genres: insights.top_genres || [],
      top_themes: insights.top_themes || [],
      top_authors: insights.top_authors || [],
      places_visited: insights.favorite_locations || [],
    };

    // Return the dashboard data
    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/books/add/:userId", async (req, res) => {
  const { userId } = req.params;
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: "Title and author are required." });
  }

  try {
    // Check if the book already exists
    const { data: existingBook, error: checkError } = await supabase
      .from("books")
      .select("*")
      .eq("title", title)
      .eq("author", author)
      .single();

    if (existingBook) {
      return res.status(409).json({ error: "Book already exists in the database." });
    }

    // Generate metadata using GPT
    const systemPrompt = `
      You are an expert librarian. Generate detailed metadata for the following book:
      - Title: ${title}
      - Author: ${author}

      Respond in the following JSON format only:
      {
        "description": "A short description of the book",
        "themes": ["theme1", "theme2", "theme3"],
        "genre": "Book genre",
        "settings": { "locations": ["location1", "location2"], "time_period": "historical time period" },
        "page_count": 500,
        "character_archetypes": ["archetype1", "archetype2"],
        "main_characters": [
          { "name": "Character Name 1", "description": "Character Description 1" },
          { "name": "Character Name 2", "description": "Character Description 2" }
        ],
        "fun_facts": ["fact1", "fact2"],
        "historical_period": "time period",
        "published_year": 1869,
        "cover_image": "A URL of the book cover"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Please provide detailed book metadata." },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    let enrichedDetails;
    try {
      enrichedDetails = JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      console.error("Error parsing GPT response:", parseError.message);
      return res.status(500).json({ error: "Invalid GPT response format." });
    }

    // Ensure required fields have fallback values
    enrichedDetails.cover_image = enrichedDetails.cover_image?.startsWith("http")
      ? enrichedDetails.cover_image
      : "https://via.placeholder.com/150"; // Default placeholder image
    enrichedDetails.published_year = enrichedDetails.published_year || "Unknown";
    enrichedDetails.fun_facts = enrichedDetails.fun_facts || ["No fun facts available."];
    enrichedDetails.page_count = enrichedDetails.page_count || 300; // Example fallback
    enrichedDetails.themes = enrichedDetails.themes || [];
    enrichedDetails.genre = enrichedDetails.genre || "Unknown";

    // Add book to database
    const { data: newBook, error: bookError } = await supabase
      .from("books")
      .insert({
        title,
        author,
        description: enrichedDetails.description,
        cover_image: enrichedDetails.cover_image,
        page_count: enrichedDetails.page_count,
        themes: enrichedDetails.themes,
        genre: enrichedDetails.genre,
        settings: enrichedDetails.settings,
        historical_period: enrichedDetails.historical_period,
        character_archetypes: enrichedDetails.character_archetypes,
        fun_facts: enrichedDetails.fun_facts,
        published_year: enrichedDetails.published_year,
      })
      .select("*")
      .single();

    if (bookError) {
      console.error("Database Error:", bookError);
      return res.status(500).json({ error: "Error adding book to database." });
    }

    // Add book to user's library
    const { error: libraryError } = await supabase
      .from("user_library")
      .insert({
        user_id: userId,
        book_id: newBook.id,
        status: "added",
        added_at: new Date(),
      });

    if (libraryError) {
      console.error("Library Error:", libraryError);
      return res.status(500).json({ error: "Error adding book to user library." });
    }

    // Add main characters to the characters table
    if (enrichedDetails.main_characters?.length) {
      const characters = enrichedDetails.main_characters.map((character) => ({
        name: character.name,
        description: character.description,
        book_id: newBook.id,
      }));

      const { error: characterError } = await supabase.from("characters").insert(characters);

      if (characterError) {
        console.error("Character Error:", characterError);
      }
    }

    res.status(200).json({ message: "Book added successfully!", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error.message);
    res.status(500).json({ error: "Server error while adding book." });
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
