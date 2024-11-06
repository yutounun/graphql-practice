# GraphQL

## How to call each API

### GET Books

```
{
  books {
    name
    author {
      name
    }
  }
}

```

### GET Authors

```
{
  authors {
    id
    name
    books {
      name
    }
  }
}
```

### GET Book

```
{
  book(id: 1) {
    name
  }
}
```

### GET Author

```
{
  author(id: 1) {
    name
  }
}
```

### POST Books

```
mutation {
  addBooks(name: "book8", authorId: 4) {
    name
  }
}
```

### POST Author

```
mutation {
  addAuthor(name: "taka") {
    name
  }
}
```
