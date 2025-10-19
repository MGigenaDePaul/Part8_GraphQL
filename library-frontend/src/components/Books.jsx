import { useState } from 'react'

const Books = ({books}) => {
  const [booksByGenre, setBooksByGenre] = useState([])

  if (!books) {
    return null
  }
  
  const selectedGenre = (genre) => {
    console.log('selectedGenre:', genre)
    const showBooksByGenre = books.filter((b) => b.genres.includes(genre)) 
    setBooksByGenre(showBooksByGenre)
  }

  // show filtered books or all of them
  const displayBooks = booksByGenre.length > 0 ? booksByGenre : books

  const genresRepeated = []
  books.forEach(b => {
    b.genres.forEach(g => genresRepeated.push(g))
  })

  const uniqueGenres = [...new Set(genresRepeated)]

  return (
    <div>
      <h2>books</h2>
      <p>Clasification of books by <b>genre</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {displayBooks.map((b) => 
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr> 
          )}
        </tbody>
      </table>
      <div>
      {uniqueGenres.map((g) => 
        <button key={g} onClick={() => selectedGenre(g)}>{g}</button>
      )}
      <button onClick={() => setBooksByGenre([])}>all Genres</button>
      </div>
    </div>
  )
}

export default Books
