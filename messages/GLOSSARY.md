# Translation glossary

English (`messages/en/*.json`) is the source of truth. Every other locale mirrors its keys exactly, and `lib/messages.test.ts` checks that keys and `{placeholders}` match.

## Spanish (`es`)

Neutral Spanish, informal _tú_, no _vosotros_ or regionalisms. Clicker Heroes itself is in English, so named game things stay in English: that is the name players see in game and search for.

| English                                                  | Spanish                              |
| -------------------------------------------------------- | ------------------------------------ |
| save (noun)                                              | partida                              |
| save string                                              | código de la partida                 |
| save file                                                | archivo de guardado                  |
| save editor                                              | editor de partidas                   |
| import / export                                          | importar / exportar                  |
| encode / decode                                          | codificar / decodificar              |
| gold                                                     | oro                                  |
| rubies                                                   | rubíes                               |
| Hero Souls, Ancient Souls, Transcendent Power            | _unchanged_                          |
| ancient(s), outsider(s)                                  | ancient(s), outsider(s)              |
| every hero, ancient, outsider, item and achievement name | _unchanged_                          |
| hero                                                     | héroe                                |
| ascend / ascension                                       | ascender / ascensión                 |
| transcend / transcension                                 | trascender / trascendencia           |
| gild (noun) / to gild / gilding chart                    | gild, gilds / dorar / tabla de gilds |
| idle / hybrid / active build                             | build idle / híbrida / activa        |
| zone, highest zone (HZE)                                 | zona, zona más alta (HZE)            |
| boss / monster                                           | jefe / monstruo                      |
| instakill                                                | instakill                            |
| mercenary / quest                                        | mercenario / misión                  |
| clan / raid                                              | clan / raid                          |
| achievement / skin / relic                               | logro / skin / reliquia              |
| auto-clicker                                             | autoclicker                          |
| level (noun / verb)                                      | nivel / subir de nivel               |
| cost                                                     | coste                                |
| run (one play-through between resets)                    | run                                  |

## German (`de`)

Informal _du_ (lowercase), as German gaming sites use. Named game things stay in English, as for Spanish. Use German quotation marks („…“) and decimal/thousands conventions only in prose; numbers inside `{placeholders}` are formatted by code.

| English                                                  | German                                 |
| -------------------------------------------------------- | -------------------------------------- |
| save (noun)                                              | Spielstand                             |
| save string                                              | Spielstand-Code                        |
| save file                                                | Speicherdatei                          |
| save editor                                              | Spielstand-Editor                      |
| import / export                                          | importieren / exportieren              |
| encode / decode                                          | kodieren / dekodieren                  |
| gold                                                     | Gold                                   |
| rubies                                                   | Rubine                                 |
| Hero Souls, Ancient Souls, Transcendent Power            | _unchanged_                            |
| ancient(s), outsider(s)                                  | Ancient(s), Outsider(s)                |
| every hero, ancient, outsider, item and achievement name | _unchanged_                            |
| hero                                                     | Held                                   |
| ascend / ascension                                       | aufsteigen / Aufstieg                  |
| transcend / transcension                                 | transzendieren / Transzendenz          |
| gild (noun) / to gild / gilding chart                    | Gild, Gilds / vergolden / Gild-Tabelle |
| idle / hybrid / active build                             | Idle- / Hybrid- / Aktiv-Build          |
| zone, highest zone (HZE)                                 | Zone, höchste Zone (HZE)               |
| boss / monster                                           | Boss / Monster                         |
| instakill                                                | Instakill                              |
| mercenary / quest                                        | Söldner / Quest                        |
| clan / raid                                              | Clan / Raid                            |
| achievement / skin / relic                               | Erfolg / Skin / Relikt                 |
| auto-clicker                                             | Autoclicker                            |
| level (noun / verb)                                      | Level / leveln                         |
| cost                                                     | Kosten                                 |
| run (one play-through between resets)                    | Run                                    |

Fixed UI strings the German FAQ refers to: "Load Save Data" → „Spielstand laden“, "Encode Save" → „Spielstand kodieren“, "Where is my save file?" → „Wo ist meine Speicherdatei?“, toast "Save data loaded." → „Spielstand geladen.“, Custom Field section → „Eigenes Feld“, Save JSON tool → „Spielstand als JSON“, Remove Clan Data tool → „Clan-Daten entfernen“.
