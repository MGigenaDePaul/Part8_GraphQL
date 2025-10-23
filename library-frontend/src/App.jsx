import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import RecommendView from "./components/RecommendView";
import { useState, useEffect } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client/react'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, BOOKS_BY_GENRE } from "./queries";

export const updateCache = (cache, query, addedBook) => {
   // helper that is used to eliminate saving same book twice
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({data, client}) => {
      const addedBook = data.data.bookAdded
      console.log('addedBook:', addedBook)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)

      // update cache when adding a book, ex 8.22
      addedBook.genres.forEach(genre => (
        updateCache(client.cache, {
          query: BOOKS_BY_GENRE,
          variables: { genre: [genre]}
        }, addedBook)
      ))

      window.alert(`a new book "${addedBook.title}" added`)
    }
  })

  useEffect(() => {
    const savedToken = localStorage.getItem('user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, []) 

  if (!resultBooks.data) return <div>loading books...</div>
  if (!resultAuthors.data) return <div>loading authors...</div>

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
      {/*LINKS*/}
        <Link to="/"></Link>
        <Link style={padding} to="/authors">
          <button> authors </button></Link>
        <Link style={padding} to="/books">
          <button> books </button>
        </Link>
        <Link style={padding} to="/login"><button>login</button></Link>

        {/*User can access this functionalities if it's logged in*/}
        {token && (<Link style={padding} to="/addBook"><button>add book</button></Link>)}
        {token && (<Link style={padding} to="/recommend"><button>recommend</button></Link>)}
        {token && (<Link style={padding} to="/login"><button onClick={handleLogout}>logout</button></Link>)}
      
      {/*ROUTES*/}
      <Routes>
        <Route path="/" element={<Home token={token} logout={handleLogout}/>}/>
        <Route path="/authors" 
          element={<Authors authors={resultAuthors.data.allAuthors} />} 
        />
        <Route path="/books" element={<Books />} />
        <Route path="/login" element={<LoginForm setToken={setToken}/>} />
        {token && (
          <Route path="/addBook" element={<NewBook books={resultBooks.data}/>} /> 
        )}
        {token && (
          <Route path="/recommend" element={<RecommendView token={token} books={resultBooks.data.allBooks}/>} />
        )}
      </Routes>
    </div>
  );
};

export default App;
