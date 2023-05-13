# UI Documentation

## Express

```js
const express = require('express');
const app = express();
const port = 3000;

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Serve a page via a route
app.get('/', (req, res) => {
  res.render('pages/index');
});

// Listen for page requests
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
```

## EJS

### Passing data to a page

The backend:
```js
// Dummy data we get from api
const foo = {
  some_numbers: [
    5,
    4,
    1,
  ],
  some_string: 'Hello World',
  show_string: true,
};

app.get('/bar', (req, res) => {
  res.render('pages/bar', {
    // This object passes data to the frontend 
    foo,
  });
});
```

The frontend `bar.ejs`:
```html
<body>
  
  <h1>Numbers:</h1>
  
  <ul>
    
    <% foo.numbers.forEach((article)=> { %>
      
      <li>
          
          <p>
              <%= number %>
          </p>
      </li>
    <% }) %>
  </ul>
  
  <hr />

  <% if (foo.show_string) { %>

    <h1>String:</h1>
    
    <h2><%= foo.some_string  %></h2>
  <% } %>
</body>
```

### Including Partials

Consider the following file `partials/head.ejs`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!-- Global CSS -->

    <title><%= title %></title>
</head>
```
We can dynamically include this in the our index page:

```html
<%- include('../partials/head', {title :'Page Title'}) %>

<body>
  <!-- Content -->
</body>

<!-- Be sure to close any tags that the header didn't close -->
</html>
```

```js
app.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'Home',
  });
});

app.get('/bar', (req, res) => {
  res.render('pages/index', {
    title: 'Bar',
  });
});
```
