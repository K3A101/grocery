# Grocery List App

A full-stack grocery list application with image upload functionality, built with Express.js and Supabase.

## Description

This is a list app where you can add your groceries when you go shopping. It helps you keep an overview of what you need and how much the items you want to buy will cost.

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Templating**: EJS
- **File Upload**: Multer
- **Styling**: SCSS
- **JavaScript**: Vanilla JS + SortableJS
- **Deployment**: Netlify (Serverless Functions)

## Features

- [x] Overview of all groceries items with images
- [x] List and grid view options
- [x] Add items with name, description, price, quantity, and image
- [x] Upload images to Supabase Storage
- [x] Delete items from the list
- [x] Drag and drop to rearrange items (SortableJS)
- [x] Increment/decrement quantity
- [x] Check off items
- [x] Calculate total price of all groceries
- [x] Calculate total items in the list

---

## Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- npm or yarn
- A Supabase account
- A Netlify account (for deployment)

---

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd grocery-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Dev Dependencies

```bash
npm install --save-dev nodemon sass
```

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Fill in:
   - **Name**: `grocery-app` (or any name)
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to you
4. Click **Create new project**
5. Wait for the project to initialize (~2 minutes)

### Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key (for frontend - not used in this project)
   - **service_role** key (for backend - **use this one**)

⚠️ **Important**: Use the **service_role** key for backend operations, not the anon key.

### Step 3: Create the Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Paste and run this SQL:

```sql
-- Create the Groceries table
CREATE TABLE "Groceries" (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  images TEXT,
  amount INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE "Groceries" ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (adjust based on your needs)
CREATE POLICY "Allow all operations on Groceries"
ON "Groceries"
FOR ALL
TO public
USING (true)
WITH CHECK (true);
```

4. Click **Run** or press `Ctrl/Cmd + Enter`

### Step 4: Create Storage Bucket for Images

1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Fill in:
   - **Name**: `grocery-images`
   - **Public bucket**: ✅ Check this (so images are publicly accessible)
4. Click **Create bucket**

### Step 5: Set Storage Policies

1. Click on the `grocery-images` bucket
2. Go to **Policies** tab
3. Click **New policy**
4. Choose **For full customization** → Click **Create policy**
5. Add these policies:

**Policy 1: Allow Public Read**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'grocery-images');
```

**Policy 2: Allow Public Upload**
```sql
CREATE POLICY "Public upload access"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'grocery-images');
```

**Policy 3: Allow Public Delete** (optional)
```sql
CREATE POLICY "Public delete access"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'grocery-images');
```

Or create one policy for all operations:
```sql
CREATE POLICY "Allow all operations"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'grocery-images')
WITH CHECK (bucket_id = 'grocery-images');
```

---

## Environment Variables

### 1. Create `.env` file

Create a `.env` file in the root directory:

```bash
touch .env
```

### 2. Add Your Supabase Credentials

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-service-role-key-here

# Server Configuration
PORT=3000
```

⚠️ **Important**: Use the **service_role** key, not the anon key, for backend operations.

### 3. Add `.env` to `.gitignore`

Make sure your `.env` file is in `.gitignore`:

```bash
echo ".env" >> .gitignore
```

---

## Running the Project

### Development Mode

Run both the server and SCSS compiler in separate terminals:

```bash
# Terminal 1: Start the server with auto-reload
npm run dev

# Terminal 2: Watch and compile SCSS
npm run scss
```

The app will be available at `http://localhost:3000`

### Production Mode

```bash
node app.js
```

---

## Project Structure

```
grocery-app/
├── app.js                      # Main Express server
├── routes/
│   └── route.js               # API routes (GET, POST, DELETE)
├── views/
│   ├── index.html             # Main layout template
│   ├── front-page.html        # Homepage content
│   └── partials/
│       ├── header.html        # Header component
│       ├── add-items-form.html # Add item form (popover)
│       ├── svg.html           # SVG icon component
│       └── toast.html         # Toast notification component
├── static/
│   ├── css/
│   │   ├── style.css          # Compiled CSS (auto-generated)
│   │   └── style.css.map      # Source map
│   ├── scss/
│   │   ├── _structure.scss    # Main styles
│   │   └── style.scss         # SCSS entry point
│   ├── js/
│   │   └── script.js          # Frontend JavaScript
│   └── svg/
│       └── general.svg        # SVG sprite
├── supabase/
│   └── supabase-config.js     # Supabase client configuration
├── .env                        # Environment variables (not in git)
├── .gitignore
├── package.json
├── netlify.toml               # Netlify configuration
└── README.md
```

---

## Netlify Deployment Setup

### Step 1: Install Serverless HTTP

```bash
npm install serverless-http
```

### Step 2: Create `netlify.toml`

