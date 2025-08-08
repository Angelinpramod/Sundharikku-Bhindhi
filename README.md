Sundharikku Bhindhi
Sundharikku Bhindhi is a fun, multiplayer web-based game where players take turns placing emojis on a celebrity's face, aiming to position them as close as possible to a target point (between the eyebrows). The game calculates scores based on the distance from the target and the token count of the chosen emoji (using TikToken for LLM tokenization). The player with the smallest distance and lowest token count wins. The game includes a countdown, spinning image effects, a scoreboard, and a webcam feature to take snapshots with a virtual bindi.
Features

Multiplayer: Supports 1–10 players, with automatic turn-switching.
Emoji Placement: Players select emojis from a slider or picker and place them via click or drag-and-drop.
Scoring: Backend computes distances and token counts, ranking players by distance (ascending) and then token count (ascending).
Smooth Transitions: Includes fade-in/out animations and a spinning image effect.
Scoreboard: Displays player rankings with three columns: Player Name, Emoji (with token count), and Distance (in pixels).
Webcam Snapshot: Players can take a selfie with a virtual red bindi and download it.
Confetti Celebration: Visual feedback when the scoreboard appears.

Tech Stack

Frontend: HTML, CSS, JavaScript (ES Modules), Emoji Button, Canvas Confetti
Backend: Node.js, Express.js, CORS, TikToken
Dependencies:
@dqbd/tiktoken for token counting
express and cors for the server
nodemon (dev dependency) for development
External CDNs: Emoji Button, Canvas Confetti



Prerequisites

Node.js (v14 or higher)
npm (v6 or higher)
A modern web browser (Chrome, Firefox, etc.)
A webcam (optional, for the snapshot feature)
An image file named anushka.png (place in the public folder)

Installation

Clone the Repository:
git clone https://github.com/your-username/sundharikku-bhindhi.git
cd sundharikku-bhindhi


Install Dependencies:
npm install


Prepare the Image:

Place an image file named anushka.png in the public folder. This is the celebrity image used in the game. Ensure it’s approximately 500x500 pixels for best results.


Start the Server:

For production:
npm start


For development (with auto-restart):
npm run dev




Access the Game:

Open your browser and navigate to http://localhost:3000.



Game Flow

Start Screen: Enter the number of players (1–10) and click "Start."
Countdown: A 3-2-1-GO! animation plays.
Game Screen: The celebrity image spins and fades out after 5 seconds. Each player:
Selects an emoji from the slider or emoji picker.
Places it by clicking or dragging onto the image area.
The game automatically prompts the next player after each placement.


Image Reveal: After all players place their emojis, the image reappears with all emojis visible.
Scoreboard: After 5 seconds, the scoreboard appears, showing:
Player name
Chosen emoji and its token count
Distance from the target point (in pixels)
The player with the lowest distance (and lowest token count in case of a tie) is ranked #1.


Webcam: Click "പൊട്ടുതൊടൂ" (Place the Bindi) to open the webcam, view a live feed with a red bindi overlay, take a snapshot, and download it.

File Structure
sundharikku-bhindhi/
├── public/
│   └── anushka.png         # Celebrity image
├── index.html             # Main HTML file
├── style.css              # Styles for layout and animations
├── script.js              # Frontend logic (game flow, UI interactions)
├── server.js              # Backend server (Express.js)
├── package.json           # Project metadata and dependencies
└── README.md              # This file

How Scoring Works

Distance: Calculated as the Euclidean distance (in pixels) between the placed emoji and the target point (center of the image, 28% from the top).
Token Count: Computed using the @dqbd/tiktoken library (GPT-2 model) based on the emoji's UTF-8 encoding.
Ranking: Players are sorted by distance (ascending) first, then by token count (ascending). The lowest values win.

Notes

Ensure anushka.png is in the public folder, or update the src attribute in index.html to point to your image.
The webcam feature requires user permission and a compatible device.
The game uses external CDNs for Emoji Button and Canvas Confetti, so an internet connection is required.
The server runs on port 3000 by default. Update server.js if you need a different port.

Troubleshooting

Server Errors: Check the console for logs. Ensure all dependencies are installed (npm install).
Image Not Loading: Verify anushka.png is in the public folder and accessible.
Webcam Issues: Ensure browser permissions allow webcam access. Use a modern browser for best compatibility.
CORS Errors: The server includes CORS middleware, but ensure you’re accessing via http://localhost:3000.

Contributing
Feel free to submit issues or pull requests for bug fixes, enhancements, or new features. Ensure any changes maintain compatibility with the existing tech stack and include appropriate tests.
License
This project is licensed under the MIT License. See the LICENSE file for details.
Acknowledgments

Built with lovable❤️ for a fun, interactive gaming experience.
Uses Emoji Button and Canvas Confetti for UI enhancements.
Powered by Express.js and TikToken for backend logic.
