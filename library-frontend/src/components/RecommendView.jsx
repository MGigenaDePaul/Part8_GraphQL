import { useQuery } from "@apollo/client/react"
import { ME } from "../queries"

const RecommendView = ({token, books}) => {
  if (!token || !books) {
    return null
  }

  const {data} = useQuery(ME, {
    onError: (error) => {
      console.log("couldn't fetch user info", error)
    }
  })

   if (!data) return null

  const favoriteGenre = data.me.favoriteGenre

  const filteredBooks = books.filter((b) => b.genres.includes(favoriteGenre))

  return (
      <div>
        <h2>recommendations</h2>
        <p>books in your favorite genre <b>{favoriteGenre}</b></p>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {filteredBooks.map(b => 
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  )
}

export default RecommendView