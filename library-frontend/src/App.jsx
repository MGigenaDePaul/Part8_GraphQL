import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Link, Routes, Route } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";

const App = () => {

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)

  if (resultAuthors.loading || resultBooks.loading) {
    return <div>loading data...</div>
  }

  console.log('authors:', resultAuthors)
  console.log('books', resultBooks)

  const padding = {
    padding: 5
  }

  return (
    <div>
        <Link style={padding} to="/authors">
          <button> authors </button></Link>
        <Link style={padding} to="/books">
          <button> books </button>
        </Link>
        <Link style={padding} to="/addBook">        
          <button> add book </button>
        </Link>
      

      <Routes>
        <Route path="/authors" 
          element={<Authors authors={resultAuthors.data} />} 
        />
        <Route path="/books" element={<Books books={resultBooks.data} />} />
        <Route path="/addBook" element={<NewBook books={resultBooks.data}/>} />
      </Routes>
    </div>
  );
};

export default App;
