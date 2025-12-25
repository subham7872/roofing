// Gemini AI Service for chat functionality
// Note: Replace 'YOUR_API_KEY' with your actual Google Gemini API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY';

let genai = null;

// Dynamically import Google GenAI
// Note: Vite will try to resolve imports at build time, so we use a workaround
const initGenAI = async () => {
  if (!genai) {
    // Only try to load if API key is set
    if (GEMINI_API_KEY === 'YOUR_API_KEY') {
      return null;
    }

    try {
      // Try to load from import map (browser ESM) or npm package
      // Using eval to prevent Vite from analyzing this import at build time
      let module;
      try {
        // Try import map first (only works at runtime in browser)
        const importFn = new Function('return import("@google/genai")');
        module = await importFn();
      } catch (e1) {
        // Fallback to npm package
        const importFn = new Function('return import("@google/generative-ai")');
        module = await importFn();
      }
      
      const GoogleGenerativeAI = module.GoogleGenerativeAI || module.default?.GoogleGenerativeAI;
      
      if (GoogleGenerativeAI) {
        genai = new GoogleGenerativeAI(GEMINI_API_KEY);
      } else {
        console.warn('GoogleGenerativeAI class not found in module');
        return null;
      }
    } catch (error) {
      console.warn('Google GenAI not available, using mock responses. Error:', error.message);
      return null;
    }
  }
  return genai;
};

export const askGemini = async (message, isThinking = false) => {
  try {
    const ai = await initGenAI();
    
    // If GenAI is not available or API key is not set, use mock responses
    if (!ai || GEMINI_API_KEY === 'YOUR_API_KEY') {
      return getMockChatResponse(message, isThinking);
    }

    const model = ai.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are a helpful assistant for RestorePro Services, a 24/7 emergency restoration company. 
    You help customers with water damage, fire damage, mold remediation, storm damage, and sewage cleanup.
    Be professional, empathetic, and concise. If asked about emergencies, emphasize our 60-minute response time.
    ${isThinking ? 'Think deeply and provide a comprehensive answer.' : 'Provide a quick, helpful response.'}
    
    Customer question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getMockChatResponse(message, isThinking);
  }
};

const getMockChatResponse = (message, isThinking) => {
  const responses = [
    "I'd be happy to help you with your restoration needs! Are you dealing with water damage, fire damage, or another emergency?",
    "Our team specializes in emergency restoration services. We can dispatch a team within 60 minutes. What type of damage are you experiencing?",
    "We offer 24/7 emergency response for water damage, fire damage, mold remediation, and more. Would you like to schedule a free inspection?",
    "RestorePro Services handles all types of emergency restoration. We work directly with insurance companies. What can I help you with today?",
    "We serve your area with rapid response times. Our certified technicians are available 24/7. What emergency are you facing?"
  ];
  
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(responses[Math.floor(Math.random() * responses.length)]);
    }, isThinking ? 2000 : 1000);
  });
};

export const analyzeRoofImage = async (base64Image) => {
  try {
    const ai = await initGenAI();
    
    // If GenAI is not available or API key is not set, use mock responses
    if (!ai || GEMINI_API_KEY === 'YOUR_API_KEY') {
      return getMockImageAnalysis();
    }

    const model = ai.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    const prompt = `Analyze this damage/restoration image. Provide a professional assessment including:
    1. Overall condition/status
    2. Key findings (visible damage, issues, concerns)
    3. Recommendations (immediate actions, professional inspection needs)
    4. Priority level (Low/Medium/High)
    5. Estimated severity
    
    Be specific, professional, and helpful. Focus on restoration needs.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg'
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing image:', error);
    return getMockImageAnalysis();
  }
};

const getMockImageAnalysis = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const mockAnalyses = [
    `Damage Assessment Report:

Overall Status: Moderate damage detected

Key Findings:
• Visible water damage in multiple areas
• Structural materials showing signs of saturation
• Potential mold growth risk if not addressed quickly
• Some areas may require immediate attention

Recommendations:
• Professional inspection recommended within 24-48 hours
• Begin water extraction and drying process immediately
• Monitor for mold growth in affected areas
• Contact insurance company to start claim process

Priority Level: Medium - Professional assessment needed soon`,

    `Damage Assessment Report:

Overall Status: Significant damage observed

Key Findings:
• Extensive damage visible across multiple areas
• Structural concerns may be present
• Immediate action required to prevent further deterioration
• Safety considerations may apply

Recommendations:
• Immediate professional inspection strongly recommended
• Do not enter unsafe areas until assessed by professionals
• Document all visible damage with photos
• Contact emergency restoration services ASAP

Priority Level: High - Immediate professional assessment needed`,

    `Damage Assessment Report:

Overall Status: Minor to moderate damage

Key Findings:
• Some visible damage but appears contained
• No immediate structural concerns apparent
• Early intervention can prevent escalation
• Restoration process should be straightforward

Recommendations:
• Schedule professional inspection within 3-5 days
• Begin cleanup process to prevent further damage
• Monitor affected areas for changes
• Consider preventive measures

Priority Level: Low to Medium - Professional assessment recommended`
  ];
  
  return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
};

export const getSafeSteps = async (damageType, description) => {
  try {
    const ai = await initGenAI();
    
    // If GenAI is not available or API key is not set, use fallback
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
    'Water Damage': `1. Turn off electricity at the main breaker if water is near electrical outlets
2. Avoid contact with standing water (may contain contaminants)
3. Document damage with photos before cleanup
4. Remove valuable items from affected areas`,

    'Fire Damage': `1. Ensure the fire is completely extinguished before re-entering
2. Do NOT enter if structure appears unstable
3. Ventilate the area by opening windows
4. Avoid touching soot-covered surfaces`,

    'Storm Damage': `1. Stay away from damaged areas until assessed by professionals
2. Check for downed power lines - stay at least 35 feet away
3. Document all visible damage with photos
4. Cover exposed areas with tarps if safe to do so`,

    'Mold Remediation': `1. Avoid breathing in mold spores - limit time in affected area
2. Do NOT use bleach or attempt DIY removal
3. Keep children and pets away from moldy areas
4. Improve ventilation if safe to do so`,

    'Sewage Backup': `1. AVOID CONTACT with sewage water - contains harmful bacteria
2. Turn off HVAC system to prevent spreading contaminants
3. Keep children and pets completely away from affected areas
4. Do NOT use household cleaning products`,

    'Other Emergency': fallbackSteps
  };

  return safetyAdvice[damageType] || fallbackSteps;
};

