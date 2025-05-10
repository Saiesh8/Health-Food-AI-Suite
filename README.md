🧠🥗 Health & Food AI Suite
A full-stack AI-powered web application that helps users generate recipes from food images or ingredient lists, understand nutritional benefits, and get multilingual cooking assistance—all with voice support. Built using FastAPI, React, and Gemini AI API.

🚀 Key Features
🖼️ Image-to-Recipe Generation
Upload a food image to get a complete recipe using AI.

🍅 Text-based Recipe Suggestions
Input ingredients like "2 tomatoes, 1 potato" to generate recipe options.

🥦 Food Image Validation
Confirms if the uploaded image is food or not using image classification.

💪 Ingredient Health Benefits
Displays nutrition and health-related info for each ingredient.

🗣️ Voice + Multilingual Support
Interact in English, Telugu, Hindi, French, and German via voice commands.

🧑‍🍳 Cooking Instruction Links
Directs users to verified video tutorials or websites for recipe preparation.

🔐 User Authentication System

JWT-based login/logout

Encrypted passwords

Profile update & recipe history tracking

🔎 Recipe Search Feature
Search previously generated recipes and filter by ingredients.

⚙️ Tech Stack
Frontend: React, Tailwind CSS

Backend: FastAPI (Python)

AI Services: Gemini AI API (for recipe generation, language output)

Database: PostgreSQL (or MySQL)

Authentication: JWT tokens

Cloud Storage: (optional) AWS S3 / Firebase for images

🗂️ Project Structure
css
Copy
Edit
health-food-ai-suite/
├── backend/
│   ├── main.py
│   ├── routers/
│   ├── models/
│   ├── database.py
│   └── utils/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   └── tailwind.config.js
├── README.md
└── requirements.txt
📦 How to Run Locally
Clone the repository

bash
Copy
Edit
git clone https://github.com/yourusername/health-food-ai-suite.git
cd health-food-ai-suite
Backend Setup

bash
Copy
Edit
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
Frontend Setup

bash
Copy
Edit
cd frontend
npm install
npm run dev
📘 Learning Highlights
AI Prompt Engineering with Gemini API

Full Stack Development (React + FastAPI)

JWT Authentication & Secure Backend APIs

Food Image Validation using Image Classification

Multilingual & Speech Integration

🏁 Future Enhancements
Meal planning based on dietary goals

Medical report upload for AI-based diet recommendations

Disease detection from food & medical images

