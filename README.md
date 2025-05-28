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

## SEO Scoring System

The SEO Tag Visual Inspector uses a weighted scoring system to evaluate webpage SEO quality. Each tag is assigned points based on its importance to search engine optimization.

### Tag Weighting

| SEO Element           | Weight | Description |
|-----------------------|--------|-------------|
| Title                 | 15     | The page's main title tag |
| Meta Description      | 15     | Description that appears in search results |
| Title Length          | 10     | Optimal length of the title tag (50-60 characters) |
| Description Length    | 10     | Optimal length of meta description (50-160 characters) |
| Open Graph Title      | 10     | Title for social media sharing |
| Open Graph Description | 10    | Description for social media sharing |
| Open Graph Image      | 10     | Image shown when shared on social media |
| Meta Robots           | 5      | Instructions for search engine crawlers |
| Twitter Title         | 5      | Title for Twitter card |
| Twitter Description   | 5      | Description for Twitter card |
| Twitter Image         | 5      | Image for Twitter card |

### Status Evaluation

Each tag is evaluated and assigned one of three statuses:

| Status  | Visual Indicator | Points Earned | Description |
|---------|------------------|---------------|-------------|
| Pass    | ✅ Green         | 100% of weight | Tag exists and meets quality criteria |
| Warning | ⚠️ Yellow        | 50% of weight  | Tag exists but has issues (e.g., too short/long) |
| Fail    | ❌ Red           | 0% of weight   | Tag is missing or invalid |

### Score Calculation

The final score is calculated as:

1. For each tag with status "pass", its full weight is added to the score
2. For each tag with status "warning", half its weight is added to the score 
3. For each tag with status "fail", no points are added
4. Final percentage = (Total points earned / Total possible points) × 100
5. Result is rounded to the nearest whole number

### Visual Representation

The final score is color-coded for quick assessment:

- **Green (≥80)**: Good SEO implementation
- **Yellow (60-79)**: Needs some improvement
- **Red (<60)**: Poor SEO implementation, requires significant improvement

### Example Calculation

For a page with:
- Good title (pass = 15 points)
- Missing meta description (fail = 0 points)
- Title length optimal (pass = 10 points)
- No OG tags (fail = 0 points for og:title, og:description, og:image)
- No Twitter tags (fail = 0 points for all Twitter elements)
- No robots tag (fail = 0 points)

Total: 25/100 points = 25% (Red indicator)

## Application Interface

<img width="623" alt="demo" src="https://github.com/user-attachments/assets/a5895d5f-95ea-4862-be40-4d11df7a981e" />

<img width="623" alt="demo" src="https://github.com/user-attachments/assets/4c7530e5-d221-4dd4-bf4c-7ba0ead11985" />

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
