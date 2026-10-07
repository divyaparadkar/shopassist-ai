// NLP Engine for Intent Classification and Keyword Matching

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'am', 'be', 'do', 'does', 'did', 'for', 'to',
  'in', 'on', 'at', 'with', 'by', 'of', 'and', 'or', 'so', 'if', 'it', 'its',
  'my', 'your', 'me', 'you', 'we', 'i', 'this', 'that', 'these', 'those'
]);

// Simple Stemmer for matching common variations
function stem(word) {
  if (!word) return '';
  let w = word.toLowerCase();
  if (w.length <= 3) return w;

  if (w.endsWith('ing')) w = w.slice(0, -3);
  else if (w.endsWith('ed')) w = w.slice(0, -2);
  else if (w.endsWith('es')) w = w.slice(0, -2);
  else if (w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  else if (w.endsWith('ment')) w = w.slice(0, -4);
  else if (w.endsWith('ation')) w = w.replace(/ation$/, 'ate');
  
  return w;
}

export function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0);
}

export function extractOrderId(text) {
  if (!text) return null;
  // Match patterns like ORD-1024, ORD-8821, #123456, 123456, ORD1024
  const ordMatch = text.match(/\b(ORD-?\d{4,6}|\d{6}|#\d{6})\b/i);
  if (ordMatch) {
    let clean = ordMatch[0].toUpperCase().replace('#', '');
    if (/^\d{6}$/.test(clean)) {
      return clean;
    }
    if (!clean.includes('-') && clean.startsWith('ORD')) {
      return clean.replace('ORD', 'ORD-');
    }
    return clean;
  }
  return null;
}

// Calculate similarity between two strings (0.0 to 1.0)
function calculateStringSimilarity(str1, str2) {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.85;

  const tokens1 = tokenize(s1).map(stem);
  const tokens2 = tokenize(s2).map(stem);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  let matches = 0;
  const set2 = new Set(tokens2);
  tokens1.forEach(t => {
    if (set2.has(t)) matches++;
  });

  const jaccard = matches / (new Set([...tokens1, ...tokens2]).size || 1);
  return jaccard;
}

/**
 * Predict Intent from user input given an array of intents
 * @param {string} userInput 
 * @param {Array} intentsList 
 * @param {string} currentContext 
 */
export function classifyIntent(userInput, intentsList, currentContext = "") {
  if (!userInput || !userInput.trim()) {
    return {
      intent: null,
      confidence: 0,
      matchedPattern: null,
      response: "Please enter a message.",
      context_set: "",
      scores: []
    };
  }

  const rawInput = userInput.trim();
  const detectedOrderId = extractOrderId(rawInput);

  // If user is in awaiting_order_id context or provided an order ID directly
  if (detectedOrderId) {
    // If context is awaiting_order_id or explicit mention of order/cancel
    const isCancelPrompt = /cancel|stop|wrong item|revoke/i.test(rawInput) || currentContext === 'awaiting_cancel';
    const tag = isCancelPrompt ? 'cancel_order' : 'order_status';
    const matchingIntent = intentsList.find(i => i.tag === tag) || intentsList.find(i => i.tag === 'order_status');

    return {
      intent: matchingIntent ? matchingIntent.tag : 'order_status',
      confidence: 0.98,
      matchedPattern: detectedOrderId,
      orderId: detectedOrderId,
      response: matchingIntent?.responses[0] || `Looking up Order ID ${detectedOrderId}...`,
      context_set: '',
      scores: [{ tag: matchingIntent?.tag || 'order_status', score: 0.98 }]
    };
  }

  // Score all intents
  const scores = intentsList.map(intent => {
    let maxPatternScore = 0;
    let bestPattern = "";

    intent.patterns.forEach(pattern => {
      const sim = calculateStringSimilarity(rawInput, pattern);
      if (sim > maxPatternScore) {
        maxPatternScore = sim;
        bestPattern = pattern;
      }
    });

    // Context boost if previous context matches
    if (currentContext && intent.context_set === currentContext) {
      maxPatternScore += 0.15;
    }

    return {
      tag: intent.tag,
      intent,
      score: Math.min(maxPatternScore, 1.0),
      bestPattern
    };
  });

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  const topMatch = scores[0];
  const threshold = 0.22; // minimum confidence threshold

  if (topMatch && topMatch.score >= threshold) {
    const selectedIntent = topMatch.intent;
    const responses = selectedIntent.responses;
    const chosenResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      intent: selectedIntent.tag,
      confidence: Math.round(topMatch.score * 100) / 100,
      matchedPattern: topMatch.bestPattern,
      response: chosenResponse,
      context_set: selectedIntent.context_set || "",
      scores: scores.map(s => ({ tag: s.tag, score: Math.round(s.score * 100) / 100 }))
    };
  }

  // Fallback if no intent matched confidence threshold
  return {
    intent: "fallback",
    confidence: 0.05,
    matchedPattern: null,
    response: "I'm sorry, I didn't quite understand that. You can ask me about tracking orders, cancellations, returns, shipping, or speaking with a live agent!",
    context_set: "",
    scores: scores.slice(0, 3).map(s => ({ tag: s.tag, score: Math.round(s.score * 100) / 100 }))
  };
}
