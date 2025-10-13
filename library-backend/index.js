const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

function countBooksAuthor(name, books){
  let count = 0
  for (let i = 0; i < books.length; i++) {
    if (books[i].author === name) {
      count = count + 1
    }
  }
  return count
}

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
    bookCount: countBooksAuthor('Robert Martin', books)
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
    bookCount: countBooksAuthor('Martin Fowler', books)
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
    bookCount: countBooksAuthor('Fyodor Dostoevsky', books)
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    bookCount: countBooksAuthor('Joshua Kerievsky', books)
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    bookCount: countBooksAuthor('Sandi Metz', books)
  },
]

/*
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author
  }

  type Query {
    bookCount: Int!
    authorCount: Int!,
    allBooks(author: String, genre: [String!]): [Book!]!
    allAuthors: [Author!]!
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (roots, args) => {
      let result = books
    
      if (args.author) {
        result = books.filter(b => b.author === args.author)
      }
      if (args.genre) {
        result = books.filter(b => b.genres.some(g => args.genre.includes(g)))
      }
      if (args.author && args.genre) {
        result = books.filter(b => (b.author === args.author) && (b.genres.some(g => args.genre.includes(g))))
      }

      return result
    },
    allAuthors: (roots, args) => authors
  },

  Mutation: {
    addBook: (roots, args) => {
      if (books.find(b => b.title === args.title)) {
        throw new GraphQLError('Title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      const book = { ...args, id: uuid()}

      // if author exists, find it's index and update it's bookCount property
      const index = authors.findIndex(a => a.name === book.author)

      if (index !== -1) {
        authors[index].bookCount += 1
      }

      // if author doesn't exist, create a new one
      if (index === -1) {
        let newAuthor = {
          name: book.author,
          born: null,
          id: uuid(),
          bookCount: 1
        }
        authors = authors.concat(newAuthor)
      }

      books = books.concat(book)

      console.log('BOOKS', books)
      console.log('AUTHORS', authors)
      console.log('books Martin Fowler:', countBooksAuthor('Martin Fowler', books))
      console.log('books Reijo Mäki:', countBooksAuthor('Reijo Mäki', books))

      return book
    },

    editAuthor: (roots, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) {
        return null
      }
      
      const updatedAuthor = {...author, born: args.setBornTo}
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)

      console.log('AUTHORS UPDATED', authors)
      return updatedAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})