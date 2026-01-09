// Server-side Gemini service for safety steps
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY';

let genai = null;

const initGenAI = async () => {
  if (!genai) {
    if (GEMINI_API_KEY === 'YOUR_API_KEY') {
      return null;
    }

    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      if (GoogleGenerativeAI) {
        genai = new GoogleGenerativeAI(GEMINI_API_KEY);
      }
    } catch (error) {
      console.warn('Google GenAI not available:', error.message);
      return null;
    }
  }
  return genai;
};

const getSafeSteps = async (damageType, description) => {
  try {
    const ai = await initGenAI();
    
    if (!ai || GEMINI_API_KEY === 'YOUR_API_KEY') {
      return getFallbackSafetySteps(damageType);
    }

    const model = ai.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 250,
      }
    });

    const prompt = `User is experiencing a ${damageType} emergency. 
Context: ${description || 'Emergency restoration request'}. 
Provide exactly 4 critical 'immediate safety steps' the homeowner should take while waiting for our restoration crew. 
Keep it brief, authoritative, and helpful. 
Format as a list of points.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Safety Advice Error:', error);
    return getFallbackSafetySteps(damageType);
  }
};

const getFallbackSafetySteps = (damageType) => {
  const fallbackSteps = "1. Ensure everyone is out of danger.\n2. Turn off relevant utilities if safe.\n3. Do not enter unstable structures.\n4. Call emergency services if there is active fire or gas leaks.";
  
  const safetyAdvice = {
    'Water': `1. Turn off electricity at the main breaker if water is near electrical outlets
2. Avoid contact with standing water (may contain contaminants)
3. Document damage with photos before cleanup
4. Remove valuable items from affected areas`,

    'Fire/Smoke': `1. Ensure the fire is completely extinguished before re-entering
2. Do NOT enter if structure appears unstable
3. Ventilate the area by opening windows
4. Avoid touching soot-covered surfaces`,

    'Storm/Flood': `1. Stay away from damaged areas until assessed by professionals
2. Check for downed power lines - stay at least 35 feet away
3. Document all visible damage with photos
4. Cover exposed areas with tarps if safe to do so`,

    'Mold': `1. Avoid breathing in mold spores - limit time in affected area
2. Do NOT use bleach or attempt DIY removal
3. Keep children and pets away from moldy areas
4. Improve ventilation if safe to do so`,

    'Sewage': `1. AVOID CONTACT with sewage water - contains harmful bacteria
2. Turn off HVAC system to prevent spreading contaminants
3. Keep children and pets completely away from affected areas
4. Do NOT use household cleaning products`,

    'Other': fallbackSteps
  };

  return safetyAdvice[damageType] || fallbackSteps;
};

module.exports = {
  getSafeSteps
};

