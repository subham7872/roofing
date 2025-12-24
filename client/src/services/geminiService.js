// Gemini AI Service for chat functionality

export const askGemini = async (message, isThinking = false) => {
  try {
    // TODO: Replace with actual Gemini API integration
    // For now, return a mock response
    const responses = [
      "I'd be happy to help you with your roofing needs! Could you tell me more about what you're looking for?",
      "That's a great question! Our team specializes in residential and commercial roofing. What specific service are you interested in?",
      "We offer free estimates for all roofing projects. Would you like to schedule an inspection?",
      "Our roofing services include repairs, replacements, and inspections. Which service matches your needs?",
      "We serve Demo City, Demo County, and surrounding areas. Are you located in one of these areas? (This is a demo website)"
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, isThinking ? 2000 : 1000));
    
    // Return a random response for now
    return responses[Math.floor(Math.random() * responses.length)];
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again or call us directly at (555) 000-0000. (Demo Number)";
  }
};

export const analyzeRoofImage = async (base64Image) => {
  try {
    // TODO: Replace with actual Gemini Vision API integration
    // For now, return a mock analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalyses = [
      `Roof Condition Assessment:

Overall Status: Good condition with minor wear observed

Key Findings:
• Shingle condition appears intact with minimal visible damage
• No obvious signs of missing or damaged shingles
• Gutter system appears functional
• Chimney flashing looks secure

Recommendations:
• Schedule a professional inspection within 6-12 months
• Monitor for any signs of leaks during heavy rainfall
• Consider preventive maintenance to extend roof lifespan

Estimated Roof Age: 8-12 years
Priority Level: Low - Routine maintenance recommended`,

      `Roof Condition Assessment:

Overall Status: Moderate wear detected

Key Findings:
• Some shingle granule loss visible
• Minor curling observed on several shingles
• Potential areas of concern around roof edges
• Gutter condition appears adequate

Recommendations:
• Professional inspection recommended within 3-6 months
• Address minor repairs proactively to prevent larger issues
• Consider replacement planning within 2-3 years

Estimated Roof Age: 15-18 years
Priority Level: Medium - Inspection and minor repairs recommended`,

      `Roof Condition Assessment:

Overall Status: Significant wear detected

Key Findings:
• Multiple areas showing shingle deterioration
• Visible signs of potential water damage
• Missing or damaged shingles in several locations
• Flashing may require attention

Recommendations:
• Immediate professional inspection strongly recommended
• Address repairs promptly to prevent interior damage
• Consider full roof replacement evaluation

Estimated Roof Age: 20+ years
Priority Level: High - Professional assessment needed soon`
    ];
    
    return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
  } catch (error) {
    console.error('Error analyzing roof image:', error);
    return "I'm sorry, I'm having trouble analyzing your roof image right now. Please try again or contact us directly at (555) 000-0000 for a professional inspection. (Demo Number)";
  }
};

