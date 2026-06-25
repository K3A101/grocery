
const express = require("express");
const router = express.Router();
const supabase = require('../supabase/supabase-config');

router.get('/', async (req, res) => {
    console.log('route hit');
    const { data: groceries, error } = await supabase
        .from('Groceries')
        .select('*');

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

router.post('/add-item', async (req, res) => {
    console.log('POST /add-item route hit');
    console.log('Request body:', req.body);
    try {
        const { grocery, price, quantity, images, description } = req.body;

        // Insert the new grocery item into the database
        const { data, error } = await supabase
            .from('Groceries')
            .insert([
                {
                    name: grocery,
                    description: description,
                    price: price ? parseFloat(price) : null,
                    images: images ? images : null,
                    amount: quantity ? parseInt(quantity) : 1
                }
            ])
            .select();

        if (error) {
            console.error('Error adding grocery item:', error.message);
            return res.status(500).json({ error: 'Failed to add item' });
        }

        console.log('Item added successfully:', data);

        // Redirect back to the home page to see the updated list
        res.redirect('/');
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
})




module.exports = router;