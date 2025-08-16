import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    realName: '',
    universe: 'Earth-616'
  });

  // Fetch all characters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/characters');
        const data = await response.json();
        setCharacters(data);
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Create new character
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const newCharacter = await response.json();
      setCharacters([...characters, newCharacter]);
      setFormData({ name: '', realName: '', universe: 'Earth-616' });
    } catch (error) {
      console.error('Error creating character:', error);
    }
  };

  // Delete character
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/characters/${id}`, { method: 'DELETE' });
      setCharacters(characters.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="App">
      <h1>Marvel Characters Manager</h1>
      
      {/* Add Character Form */}
      <form onSubmit={handleSubmit} className="character-form">
        <h2>Add New Character</h2>
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Character Name"
          required
        />
        <input
          name="realName"
          value={formData.realName}
          onChange={handleInputChange}
          placeholder="Real Name"
        />
        <input
          name="universe"
          value={formData.universe}
          onChange={handleInputChange}
          placeholder="Universe"
        />
        <button type="submit">Add Character</button>
      </form>

      {/* Characters List */}
      <div className="character-grid">
        {characters.map(character => (
          <div key={character.id} className="character-card">
            <h3>{character.name}</h3>
            <p><strong>Real Name:</strong> {character.realName}</p>
            <p><strong>Universe:</strong> {character.universe}</p>
            <button 
              onClick={() => handleDelete(character.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;