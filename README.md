# Clicker Heroes Save Editor

> **Free, browser-based Clicker Heroes save editor.** Decode, inspect, and edit your Clicker Heroes save file — modify gold, rubies, hero levels, Hero Souls, Ancients, ascensions, achievements, and more — then re-encode and copy the updated save back into the game. No installation required.

[![Open Issues](https://img.shields.io/github/issues/magnus-allison/clicker-heroes-save-editor)](https://github.com/magnus-allison/clicker-heroes-save-editor/issues)
[![License](https://img.shields.io/github/license/magnus-allison/clicker-heroes-save-editor)](LICENSE)

<img width="980" height="835" alt="Clicker Heroes Save Editor – browser-based save file editor showing gold, rubies, heroes and ascension data" src="https://github.com/user-attachments/assets/8f75e357-368b-4f25-ac89-ecc003654029" />

## Quick Start

1. **Open:** Double-click [index.html](index.html) or serve the folder and visit `http://localhost:8000`.
2. **Load Save:** Paste or load your save string/file using the in-app controls.
3. **Edit Values:** Change gold, rubies, hero levels, ascension state, achievements, profile fields, and more.
4. **Save/Export:** Export the modified save string from the UI and import it back into the game.

## Features

| Feature | Description |
|---|---|
| **Decode & Encode** | Instantly decode any Clicker Heroes save string and re-encode after edits. |
| **Edit Gold & Rubies** | Modify currency values directly — no third-party software needed. |
| **Hero Management** | Inspect and edit hero levels, unlocks, and upgrade states. |
| **Ascension & Hero Souls** | View and change ascension counts, Hero Souls, Ancients, and Outsiders. |
| **Achievements & Profile** | Toggle or edit achievement flags and player profile entries. |
| **Save Viewer** | Structured tree view of every key in the save for full transparency. |
| **100% Client-Side** | Runs entirely in your browser — nothing is sent to any server. |

## Run Locally (recommended)

Start a simple HTTP server from the project root to avoid browser file-access restrictions:

```bash
python3 -m http.server 8000
# or
npm install -g http-server && http-server -c-1
```

Then open `http://localhost:8000` in your browser.

## Safety & Backup

- **Always back up your original save before editing.** Editing saves can corrupt progress or violate game terms.
- The tool is provided as-is; use at your own risk.

## Contributing / Development Notes

- The UI and logic are plain HTML/JS — add features by editing files in [`js/`](js/) and styles in [`css/`](css/).
- If you add dependencies, update this README and include usage instructions.

## Related Resources

- [Clicker Heroes on Steam](https://store.steampowered.com/app/363970/Clicker_Heroes/)
- [Clicker Heroes Wiki (Fandom)](https://clickerheroes.fandom.com/wiki/Clicker_Heroes_Wiki)
- [Clicker Heroes Subreddit](https://www.reddit.com/r/ClickerHeroes/)
- [pako (zlib for JS)](https://github.com/nodeca/pako) — used for save decompression

## Keywords

clicker heroes save editor · clicker heroes save file editor · clicker heroes gold editor · clicker heroes rubies editor · clicker heroes hero souls · clicker heroes ancients editor · clicker heroes ascension editor · clicker heroes achievements · clicker heroes save decoder · clicker heroes save string · idle game save editor · incremental game tools · open source clicker heroes tool

## Contact

For questions or feature requests, [open an issue](https://github.com/magnus-allison/clicker-heroes-save-editor/issues) in this repository.
