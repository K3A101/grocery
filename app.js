require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const supabase = require('./supabase/supabase-config');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));



app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set("views", path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');


const router = require('./routes/route');
app.use('/', router);


// Export the app for use in Netlify functions
module.exports = app;

// Start the server only when running locally (not when imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening in http://localhost:${PORT}`);
  });
}
