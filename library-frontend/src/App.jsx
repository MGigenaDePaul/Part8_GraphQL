import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useState, useEffect } from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";
import LoginForm from "./components/LoginForm";

const Home = ({token}) => {
  if (!token) {
    return null
  }

  console.log('is there a token?', token)

  return (
    <div>
      <h2>HOME</h2>
    </div>
  )
}

const App = () => {
  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const savedToken = localStorage.getItem('user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, []) 

  if (resultAuthors.loading || resultBooks.loading) {
    return <div>loading data...</div>
  }
  console.log('authors:', resultAuthors)
  console.log('books', resultBooks)

 

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
        <Link to="/"></Link>
        <Link style={padding} to="/authors">
          <button> authors </button></Link>
        <Link style={padding} to="/books">
          <button> books </button>
        </Link>
        <Link style={padding} to="/login"><button>login</button></Link>
        {token && (
          <Link style={padding} to="/addBook"><button>add book</button></Link>
        )}
        {token && (
          <Link to="/login"><button onClick={handleLogout}>logout</button></Link>
        )}
        
      <Routes>
        <Route path="/" element={<Home token={token} logout={handleLogout}/>}/>
        <Route path="/authors" 
          element={<Authors authors={resultAuthors.data.allAuthors} />} 
        />
        <Route path="/books" element={<Books books={resultBooks.data.allBooks} />} />
        <Route path="/login" element={<LoginForm setToken={setToken}/>} />
        {token && (
          <Route path="/addBook" element={<NewBook books={resultBooks.data}/>} /> 
        )}
      </Routes>
    </div>
  );
};

export default App;
