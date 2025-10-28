# Changelog

## [1.0.0] - 2025-10-28

### ✨ Major Update: Migration to Google Gemini API

#### Added
- **Google Gemini 2.0 Flash integration** for both image analysis and chat
- New `server/gemini.ts` service for AI operations
- Comprehensive README with quick start guide
- Updated `.env.example` with Gemini configuration

#### Changed
- **Image Classification**: Now using Gemini Vision API (much faster and more accurate)
- **Chatbot**: Now using Gemini for chat responses (significantly faster)
- Updated project name from `rest-express` to `ecovision` in package.json
- Improved README with better structure and documentation

#### Removed
- ❌ `server/deepseek.ts` - Old OpenRouter/DeepSeek implementation
- ❌ `server/waste_classifier.py` - Old Hugging Face Python model
- ❌ `openai` npm package dependency (no longer needed)
- ❌ Old build artifacts from `dist/` directories
- ❌ Temporary migration guide files

#### Performance Improvements
- 🚀 **2-5x faster** image analysis response times
- ⚡ **Near-instant** chat responses
- 🎯 **Higher accuracy** in waste classification
- 💰 **More cost-effective** with Gemini's generous free tier

#### Breaking Changes
- **Environment Variable Change**: 
  - Old: `OPENROUTER_API_KEY`, `HF_API_TOKEN`
  - New: `GEMINI_API_KEY`
- **API Provider**: No longer supports provider selection in `/api/analyze-waste` endpoint

### Migration Notes
Users upgrading from the previous version need to:
1. Get a Gemini API key from https://aistudio.google.com/app/apikey
2. Update `.env` file with `GEMINI_API_KEY`
3. Remove old `OPENROUTER_API_KEY` and `HF_API_TOKEN` variables
4. Restart the development server

---

## [0.9.0] - Previous Version

Initial version with DeepSeek/OpenRouter and Hugging Face integration.
