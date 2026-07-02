
const express = require("express");
const router = express.Router();
const supabase = require('../supabase/supabase-config');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

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
        groceries: groceries || [],
    });
});

router.post('/add-item', upload.single('image'), async (req, res) => {
    console.log('POST /add-item route hit');
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    try {
        const { name, price, quantity, description } = req.body;
        let imageUrl = null;

        // If an image was uploaded, upload it to Supabase Storage
        if (req.file) {
            const timestamp = Date.now();
            const fileName = `${timestamp}-${req.file.originalname}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('grocery-images')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                console.error('Full error details:', JSON.stringify(uploadError, null, 2));
            } else {
                // Get the public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('grocery-images')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
                console.log('Image uploaded successfully:', imageUrl);
            }
        }

        // Insert the new grocery item into the database
        const { data, error } = await supabase
            .from('Groceries')
            .insert([
                {
                    name: name,
                    description: description,
                    price: price ? parseFloat(price) : null,
                    images: imageUrl,
                    amount: quantity ? parseInt(quantity) : 1
                }
            ])
            .select();

        if (error) {
            console.error('Error adding grocery item:', error.message);
            console.error('Full database error:', JSON.stringify(error, null, 2));
            // Still redirect even if there's an error
            return res.redirect('/');
        }

        console.log('Item added successfully:', data);

        // Redirect back to the home page to see the updated list
        res.redirect('/');
    } catch (err) {
        console.error('Server error:', err);
        // Redirect instead of showing JSON error
        res.redirect('/');
    }
})

router.delete('/delete-item/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('Groceries')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting item:', error.message);
            return res.status(500).json({ error: 'Failed to delete item' });
        }

        console.log('Item deleted successfully:', data);
        res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
})


module.exports = router;