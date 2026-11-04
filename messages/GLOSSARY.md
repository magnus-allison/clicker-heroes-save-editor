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

## Portuguese (`pt`)

Brazilian Portuguese, informal _você_. Named game things stay in English, as for Spanish and German. Numbers inside `{placeholders}` are formatted by code.

| English                                                  | Portuguese                               |
| -------------------------------------------------------- | ---------------------------------------- |
| save (noun)                                              | save                                     |
| save string                                              | código do save                           |
| save file                                                | arquivo de save                          |
| save editor                                              | editor de save                           |
| import / export                                          | importar / exportar                      |
| encode / decode                                          | codificar / decodificar                  |
| gold                                                     | ouro                                     |
| rubies                                                   | rubis                                    |
| Hero Souls, Ancient Souls, Transcendent Power            | _unchanged_                              |
| ancient(s), outsider(s)                                  | ancient(s), outsider(s)                  |
| every hero, ancient, outsider, item and achievement name | _unchanged_                              |
| hero                                                     | herói                                    |
| ascend / ascension                                       | ascender / ascensão                      |
| transcend / transcension                                 | transcender / transcendência             |
| gild (noun) / to gild / gilding chart                    | gild, gilds / dar gild / tabela de gilds |
| idle / hybrid / active build                             | build idle / híbrida / ativa             |
| zone, highest zone (HZE)                                 | zona, zona mais alta (HZE)               |
| boss / monster                                           | chefe / monstro                          |
| instakill                                                | instakill                                |
| mercenary / quest                                        | mercenário / missão                      |
| clan / raid                                              | clã / raid                               |
| achievement / skin / relic                               | conquista / skin / relíquia              |
| auto-clicker                                             | autoclicker                              |
| level (noun / verb)                                      | nível / subir de nível                   |
| cost                                                     | custo                                    |
| run (one play-through between resets)                    | run                                      |

Fixed UI strings the Portuguese FAQ refers to: "Load Save Data" → "Carregar save", "Encode Save" → "Codificar save", "Where is my save file?" → "Onde está meu arquivo de save?", toast "Save data loaded." → "Save carregado.", Custom Field section → "Campo personalizado", Save JSON tool → "Save em JSON", Remove Clan Data tool → "Remover dados do clã".

## French (`fr`)

French as used in France, informal _tu_, as French gaming sites use. Named game things stay in English, as for the other locales. Use French typography in prose: a non-breaking space (U+00A0) before `: ; ! ?` and inside « guillemets », and a decimal comma. Numbers inside `{placeholders}` are formatted by code.

| English                                                  | French                                  |
| -------------------------------------------------------- | --------------------------------------- |
| save (noun)                                              | sauvegarde                              |
| save string                                              | code de sauvegarde                      |
| save file                                                | fichier de sauvegarde                   |
| save editor                                              | éditeur de sauvegarde                   |
| import / export                                          | importer / exporter                     |
| encode / decode                                          | encoder / décoder                       |
| gold                                                     | or                                      |
| rubies                                                   | rubis                                   |
| Hero Souls, Ancient Souls, Transcendent Power            | _unchanged_                             |
| ancient(s), outsider(s)                                  | ancient(s), outsider(s)                 |
| every hero, ancient, outsider, item and achievement name | _unchanged_                             |
| hero                                                     | héros                                   |
| ascend / ascension                                       | ascensionner / ascension                |
| transcend / transcension                                 | transcender / transcendance             |
| gild (noun) / to gild / gilding chart                    | gild, gilds / dorer / tableau des gilds |
| idle / hybrid / active build                             | build idle / hybride / active           |
| zone, highest zone (HZE)                                 | zone, zone la plus haute (HZE)          |
| boss / monster                                           | boss / monstre                          |
| instakill                                                | instakill                               |
| mercenary / quest                                        | mercenaire / quête                      |
| clan / raid                                              | clan / raid                             |
| achievement / skin / relic                               | succès / skin / relique                 |
| auto-clicker                                             | autoclicker                             |
| level (noun / verb)                                      | niveau / monter de niveau               |
| cost                                                     | coût                                    |
| run (one play-through between resets)                    | run                                     |

Fixed UI strings the French FAQ refers to: "Load Save Data" → « Charger la sauvegarde », "Encode Save" → « Encoder la sauvegarde », "Where is my save file?" → « Où est mon fichier de sauvegarde ? », toast "Save data loaded." → « Sauvegarde chargée. », Custom Field section → « Champ personnalisé », Save JSON tool → « Sauvegarde en JSON », Remove Clan Data tool → « Supprimer les données de clan ». Tool names: « Calculateur d’ancients », « Calculateur d’outsiders », « Calculateur d’instakill », « Visualiseur de transcendances », « Visualiseur de mercenaires », « Convertisseur de sauvegarde », « Guide du débutant ».
