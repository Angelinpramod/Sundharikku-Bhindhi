🌟 Sundharikku Bhindhi 👑
A hilarious emoji-placement game where precision meets pixels!

Sundharikku Bhindhi is a quirky, multiplayer browser game where players compete to place an emoji exactly between the eyebrows of a celebrity image (yes, it’s chaotic fun). Each emoji has a hidden twist—it comes with a token cost based on LLM tokenization (because why not add a bit of nerdy spice?).

🎯 Closest emoji wins—but watch your token count!
📸 Bonus: Take a webcam selfie with a virtual bindi to seal your victory in style.

🚀 Features
🔁 Multiplayer Madness: 1–10 players, with automatic turn rotation.

😜 Emoji Drop: Click or drag your emoji to place it on the celebrity’s face.

📏 Smart Scoring: Based on:

Distance to the target point

Emoji’s token count (using TikToken)

🎞️ Slick Transitions: Includes fade-ins, spinning images, and animated sequences.

🏆 Scoreboard: Ranks players with:

Name

Emoji (with token count)

Distance from the center

📷 Webcam Fun: Take a selfie with a red bindi and download it.

🎉 Confetti Blast: Celebrate results in colorful style!

🛠️ Tech Stack
Frontend

HTML, CSS, JavaScript (ES Modules)

Emoji Button (for emoji picker)

Canvas Confetti (for celebrations)

Backend

Node.js + Express.js

CORS

TikToken (@dqbd/tiktoken) for calculating emoji token values

Dev Tools

nodemon (for hot reload in development)

CDNs Used

Emoji Button

Canvas Confetti

📦 Prerequisites
Node.js (v14+)

npm (v6+)

Modern browser (Chrome, Firefox, etc.)

Webcam (optional, but highly recommended!)

Place anushka.png (500x500 recommended) inside the /public folder

🧩 Installation
Clone the repo

bash
Copy
Edit
git clone https://github.com/your-username/sundharikku-bhindhi.git
cd sundharikku-bhindhi
Install dependencies

bash
Copy
Edit
npm install
Add the celebrity image
Place a file named anushka.png in the /public folder.

Start the server

For production:

bash
Copy
Edit
npm start
For development (auto-restart enabled):

bash
Copy
Edit
npm run dev
Play the game
Open your browser and head to http://localhost:3000

🕹️ Game Flow
Start Screen

Enter number of players (1–10)

Click "Start"

Countdown

Dramatic 3…2…1…GO!

Game Round
Each player:

Chooses an emoji

Clicks or drags it onto the spinning celebrity image

The image disappears after 5 seconds

Next player’s turn begins automatically

Reveal Time

All emojis appear in place

After a moment, the scoreboard pops up!

Scoreboard Shows

Player name

Emoji + token count

Distance from the target point (center of the forehead, about 28% from top)

Webcam Bonus

Click "പൊട്ടുതൊടൂ" to launch webcam view

Take a selfie with the bindi overlay

Download and flex your glory!

📁 File Structure
csharp
Copy
Edit
sundharikku-bhindhi/
├── public/
│   └── anushka.png       # Celebrity image
├── index.html            # Main game UI
├── style.css             # Styling and animation
├── script.js             # Frontend logic
├── server.js             # Express backend
├── package.json          # Project config
└── README.md             # This file
🧠 Scoring Logic
🎯 Distance: Euclidean distance (pixels) between placed emoji and target point.

🔤 Token Count: Calculated with GPT-2 tokenizer from @dqbd/tiktoken.

🏅 Ranking: Sorted first by distance (lower is better), then by token count.

⚠️ Notes
✅ Ensure anushka.png is in /public, or update index.html to use another image.

📸 Webcam feature requires browser permission and a supported device.

🌐 Internet is needed to load emoji picker and confetti from CDNs.

🔁 Default server port: 3000 (update in server.js if needed).

🛠️ Troubleshooting
Server not starting?
→ Check terminal logs, try reinstalling with npm install.

Image not loading?
→ Make sure anushka.png is inside /public and properly named.

Webcam not working?
→ Use a supported browser and grant webcam access.

CORS errors?
→ Ensure you're accessing via http://localhost:3000.

🤝 Contributing
Bug fixes? New features? Cool ideas?
We welcome pull requests! Just make sure it plays nicely with the current stack and includes clear documentation.

📜 License
MIT License – See the LICENSE file for details.

🙌 Acknowledgments
Built with ❤️ for playful digital mischief

Emoji Picker by Emoji Button

Celebrations powered by Canvas Confetti

Token logic powered by TikToken

Inspired by every “put a bindi on this” meme out there 🌶️
