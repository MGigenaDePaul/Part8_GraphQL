import { gql } from "@apollo/client"


const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title 
    published
    author {
      name
      born
      id
    }
    genres
    id
  }
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    id
  }
}
`
export const ALL_BOOKS = gql`
query {
  allBooks { 
    title 
    author {
      name
    }
    published 
    genres
    id
  }
}
`
export const CREATE_BOOK = gql`
mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    title
    author {
      name
      id
    }
    published
    genres
  }
}
`

export const EDIT_AUTHOR = gql`
mutation EditAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
  }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ME = gql`
query {
  me {
    username
    favoriteGenre
    id
  }
}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`