# Eat360

## Description
  Eat360 is a platform built around the concept of a social media network dedicated entirely to food recipes, with the added potential for monetization. Imagine a place where you can share your cherished household recipes, or showcase the culinary creations you've developed. This platform not only allows you to share your passion for cooking but also preserves these recipes, some of which have been passed down through generations. With Eat360, your family’s culinary legacy can be immortalized and shared with the world.
  
  So, dive in — <br />
    **Read, Cook, Eat, and Enjoy!**


<em>P.S. This is the first time I've done a project entirely on my own, so please forgive any code quality issues or bugs you may encounter.</em>



## Core Components
**MongoDB**  
- Database  
- NoSQL database used to store application data, including user information, products, and orders.

**Express.js**  
- Web framework  
- Backend framework used to build the RESTful API and handle server-side logic.

**React.js**  
- Frontend library  
- JavaScript library for building user interfaces, particularly single-page applications (SPAs).

**Node.js**  
- JavaScript runtime  
- Server-side runtime environment that allows you to run JavaScript on the backend.

**TypeScript**  
- JavaScript superset  
- A strongly-typed programming language that builds on JavaScript, providing enhanced tooling and better error checking.

**Vite**  
- Frontend tooling  
- Next-generation frontend tool that provides a fast and efficient development environment, with native support for TypeScript.

**TanStack Query**  
- Data fetching library  
- Powerful data-fetching and state management tool for React, allowing efficient handling of server-side data, caching, and synchronization.

**Cloudinary**  
- Media storage  
- Cloud-based service used for storing and serving media files, such as images and videos, with support for transformations and optimizations.

**Stripe**  
- Payment gateway  
- Payment processing platform used for handling transactions, including payment integrations, subscriptions, and invoicing.

**Mongoose**  
- ODM (Object Data Modeling) library  
- Provides a schema-based solution to model application data and interact with MongoDB.

**Babel**  
- JavaScript compiler  
- Used to transpile modern JavaScript and TypeScript code into a version compatible with older browsers and environments.



## Features

- **Responsive Design**
  - Built with TailwindCSS and ShadowUI components for a seamless experience across devices.
  
- **Authentication**
  - Sign In and Sign Out functionality.

- **Recipe Management**
  - Create, update, and delete recipes.
  - View and like recipes.
  - Adjust recipe quantities based on the number of people.
  - Comment on recipes.
  - Share recipes.
  - Save favorite recipes.
  - Adjust the visibility of recipes (public/private).
  - Access to premium recipes.

- **Search Functionality**
  - Search for recipes by title, ingredients, description, and more.

- **Payment Integration**
  - Payment gateway powered by Stripe for premium features.

- **Social Interaction**
  - Create, update, and delete posts.
  - View and like posts.
  - Comment on posts.

- **User Profile**
  - Profile management options.
  - Update profile information.
  
- **Image Handling**
  - Image upload and optimization using Cloudinary.



 ## Preview

![Screenshot 2024-08-11 113650](https://github.com/user-attachments/assets/efeaf898-5600-48b7-acfd-648ce3603d60)
 
![Screenshot 2024-08-10 210410](https://github.com/user-attachments/assets/ba7b98d4-7b42-4412-9756-7de33dc86b1b)

![Screenshot 2024-08-10 212923](https://github.com/user-attachments/assets/ed0177a4-8ab0-4e32-aec7-26a1a6c11289)

![Screenshot 2024-08-10 212955](https://github.com/user-attachments/assets/ca517f18-ae04-4139-b792-669114782ec9)

![Screenshot 2024-08-10 213011](https://github.com/user-attachments/assets/554733e1-6862-4e83-9834-b8f63dc54948)

![Screenshot 2024-08-10 213037](https://github.com/user-attachments/assets/fc9015af-ddd0-4db0-a3f1-3350f529fc80)

![Screenshot 2024-08-10 213102](https://github.com/user-attachments/assets/a86a833e-56e7-40fe-bb2b-cad7236a1256)


 
## Demo User Credentials

| Test User       | Email                   | Password    |
|-----------------|-------------------------|-------------|
| Test User       | test_user@gmail.com     | 12345678    |


## Live Link
https://eat360-client.vercel.app/

Here’s a more refined version of your instructions:

---

## Get Started

The structure of your instructions is generally clear and well-organized. However, to enhance readability and ensure that important information stands out, consider these slight adjustments:

1. **Group related tasks under subheadings**: This helps users easily navigate through installation steps and environment setup.
  
2. **Use bullet points or numbered lists for clarity**: Especially useful when users have to follow sequential steps.

Here’s an improved structure:

---

## Get Started

### Prerequisites
- **Node.js** 14.x
- **MongoDB** (local or Atlas)
- **Code Editor** (e.g., VS Code, WebStorm)

### Installation
1. Install dependencies:
    ```bash
    npm install
    ```
2. Navigate to the client folder and install dependencies:
    ```bash
    cd client && npm install
    ```
3. Navigate to the server folder and install dependencies:
    ```bash
    cd ../server && npm install
    ```
4. Run Nexus:
    ```bash
    npm run nexus
    ```

### Environment Variables
- The required environment variables for both the client and server are detailed in the README.md files within their respective folders in this repository.


## Future Improvements

- **Collections**
  - Option to group similar recipes into collections for easy organization and publication.
  - Allow users to share entire collections publicly or privately.

- **Advanced Filtering**
  - Implement filters based on various criteria such as date, premium status, vegetarian or non-vegetarian, difficulty level, preparation time, and more.
  - Add personalized filtering options based on user preferences and dietary restrictions.

- **JWT Integration**
  - Enhance security by integrating JWT (JSON Web Token) for more robust authentication and authorization across the application.

- **OAuth Functionality**
  - Provide users with the option to sign in using their social media accounts (Google, Facebook, etc.) via OAuth.
  - Enable seamless account linking and data import from other platforms.

- **Social Sharing Options**
  - Add social sharing buttons to recipes and posts, allowing users to share content directly to their favorite social media platforms.

- **Subscription Model**
  - Introduce a subscription service for premium content, offering tiered access to exclusive recipes, collections, and features.
  - Include options for monthly, quarterly, and annual subscriptions.

- **Timed Upload Option**
  - Allow users to schedule posts and recipe uploads for future dates and times.
  - Include features for draft management and post previews.

- **Posts with Recipe References**
  - Enable users to create posts that directly reference specific recipes.
  - Automatically link recipes within posts for easy navigation and cross-referencing.

- **User Activity Feed**
  - Add a personalized activity feed that shows recent actions by followed users, such as new recipes, posts, and comments.
  - Include notifications for interactions on user content (likes, comments, shares).

- **In-App Messaging**
  - Implement a messaging system that allows users to communicate directly with each other.
  - Enable recipe sharing and collaboration through private messages.
 
_ _ _ _
