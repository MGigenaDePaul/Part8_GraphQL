import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries'
const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  
  // fetch all books if there's no genre selected
  const {data: allBooksData} = useQuery(ALL_BOOKS, {
    skip: selectedGenre !== null
  })

  // fetch books by genre if a genre is selected
  const {data: booksByGenreData} = useQuery(BOOKS_BY_GENRE, { // could include refetch next to booksByGenreData for ex 8.22
    variables: { genre: [selectedGenre] },
    skip: selectedGenre === null
  })

  if (!allBooksData && !booksByGenreData) return <div>loading...</div>

  const listAllBooks = allBooksData?.allBooks || []
  const genresRepeated = listAllBooks.flatMap(b => b.genres)
  const uniqueGenres = [...new Set(genresRepeated)]

  const displayBooks = selectedGenre 
    ? booksByGenreData?.allBooks || []
    : allBooksData?.allBooks || []

  console.log('display books', displayBooks)

  // const handleGenreClick = (g) => {
  //   setSelectedGenre(g)
  //   refetch({genre: [g]}) // ensures updated data, another way of updating cache --> ex 8.22
  // }

  const padding = {
    padding: '5px'
  }
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
          {displayBooks.map(b => 
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>  
          )}
        </tbody>
      </table>
      <div>
      {uniqueGenres.map((g) => <button style={padding} key={g} onClick={() => setSelectedGenre(g)}>{g}</button>)}
      <button style={{padding: '5px', marginLeft: '10px'}} onClick={() => setSelectedGenre(null)}>all Genres</button>
      </div>
    </div>
  )
}

export default Books
