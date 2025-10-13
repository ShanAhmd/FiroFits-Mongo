<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/14cWZdk7AtrRI0-4yYis-Wb2u33AfaJEv

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Deploy to Vercel

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Go to https://vercel.com/new and import your project.
3. When prompted for Build Settings, set:
   - **Framework Preset**: Vite
   - **Build Command**: npm run build
   - **Output Directory**: dist
4. Go to the "Environment Variables" section, add:
   - **Name**: GEMINI_API_KEY
   - **Value**: your Gemini API key
   - **Environment**: Production (and Preview if needed)
5. Click "Deploy". Vercel will build and host your site using the contents of the `dist` folder.

---

## Environment Variables

To run or deploy this app, you must provide a Gemini API key as an environment variable.

Create a `.env.local` file like this (never commit real secrets):

```
GEMINI_API_KEY=your-real-api-key-here
```

On Vercel, add GEMINI_API_KEY in the Environment Variables settings with your value.
