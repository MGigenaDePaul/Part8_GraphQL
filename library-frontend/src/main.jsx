import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import {ApolloProvider} from '@apollo/client/react'
import {SetContextLink} from '@apollo/client/link/context'

const authLink = new SetContextLink((prevContext, { headers }) => {
  const token = localStorage.getItem('user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client} >
    <Router>
      <App />
    </Router>  
  </ApolloProvider>
);
