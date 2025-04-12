
// Simple response logic to simulate NLP
export const getSimpleResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("sad") || lowerMessage.includes("depressed") || lowerMessage.includes("unhappy")) {
    return "I'm sorry to hear you're feeling down. Remember that it's okay to not be okay sometimes. Would you like to talk about what's been bothering you?";
  } else if (lowerMessage.includes("anxious") || lowerMessage.includes("worried") || lowerMessage.includes("stress")) {
    return "Anxiety can be really challenging. Let's take a deep breath together. In for 4 counts, hold for 4, and out for 4. How do you feel now?";
  } else if (lowerMessage.includes("happy") || lowerMessage.includes("good") || lowerMessage.includes("great")) {
    return "I'm glad to hear you're doing well! It's important to acknowledge positive emotions too. What's something that contributed to your good mood today?";
  } else if (lowerMessage.includes("tired") || lowerMessage.includes("exhausted") || lowerMessage.includes("sleep")) {
    return "Rest is so important for mental health. Have you been having trouble sleeping lately? Sometimes establishing a calming bedtime routine can help.";
  } else if (lowerMessage.includes("thank")) {
    return "You're very welcome. I'm here to support you anytime you need to talk.";
  } else if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
    return "Take care! Remember, I'm here whenever you need someone to talk to.";
  } else if (lowerMessage.includes("help")) {
    return "I'm here to help. You can talk to me about how you're feeling, ask for coping strategies, or just chat. What would be most helpful right now?";
  } else {
    return "Thank you for sharing that with me. How does talking about this make you feel?";
  }
};
