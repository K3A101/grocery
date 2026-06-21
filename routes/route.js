
const express = require("express");
const router = express.Router();
const supabase = require('../supabase/supabase-config');

router.get('/', async (req, res) => {
    console.log('route hit');
    const { data: groceries, error } = await supabase
        .from('Groceries')
        .select('*');

    console.log('groceries:', groceries);
    console.log('error:', error);

    if (error) {
        console.error('Error fetching groceries:', error.message);
    }

    res.render('index', {
        title: 'Home Page',
        content: './front-page.html',
        stylesheets: ['/css/style.css'],
        scripts: ['/js/script.js'],
        groceries: groceries || []
    });
});




module.exports = router;