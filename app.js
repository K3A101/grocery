require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const supabase = require('./supabase/supabase-config');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('static'));
app.use('/node_modules', express.static('node_modules'));



app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set("views", "./views");
// app.set('view engine', 'ejs');


const router = require('./routes/route');
app.use('/', router);


// Start the server
app.listen(3000, () => {
  console.log(`Server listening in http://localhost:${PORT}`);
});