Create a `netlify.toml` file in the root directory:

```toml
[build]
  command = "npm install && npm run build"
  functions = "netlify/functions"
  publish = "static"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/app"
  status = 200

[functions]
  node_bundler = "esbuild"
```

### Step 3: Create Netlify Function Wrapper

Create the directory structure:

```bash
mkdir -p netlify/functions
```

Create `netlify/functions/app.js`:

```javascript
const serverless = require('serverless-http');
const express = require('express');
const app = require('../../app');

// Export the serverless function
exports.handler = serverless(app);
```

### Step 4: Update `app.js` for Serverless

Modify the end of your `app.js` to export the app:

```javascript
// Export for Netlify Functions
module.exports = app;

// Only start server if not in serverless environment
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
```

Replace the existing `app.listen()` block with this code.

### Step 5: Update `package.json`

Add a build script:

```json
{
  "scripts": {
    "dev": "nodemon -L app.js",
    "scss": "sass --watch static/scss:static/css --style compressed",
    "build": "sass static/scss:static/css --style compressed",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### Step 6: Deploy to Netlify

#### Option A: Via Netlify Dashboard

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect your Git repository (GitHub, GitLab, Bitbucket)
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `static`
   - **Functions directory**: `netlify/functions`
5. Click **Deploy site**

#### Option B: Via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize the site
netlify init

# Deploy to production
netlify deploy --prod
```

### Step 7: Add Environment Variables in Netlify

1. In Netlify dashboard, go to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add these variables:
   ```
   SUPABASE_URL = https://xxxxx.supabase.co
   SUPABASE_KEY = your-service-role-key
   ```
4. Save and trigger a redeploy

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Display all grocery items |
| POST | `/add-item` | Add a new grocery item with optional image |
| DELETE | `/delete-item/:id` | Delete a grocery item by ID |

---

## Common Issues & Solutions

### Issue: "Could not find the 'images' column"
**Solution**: Make sure your database column is named `images` (plural) in your Supabase table.

### Issue: "Bucket not found" when uploading images
**Solution**:
1. Go to Supabase → Storage
2. Create a bucket named `grocery-images`
3. Make it public

### Issue: Images upload but show broken link
**Solution**:
1. Make sure the storage bucket is set to **Public**
2. Add the read policy (see Step 5 of Supabase Setup)

### Issue: "Failed to upload image"
**Solution**: Check that you're using the **service_role** key in your `.env` file, not the anon key.

### Issue: "Module not found" errors on Netlify
**Solution**:
1. Make sure all dependencies are in `dependencies` (not `devDependencies`)
2. Run `npm install` locally to update `package-lock.json`
3. Commit and push changes

### Issue: Routes not working on Netlify
**Solution**: Check that `netlify.toml` has the correct redirect rules.

### Issue: SortableJS import error
**Solution**: Make sure you added this line to `app.js`:
```javascript
app.use('/node_modules', express.static('node_modules'));
```

---

## Supabase Reusable Template

For future projects, use this checklist:

### Supabase Quick Setup Checklist

- [ ] Create new Supabase project
- [ ] Copy `SUPABASE_URL` and `SUPABASE_KEY` (service_role)
- [ ] Create database tables (SQL Editor)
- [ ] Enable Row Level Security (RLS)
- [ ] Add RLS policies (allow operations based on auth)
- [ ] Create storage buckets (if using file uploads)
- [ ] Set storage bucket to Public (if needed)
- [ ] Add storage policies (SELECT, INSERT, DELETE)
- [ ] Add environment variables to `.env`
- [ ] Test connection with a simple query

### Supabase Client Template

Create `supabase/supabase-config.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
```

### Basic CRUD Operations

```javascript
// SELECT - Get all items
const { data, error } = await supabase
  .from('TableName')
  .select('*');

// INSERT - Add new item
const { data, error } = await supabase
  .from('TableName')
  .insert([{ column: 'value' }])
  .select();

// UPDATE - Update item
const { data, error } = await supabase
  .from('TableName')
  .update({ column: 'new value' })
  .eq('id', itemId)
  .select();

// DELETE - Delete item
const { data, error } = await supabase
  .from('TableName')
  .delete()
  .eq('id', itemId);
```

### Image Upload Template

```javascript
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), async (req, res) => {
  if (req.file) {
    const fileName = `${Date.now()}-${req.file.originalname}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('bucket-name')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype
      });

    if (!error) {
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('bucket-name')
        .getPublicUrl(fileName);

      console.log('Image URL:', publicUrl);
    }
  }
});
```

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `SUPABASE_KEY` | Service role key (backend) | ✅ Yes |
| `PORT` | Server port (default: 3000) | ❌ No |

---

## License

MIT

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## Support

For issues or questions, open an issue on GitHub.