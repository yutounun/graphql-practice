const express = require("express");
const { graphqlHTTP } = require("express-graphql"); // expressGraphQLの代わりにgraphqlHTTPを使用
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const app = express();

// Dummy DB
const authors = [
  { id: 1, name: "Author 1" },
  { id: 2, name: "Author 2" },
  { id: 3, name: "Author 3" },
];
const books = [
  { id: 1, name: "Book 1", authorId: 1 },
  { id: 2, name: "Book 2", authorId: 1 },
  { id: 3, name: "Book 3", authorId: 2 },
  { id: 4, name: "Book 4", authorId: 2 },
  { id: 5, name: "Book 5", authorId: 3 },
  { id: 6, name: "Book 6", authorId: 3 },
  { id: 7, name: "Book 7", authorId: 3 },
  { id: 8, name: "Book 8", authorId: 3 },
];

// Types
const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents an author of a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        // arg indicates parent(Author)
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

// only type is required, others are optional
const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        // arg is parent(Book)
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

// それぞれのpropertyの型を別々に定義する感じ
// descriptionも書くことでDocumentationを書ける。Browserで確認できるし。
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "A single book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of all books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all authors",
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: "A single author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },
  }),
});

// Mutation
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addBook: {
      type: BookType, // rtn type
      description: "Add a new book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = { id: books.length + 1, ...args };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add a new author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, ...args };
        authors.push(author);
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(5001, () => console.log("Server is running on port 5001"));
