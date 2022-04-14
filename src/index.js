import { App } from "@tinyhttp/app";
import { readFileSync } from "fs";

const app = new App();
const PORT = 8080;

/**
 * Convert a hiragana character to its katakana counterpart
 * @param {String} character 
 * @returns String
 */
function hiraToKata(character) {
    // Check to see if the character is in the ぁ-ゖ (U+3041 - U+3096) range
    const inHiraganaRange =
        character.charCodeAt(0) > 12352 // '぀'
     && character.charCodeAt(0) < 12439 // '゗'

    return (inHiraganaRange)
        ? String.fromCharCode(character.charCodeAt(0) + 96)
        : character
}

// Retrieve hiragana word array from the file
const words = JSON.parse(
    readFileSync("./assets/jmdict_hiragana.json", {encoding: "utf-8"}));

/**
 * Get a random word written in hiragana
 * @returns String[]
 */
function randomWord() {
    // Pick a random word
    const hiragana = words[~~(Math.random() * words.length)];

    return [
        hiragana,
        // Convert every character to katakana
        [...hiragana].map(hiraToKata).join('')
    ];
}

app.get("/", (_, response)=> {
    // Send as JSON data
    response.setHeader("Content-Type", "application/json");
    response.send(randomWord());
});

// Open the server on port 8080
app.listen(PORT, _ => {
    console.log(`Listening on port ${PORT}`);
});