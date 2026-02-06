# Clicker Heroes Save Editor

A small browser-based tool for inspecting and editing Clicker Heroes savedata. Use it to view and modify your save (gold, rubies, heroes, ascension, achievements, profile data, etc.). Always back up your save before making changes.

**Quick Start**

- **Open:** Double-click [index.html](index.html) or serve the folder and visit `http://localhost:8000`.
- **Load Save:** Use the UI to paste or load your save string/file (see in-app controls).
- **Edit Values:** Change values such as gold and rubies, hero levels, ascension state, achievements, and profile fields.
- **Save/Export:** Export the modified save string from the UI and import it back into the game.

**Features**

- **Edit Gold & Rubies:** Modify currency values directly from the editor.
- **Hero Management:** Inspect and edit hero levels and unlocks.
- **Ascension Data:** View and change ascension-related info and stats.
- **Achievements & Profile:** Toggle or edit achievements and profile entries.
- **Save Viewer:** Visualize your save structure to understand nested data.

**Run Locally (recommended)**

1. From the project root, start a simple HTTP server (recommended to avoid browser file restrictions):

```bash
python3 -m http.server 8000
# or
npm install -g http-server && http-server -c-1
```

2. Open `http://localhost:8000` in your browser.

**Safety & Backup**

- Always back up your original save before editing. Editing saves can corrupt progress or violate game terms.
- The tool is provided as-is; use at your own risk.

**Contributing / Development Notes**

- The UI and logic are plain HTML/JS; add features by editing files in `js/` and styles in `css/`.
- If you add dependencies, update the README and include usage instructions.

**Contact**

- For questions or feature requests, open an issue in the project repository.
