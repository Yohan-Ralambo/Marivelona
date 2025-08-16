const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

const charactersPath = path.join(__dirname, 'characters.json');

// Helper functions
async function readCharacters() {
  const data = await fs.readFile(charactersPath, 'utf8');
  return JSON.parse(data).characters;
}

async function writeCharacters(characters) {
  await fs.writeFile(charactersPath, JSON.stringify({ characters }, null, 2));
}

// Routes
// GET all characters
app.get('/api/characters', async (req, res) => {
  try {
    const characters = await readCharacters();
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read characters' });
  }
});

// POST new character
app.post('/api/characters', async (req, res) => {
  try {
    const characters = await readCharacters();
    const newCharacter = {
      id: characters.length > 0 ? Math.max(...characters.map(c => c.id)) + 1 : 1,
      ...req.body
    };
    characters.push(newCharacter);
    await writeCharacters(characters);
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create character' });
  }
});

// GET character by ID
app.get('/api/characters/:id', async (req, res) => {
  try {
    const characters = await readCharacters();
    const character = characters.find(c => c.id === parseInt(req.params.id));
    character ? res.json(character) : res.status(404).json({ error: 'Character not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read character' });
  }
});

// PUT update character
app.put('/api/characters/:id', async (req, res) => {
  try {
    const characters = await readCharacters();
    const index = characters.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Character not found' });
    
    characters[index] = { ...characters[index], ...req.body };
    await writeCharacters(characters);
    res.json(characters[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update character' });
  }
});

// DELETE character
app.delete('/api/characters/:id', async (req, res) => {
  try {
    const characters = await readCharacters();
    const filteredCharacters = characters.filter(c => c.id !== parseInt(req.params.id));
    if (characters.length === filteredCharacters.length) {
      return res.status(404).json({ error: 'Character not found' });
    }
    await writeCharacters(filteredCharacters);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete character' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});