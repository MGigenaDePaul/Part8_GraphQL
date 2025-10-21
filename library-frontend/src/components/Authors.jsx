import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"

const Authors = ({authors}) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  if (!authors) {
    return null
  }

  const [changeBorn] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{query: ALL_AUTHORS}]
  })

  const submit = async (event) => {
    event.preventDefault()

    changeBorn({ variables: {name, setBornTo: Number(born)} })

    setName('')
    setBorn('')
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set BirthYear</h2>
      <form onSubmit={submit}>
        <select style={{width: 300, padding: 5 }} value={name} onChange={(event) => setName(event.target.value)}>
          {authors.map((a) => 
            <option key={a.id}>{a.name}</option>)
          }
        </select>
        <div>
          born:
          <input value={born} onChange={(event) => setBorn(event.target.value)}/>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
