# Eat 360 Server using Express Js, TypeScript, MongoDB, Mongoose and Cloudinary


## API Endpoints

### Authentication
- **POST `/auth/register`**: Register a new user.
- **POST `/auth/login`**: Log in an existing user.

### Collections
- **GET `/collections`**: Get all collections.
- **GET `/collections/:id`**: Get a collection by ID.
- **POST `/collections`**: Create a new collection.
- **PUT `/collections/:id`**: Update an existing collection.
- **DELETE `/collections/:id`**: Delete a collection.

### Payment
- **POST `/create-payment-intent`**: Create a new payment session.
- **POST `/webhook`**: Handle Stripe webhook events.
- **GET `/session/:sessionId`**: Get payment session details.

### Posts
- **POST `/posts`**: Create a new post.
- **GET `/posts`**: Get all posts.
- **GET `/posts/:id`**: Get a post by ID.
- **PUT `/posts/:id`**: Update a post.
- **DELETE `/posts/:id`**: Delete a post.
- **GET `/posts/:id/comments`**: Get comments on a post.
- **POST `/posts/:id/comments`**: Comment on a post.
- **PUT `/posts/:id/comments`**: Update a comment.
- **DELETE `/posts/:id/comments`**: Delete a comment.

### Recipes
- **GET `/recipes`**: Get all recipes.
- **GET `/recipes/search`**: Search for recipes.
- **GET `/recipes/top`**: Get top-rated recipes.
- **POST `/recipes`**: Create a new recipe.
- **GET `/recipes/:id`**: Get a recipe by ID.
- **PUT `/recipes/:id`**: Update a recipe.
- **DELETE `/recipes/:id`**: Delete a recipe.
- **POST `/recipes/:id/comments`**: Comment on a recipe.
- **DELETE `/recipes/:id/comments`**: Delete a recipe comment.

### Users
- **GET `/users`**: Get all users.
- **GET `/users/:id`**: Get a user by ID.
- **PUT `/users/:id`**: Update user information.
- **GET `/users/:id/followers-following`**: Get followers and following.

### Image Handling
- **POST `/upload`**: Upload an image to Cloudinary.

## Env

```bash
  PORT=
  SECRET=
  MONGODB_URI=
  CLOUDINARY_CLOUD_NAME=
  CLOUDINARY_API_KEY=
  CLOUDINARY_SECRET_KEY=
  STRIPE_PRIVATE_KEY=
  STRIPE_WEBHOOK_SIGNIN_SECRET=
  CLIENT_URL=
```
