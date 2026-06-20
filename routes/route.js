
const express = require("express");
const router = express.Router();

// const { createClient } = require('@supabase/supabase-js')

// const supabaseUrl = process.env.SUPABASE_URL
// const supabaseKey = process.env.SUPABASE_KEY
// const supabase = createClient(supabaseUrl, supabaseKey)

// Homepagina
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        content: './front-page.html', // Embed home.ejs
        stylesheets: ['/css/style.css'],
        scripts: ['/js/script.js']
    });
});




module.exports = router;