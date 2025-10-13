import { useState } from "react"

const Authors = ({authors}) => {
  // if (!show) {
  //   return null
  // }
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  if (!authors){
    return null
  }

  

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set BirthYear</h2>
      <div>
        name:
        <input value={name} onChange={(event) => setName(event.target.value)}/>
      </div>
      <div>
        born:
        <input value={born} onChange={(event) => setBorn(event.target.value)}/>
      </div>
      <button type="submit">update author</button>
    </div>
  )
}

export default Authors
