# Eat360

## Description
  Eat360 is a platform built around the concept of a social media network dedicated entirely to food recipes, with the added potential for monetization. Imagine a place where you can share your cherished household recipes, or showcase the culinary creations you've developed. This platform not only allows you to share your passion for cooking but also preserves these recipes, some of which have been passed down through generations. With Eat360, your family’s culinary legacy can be immortalized and shared with the world.
  
  So, dive in — <br />
    **Read, Cook, Eat, and Enjoy!**


<em>
P.S. This is the first time I've done a project entirely on my own, so please forgive any code quality issues or bugs you may encounter <br />
Also, This is a micro services application where the authentication and socket is in other repos of mine

.</em>


## 🧩 **Architecture Overview**

### **Microservices**

* **Auth Service (Go + Gin)**

  * Handles authentication and authorization with **JWT**
  * Fully **type-safe** and modular

* **Socket Service (Hono.js + Socket.io)**

  * Enables **real-time chat and messaging**
  * Lightweight and high-performance implementation

* **Event-Driven Services (AWS)**

  * **EventBridge** and **Lambda** integrated for **recipe scheduling** and asynchronous task processing

---

## 🧠 **Core Technologies**

| Category              | Technology                  | Description                                                             |
| --------------------- | --------------------------- | ----------------------------------------------------------------------- |
| **Database**          | **MongoDB**                 | NoSQL database storing user data, recipes, posts, and other entities    |
| **Backend Framework** | **Express.js**              | RESTful API handling business logic and routes                          |
| **Frontend Library**  | **React.js (TypeScript)**   | SPA architecture with strong typing and modular structure               |
| **Runtime**           | **Node.js**                 | JavaScript runtime for backend logic                                    |
| **Tooling**           | **Vite**                    | Lightning-fast development and build tool with native TS support        |
| **Data Fetching**     | **TanStack Query**          | Efficient data fetching, caching, and server-state synchronization      |
| **Validation**        | **Zod**                     | Type-safe schema validation for backend and frontend consistency        |
| **State Management**  | **Zustand**                 | Minimal and scalable state management solution                          |
| **Styling**           | **TailwindCSS + ShadCN UI** | Modern, responsive UI with utility-first design and prebuilt components |
| **Media Handling**    | **Cloudinary**              | Optimized image storage and transformations                             |
| **Payments**          | **Stripe**                  | Secure and scalable payment gateway for premium features                |
| **ODM**               | **Mongoose**                | Schema-based modeling for MongoDB                                       |
| **Compiler**          | **Babel**                   | Transpiles modern JS/TS for cross-browser compatibility                 |

---

## 🚀 **Key Features**

### 🧑‍🍳 **Recipe Management**

* Create, edit, delete, and view recipes
* Like, comment, and share recipes
* Adjust ingredient quantities dynamically
* Mark recipes as public/private
* Access premium recipes via **Stripe integration**
* **Automated recipe scheduling** via **AWS EventBridge & Lambda**

### 💬 **Real-Time Chat**

* One-on-one functionality
* **Socket.io**-powered real-time messaging

### 🔍 **Search Functionality**

* Search by title, description, or ingredients

### 👤 **User Profiles**

* Manage profile details and avatars
* View personal and public posts or recipes

### 🖼️ **Image Handling**

* Upload and optimize images via **Cloudinary**

### 💸 **Payment Integration**

* Secure payments for premium content and features

### ❤️ **Social Interaction**

* Create, update, and delete posts
* Like and comment on user posts

### 📱 **Responsive Design**

* Fully responsive across mobile, tablet, and desktop
* Built with **TailwindCSS** and **ShadCN UI** components

---

## ⚙️ **Highlights**

* 🧱 Modular **microservices architecture** (Auth, Socket, Core API)
* ☁️ Integrated **AWS EventBridge + Lambda** for background task automation
* 🔒 **JWT Authentication** and secure API communication
* 🧩 Type-safe codebase with **TypeScript** and **Zod**
* ⚡ Lightning-fast build with **Vite**
* 💬 Real-time interactivity with **Socket.io**
* 💳 Seamless **Stripe** payments

---

## 🏗️ **Tech Stack Summary**

**Frontend:** React.js, TypeScript, Vite, TailwindCSS, Zustand, TanStack Query
**Backend:** Node.js, Express.js, MongoDB, Zod, Mongoose
**Auth Service:** Go (Gin, JWT)
**Socket Service:** Hono.js, Socket.io
**Cloud:** AWS EventBridge, Lambda, Cloudinary, Stripe

---

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

## 🗂️ Related Repositories

| Service | Description | Repository |
|----------|--------------|------------|
| 🔐 Auth Service | Go (Gin) + JWT Authentication | [View Repo](https://github.com/Aakash-Sleur/auth-service-eat360) |
| 💬 Socket Service | Hono.js + Socket.io | [View Repo](https://github.com/Aakash-Sleur/chat-service-eat360) |

## Future Improvements

- **Collections**
  - Option to group similar recipes into collections for easy organization and publication.
  - Allow users to share entire collections publicly or privately.

- **Advanced Filtering**
  - Implement filters based on various criteria such as date, premium status, vegetarian or non-vegetarian, difficulty level, preparation time, and more.
  - Add personalized filtering options based on user preferences and dietary restrictions.

- **OAuth Functionality**
  - Provide users with the option to sign in using their social media accounts (Google, Facebook, etc.) via OAuth.
  - Enable seamless account linking and data import from other platforms.

- **Subscription Model**
  - Introduce a subscription service for premium content, offering tiered access to exclusive recipes, collections, and features.
  - Include options for monthly, quarterly, and annual subscriptions.

- **Posts with Recipe References**
  - Enable users to create posts that directly reference specific recipes.
  - Automatically link recipes within posts for easy navigation and cross-referencing.

- **User Activity Feed**
  - Add a personalized activity feed that shows recent actions by followed users, such as new recipes, posts, and comments.
  - Include notifications for interactions on user content (likes, comments, shares).

_ _ _ _
