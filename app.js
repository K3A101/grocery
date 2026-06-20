require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const supabase = require('./supabase/supabase-config');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('static'));

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.render('index', {
    test: 'Test the word',
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  const { data, error } = await supabase.from('Groceries').select('*').limit(1);
  if (error) {
    console.error('Supabase connection failed:', error.message);
  } else {
    console.log('Supabase connected. Groceries table found:', data);
  }
});
