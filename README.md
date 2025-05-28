# SEO Tag Visual Inspector

A full-stack web application that allows users to input any public URL and receive an interactive analysis of its SEO metadata, along with Google and social media previews.

## Features

- URL input field with "Check" button
- SEO Score display (0-100)
- Google Search Preview card
- Social Media Preview card
- SEO Tag extraction and analysis for:
  - `<title>`
  - `<meta name="description">`
  - `<meta name="robots">`
  - `og:title`, `og:description`, `og:image`
  - `twitter:title`, `twitter:description`, `twitter:image`
- Visual scoring indicators for each tag:
  - ✅ Green = Pass
  - ⚠️ Yellow = Needs improvement
  - ❌ Red = Missing or invalid
- Explanations for each tag's status

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js with Express
- **Libraries**:
  - Express (Web server)
  - Axios (HTTP requests)
  - Cheerio (HTML parsing)
  - CORS (Cross-origin resource sharing)

## Setup and Installation

### Prerequisites
- Node.js and npm installed

### Installation Steps

1. Clone or download this repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open a web browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. Enter a valid URL (including http:// or https://) in the input field
2. Click the "Check" button or press Enter
3. View the analysis results:
   - SEO score
   - Google preview
   - Social media preview
   - Detailed tag analysis

## Application Interface

![SEO Tag Visual Inspector Screenshot](<img width="623" alt="demo" src="https://github.com/user-attachments/assets/b89a998b-b463-4d6e-b289-98c387d29475" />)

The application interface consists of:

1. **URL Input Bar** - At the top where users can enter any website URL to analyze

2. **SEO Tag Analysis Panel** - On the left, showing:
   - Overall SEO score (41/100 in the example)
   - Status indicators for various SEO tags:
     - ⚠️ Yellow warnings for tags that need improvement
     - ❌ Red indicators for missing tags
   - Specific tag issues such as "Title is too short", "Meta description is missing", etc.

3. **Google Preview** - In the center, displaying how the page would appear in Google search results

4. **Social Media Preview** - On the right, showing how the page would appear when shared on social platforms

Each SEO tag is analyzed individually with clear visual indicators of issues that need to be addressed to improve the overall SEO score.

## Project Structure

```
- seo-inspector/
  - frontend/
    - index.html        (UI structure)
    - styles.css        (Styling)
    - script.js         (Frontend logic)
  - backend/
    - server.js         (API and server logic)
    - package.json      (Dependencies)
  - README.md           (This file)
```

## License

MIT
