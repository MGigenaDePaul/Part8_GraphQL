const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const jwt = require('jsonwebtoken')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (roots, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.name })
        if (author) {
          return Book.find({ author: author._id }).populate('author')
        } else {
          return []
        }
      }

      if (args.genre) {
        return Book.find({ genres: { $in: args.genre } }).populate('author')
      }

      return Book.find({}).populate('author')
    },
    allAuthors: async(roots, args) => {
      const authors = await Author.aggregate([  // from MongoDB docs
        {
          $lookup: {
            from: 'books', // collection name in MongoDB (lowercase, plural)
            localField: '_id',
            foreignField: 'author',
            as: 'books'
          }
        },
        {
          $addFields: {
            bookCount: { $size: '$books' }
          }
        },
        {
          $project: {
            name: 1,
            born: 1,
            bookCount: 1,
            id: '$_id' // Map _id to id for GraphQL
          }
        }
      ]);
      
      return authors;
    }, 
    me: async (roots, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {
    addBook: async (roots, args, context) => {
      let author = await Author.findOne({ name: args.author })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('user not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({ ...args, author: author._id })

      try {
        await book.save()
      }
      catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: [args.title, args.name],
            error
          }
        })
      }

      const populatedBook = await book.populate('author')
      pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })
      return populatedBook
    },
    editAuthor: async (roots, args, context) => {
      const author = await Author.findOne({ name: args.name })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('user not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      
      author.born = args.setBornTo
      
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Editing author born failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo,
            error
          }
        })
      }
      return author
    },
    createUser: async (roots, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creation of user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: [args.username, args.favoriteGenre],
              error
            }
          })
        })
    },
    login: async (roots, args) => {
      const user = await User.findOne({ username: args.username })
      
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },

  Subscription: {
    bookAdded: {
    subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers