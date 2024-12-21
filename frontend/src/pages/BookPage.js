import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookPage = () => {
  const { id } = useParams();
  const [bookData, setBookData] = useState(null);

  useEffect(() => {
    axios.get(`https://livinglibrary.onrender.com/api/book/${id}`)
    .then(response => {
        setBookData(response.data);
      })
      .catch(error => {
        console.error('Failed to load book data', error);
      });
  }, [id]);

  if (!bookData) return <div>Loading book data...</div>;

  return (
    <div>
      <h2>{bookData.title}</h2>
      <p><strong>Author:</strong> {bookData.author}</p>
      <p><strong>Published:</strong> {bookData.publishedYear}</p>
      <p>{bookData.description}</p>

      <h3>Key Themes</h3>
      <ul>
        {bookData.keyThemes.map((theme, idx) => <li key={idx}>{theme}</li>)}
      </ul>

      <h3>Characters</h3>
      <ul>
        {bookData.characters.map((char, idx) => (
          <li key={idx}>
            <strong>{char.name}:</strong> {char.description}
          </li>
        ))}
      </ul>

      <h3>Fun Facts</h3>
      <ul>
        {bookData.funFacts.map((fact, idx) => <li key={idx}>{fact}</li>)}
      </ul>
    </div>
  );
};

export default BookPage;
