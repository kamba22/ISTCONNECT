const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Middleware
app.use(cors());
app.use(express.json());


// 2. GET ALL SURVIVAL TIPS
app.get('/api/tips', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching tips:', error.message);
    res.status(500).json({ error: 'Failed to fetch survival tips' });
  }
});

// Add this near your other app.get routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'IstConnect Backend is running!' });
});

// 3. POST A NEW TIP (For your "Add Tip" form)
app.post('/api/tips', async (req, res) => {
  try {
    const { title, description, category, vibe_tag, latitude, longitude, image_url, user_id, images} = req.body;
    
    const { data, error } = await supabase
      .from('tips')
      .insert([{ title, description, category, vibe_tag, latitude, longitude, image_url, user_id, images}])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error saving tip:', error.message);
    res.status(500).json({ error: 'Failed to save tip' });
  }
});

// DELETE A TIP
app.delete('/api/tips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('tips')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Tip deleted successfully' });
  } catch (error) {
    console.error('Error deleting tip:', error.message);
    res.status(500).json({ error: 'Failed to delete tip' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});