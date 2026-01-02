import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Send, RestartAlt, FitnessCenter, Psychology, Restaurant, TrackChanges, Healing } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { chatWithAI } from '../api';

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow: hidden;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.bg} 0%, 
    ${({ theme }) => theme.primary + '08'} 50%,
    ${({ theme }) => theme.bg} 100%);
  @media (max-width: 480px) {
    padding: 12px 0px;
  }
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1000px;
  display: flex;
  gap: 24px;
  padding: 0px 16px;
  height: calc(100vh - 124px);
  
  @media (max-width: 900px) {
    flex-direction: column;
  }
  @media (max-width: 480px) {
    padding: 0px 8px;
    gap: 12px;
    height: calc(100vh - 100px);
  }
`;

const Sidebar = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (max-width: 900px) {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const BotCard = styled.div`
  background: linear-gradient(145deg, 
    ${({ theme }) => theme.primary + '20'} 0%, 
    ${({ theme }) => theme.primary + '05'} 100%);
  border: 1px solid ${({ theme }) => theme.primary + '30'};
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 900px) {
    min-width: 200px;
    padding: 16px;
  }
  @media (max-width: 480px) {
    min-width: 160px;
    padding: 12px;
    gap: 12px;
  }
`;

const BotAvatarLarge = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary || theme.primary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  box-shadow: 0 10px 40px ${({ theme }) => theme.primary + '40'};
  animation: ${float} 3s ease-in-out infinite;
`;

const BotName = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  text-align: center;
`;

const BotTagline = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0;
  text-align: center;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: ${({ theme }) => theme.green + '20'};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.green};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.green};
    border-radius: 50%;
    animation: ${pulse} 2s infinite;
  }
`;

const CapabilityCard = styled.div`
  background: ${({ theme }) => theme.card || theme.bg};
  border: 1px solid ${({ theme }) => theme.text_secondary + '15'};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    border-color: ${({ theme }) => theme.primary + '50'};
    background: ${({ theme }) => theme.primary + '08'};
  }
  
  @media (max-width: 900px) {
    min-width: 180px;
    flex-direction: column;
    text-align: center;
  }
`;

const CapabilityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ color }) => color + '20'};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CapabilityText = styled.div`
  flex: 1;
`;

const CapabilityTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const CapabilityDesc = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 2px;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const ChatSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.card || theme.bg};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.text_secondary + '15'};
  overflow: hidden;
  box-shadow: 0 4px 30px ${({ theme }) => theme.primary + '10'};
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.primary + '10'} 0%, 
    transparent 100%);
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + '10'};
`;

const ChatTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MessageCount = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 400;
`;

const ClearButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary + '30'};
  color: ${({ theme }) => theme.text_secondary};
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.red};
    background: ${({ theme }) => theme.red + '10'};
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.text_secondary + '30'};
    border-radius: 3px;
  }
  @media (max-width: 480px) {
    padding: 12px;
    gap: 16px;
  }
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${({ isUser }) => isUser && `align-items: flex-end;`}
`;

const MessageLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 4px;
`;

const MessageBubble = styled.div`
  max-width: 85%;
  padding: 16px 20px;
  font-size: 14px;
  line-height: 1.7;
  
  ${({ isUser, theme }) => isUser ? `
    background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary || theme.primary});
    color: white;
    border-radius: 20px 20px 4px 20px;
    box-shadow: 0 4px 20px ${theme.primary + '30'};
  ` : `
    background: ${theme.text_secondary + '10'};
    color: ${theme.text_primary};
    border-radius: 20px 20px 20px 4px;
    border: 1px solid ${theme.text_secondary + '15'};
  `}
  @media (max-width: 480px) {
    max-width: 95%;
    padding: 12px 14px;
    font-size: 13px;
  }
`;

const QuickReplies = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 4px;
`;

const QuickReply = styled.button`
  background: ${({ theme }) => theme.primary + '10'};
  border: 1px solid ${({ theme }) => theme.primary + '30'};
  color: ${({ theme }) => theme.primary};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: translateY(-2px);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 16px 20px;
  background: ${({ theme }) => theme.text_secondary + '10'};
  border-radius: 20px 20px 20px 4px;
  width: fit-content;
  
  span {
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.primary};
    border-radius: 50%;
    animation: ${pulse} 1.4s infinite ease-in-out both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
`;

const InputSection = styled.div`
  padding: 20px 24px;
  background: ${({ theme }) => theme.bg};
  border-top: 1px solid ${({ theme }) => theme.text_secondary + '10'};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ theme }) => theme.text_secondary + '08'};
  border: 2px solid ${({ theme }) => theme.text_secondary + '15'};
  border-radius: 16px;
  padding: 4px 4px 4px 20px;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.primary + '15'};
  }
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  padding: 14px 0;
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
  outline: none;
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }
`;

const SendButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary || theme.primary});
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 20px ${({ theme }) => theme.primary + '50'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CAPABILITIES = [
  { icon: FitnessCenter, title: 'Workouts', desc: 'Custom training plans', color: '#007AFF', query: 'Create a workout plan for me' },
  { icon: Psychology, title: 'Form Guide', desc: 'Exercise technique', color: '#FF9500', query: 'How to do a proper push-up?' },
  { icon: Restaurant, title: 'Nutrition', desc: 'Diet & meal planning', color: '#34C759', query: 'What should I eat for muscle gain?' },
  { icon: TrackChanges, title: 'Goals', desc: 'Track progress', color: '#AF52DE', query: 'Best exercises for weight loss' },
  { icon: Healing, title: 'Recovery', desc: 'Rest & recuperation', color: '#FF3B30', query: 'Recovery tips after workout' },
];

const QUICK_REPLIES = [
  "Create a beginner workout",
  "Best exercises for abs",
  "Pre-workout nutrition",
  "How often should I train?"
];

const INITIAL_MESSAGE = {
  id: 1,
  isUser: false,
  content: `Hey! 👋 I'm your AI fitness coach. I'm here to help you crush your fitness goals!

Ask me anything about workouts, nutrition, form, or recovery. What would you like to work on today?`
};

// Simple fitness responses
const getFitBotResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  // PPL (Push Pull Legs) workout
  if (lowerMessage.includes('push pull') || lowerMessage.includes('ppl') || lowerMessage.includes('push/pull')) {
    return `**Push Pull Legs (PPL) Split:**

🔵 **PUSH DAY (Chest, Shoulders, Triceps)**
• Bench Press: 4×8-10
• Overhead Press: 3×10
• Incline Dumbbell Press: 3×12
• Lateral Raises: 3×15
• Tricep Pushdowns: 3×12
• Overhead Tricep Extension: 3×12

🟢 **PULL DAY (Back, Biceps)**
• Deadlifts: 3×5
• Pull-ups/Lat Pulldown: 4×10
• Barbell Rows: 4×10
• Face Pulls: 3×15
• Barbell Curls: 3×12
• Hammer Curls: 3×12

🔴 **LEG DAY (Quads, Hamstrings, Glutes)**
• Squats: 4×8
• Romanian Deadlifts: 3×10
• Leg Press: 3×12
• Leg Curls: 3×12
• Calf Raises: 4×15
• Walking Lunges: 3×10 each

📅 **Schedule Options:**
• 3-day: PPL (rest day between each)
• 6-day: PPLPPL (1 rest day)

💪 Great choice for balanced muscle development!`;
  }
  
  if (lowerMessage.includes('push-up') || lowerMessage.includes('pushup')) {
    return `**Perfect Push-Up Form:**

1. **Start Position** — Hands shoulder-width apart, fingers forward
2. **Body Line** — Straight from head to heels, core tight
3. **Lower Down** — Chest to floor, elbows at 45°
4. **Push Up** — Full arm extension, don't lock elbows

💡 **Pro Tip:** Start with incline push-ups if regular ones are too hard!`;
  }
  
  // Full body workout
  if ((lowerMessage.includes('full body') || lowerMessage.includes('fullbody')) && lowerMessage.includes('workout')) {
    return `**Full Body Workout (3x/week):**

🏋️ **The Workout:**
• Squats: 3×10
• Bench Press: 3×10
• Barbell Rows: 3×10
• Overhead Press: 3×10
• Deadlifts: 2×5
• Planks: 3×30sec

⏱️ **Rest:** 60-90 sec between sets
📅 **Schedule:** Mon-Wed-Fri (48hr recovery)

Perfect for beginners or busy schedules! 💪`;
  }
  
  // Upper/Lower split
  if (lowerMessage.includes('upper lower') || lowerMessage.includes('upper/lower')) {
    return `**Upper/Lower Split (4 days/week):**

🔷 **UPPER A (Mon)**
• Bench Press: 4×8
• Barbell Rows: 4×8
• Overhead Press: 3×10
• Pull-ups: 3×max
• Bicep Curls: 2×12
• Tricep Dips: 2×12

🔶 **LOWER A (Tue)**
• Squats: 4×6
• Romanian Deadlifts: 3×10
• Leg Press: 3×12
• Leg Curls: 3×12
• Calf Raises: 4×15

📅 Upper-Lower-Rest-Upper-Lower-Rest-Rest

Great for intermediate lifters! 🎯`;
  }
  
  if (lowerMessage.includes('beginner') && lowerMessage.includes('workout')) {
    return `**Beginner Workout Plan (3 days/week):**

**Day A — Upper Body**
• Push-ups: 3×10
• Dumbbell Rows: 3×12
• Shoulder Press: 3×10
• Plank: 3×30sec

**Day B — Lower Body**
• Squats: 3×15
• Lunges: 3×10 each leg
• Glute Bridges: 3×15
• Calf Raises: 3×20

Start light, focus on form. Ready to crush it! 💪`;
  }
  
  if (lowerMessage.includes('weight loss') || lowerMessage.includes('lose weight') || lowerMessage.includes('fat')) {
    return `**Fat-Burning Strategy:**

🔥 **Best Exercises:**
• HIIT intervals (20-30 min)
• Strength training (builds metabolism)
• Walking 10k steps daily

🍽️ **Nutrition Keys:**
• Calorie deficit (300-500 cal/day)
• High protein (keeps you full)
• Minimize processed foods

⚡ **Quick HIIT Circuit:**
30 sec each, 4 rounds:
Jumping Jacks → Burpees → Mountain Climbers → High Knees

Consistency beats intensity. You've got this!`;
  }
  
  if (lowerMessage.includes('muscle') || lowerMessage.includes('gain') || lowerMessage.includes('build')) {
    return `**Muscle Building Blueprint:**

🏋️ **Training Principles:**
• Train each muscle 2×/week
• Progressive overload (add weight/reps)
• Focus on compound lifts
• 8-12 rep range for hypertrophy

🥩 **Nutrition:**
• Slight calorie surplus (+300-500)
• Protein: 1.6-2.2g per kg bodyweight
• Don't skip carbs (fuel for gains!)
• Sleep 7-9 hours (recovery is key)

**Key Lifts:** Bench, Squat, Deadlift, Rows, OHP

Patience + consistency = gains! 📈`;
  }
  
  if (lowerMessage.includes('abs') || lowerMessage.includes('core')) {
    return `**Core Crusher Routine:**

🎯 **Best Ab Exercises:**
• Plank variations (front, side)
• Dead Bug: 3×10 each side
• Cable Crunches: 3×15
• Hanging Leg Raises: 3×12
• Ab Wheel Rollouts: 3×10

⚠️ **Truth Bomb:** Abs are made in the kitchen! 
You need low body fat (10-14% for men, 16-20% for women) to see definition.

**The Formula:** Core training + cardio + clean eating = visible abs`;
  }
  
  if (lowerMessage.includes('nutrition') || lowerMessage.includes('eat') || lowerMessage.includes('food') || lowerMessage.includes('diet')) {
    return `**Fitness Nutrition Guide:**

🍳 **Pre-Workout (1-2hrs before):**
Oatmeal + banana, or toast + peanut butter

🥤 **Post-Workout (within 1hr):**
Protein shake + fruit, or chicken + rice

📊 **Daily Targets:**
• Protein: Palm-sized portion each meal
• Carbs: Fist-sized portion
• Veggies: Half your plate
• Water: 2-3 liters

**Quick Meal Prep Ideas:**
• Grilled chicken + quinoa + broccoli
• Greek yogurt + berries + granola
• Eggs + avocado + whole grain toast`;
  }
  
  if (lowerMessage.includes('recovery') || lowerMessage.includes('rest') || lowerMessage.includes('sore')) {
    return `**Recovery Optimization:**

😴 **Sleep (Most Important!)**
• 7-9 hours per night
• Consistent sleep schedule
• Cool, dark room

🧘 **Active Recovery:**
• Light walking or swimming
• Foam rolling (10-15 min)
• Stretching or yoga

🍽️ **Nutrition for Recovery:**
• Protein after workouts
• Anti-inflammatory foods (berries, fish)
• Stay hydrated

⚡ **If Very Sore:**
• Take an extra rest day
• Light stretching only
• Contrast showers (hot/cold)

Remember: Muscles grow during rest, not in the gym!`;
  }
  
  if (lowerMessage.includes('how often') || lowerMessage.includes('frequency')) {
    return `**Training Frequency Guide:**

🔰 **Beginners:** 3 days/week (full body)
💪 **Intermediate:** 4-5 days/week (upper/lower split)
🏆 **Advanced:** 5-6 days/week (PPL or body part split)

**Rest Between Sessions:**
• Same muscle: 48-72 hours
• Different muscles: Can train daily

**Signs You Need Rest:**
• Persistent fatigue
• Strength decreasing
• Poor sleep
• Feeling unmotivated

Quality > Quantity. Listen to your body!`;
  }
  
  return `Great question! Here's what I recommend:

💡 **Key Principles:**
• Start with clear, specific goals
• Progressive overload in training
• Nutrition supports your goals
• Rest is when you actually improve

Would you like me to dive deeper into:
• 🏋️ Workout programming
• 🥗 Nutrition planning
• 📈 Goal setting
• 😴 Recovery strategies

Just ask! I'm here to help you succeed. 🎯`;
};

const AIAssistant = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      isUser: true,
      content: text.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      // Call Gemini AI API
      const response = await chatWithAI(userMessage.content, messages);
      
      const botResponse = {
        id: Date.now() + 1,
        isUser: false,
        content: response.data.message
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.error('AI Chat Error:', err);
      setError('Failed to get response. Please try again.');
      
      // Fallback to local response if API fails
      const botResponse = {
        id: Date.now() + 1,
        isUser: false,
        content: getFitBotResponse(userMessage.content)
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <Container>
      <Wrapper>
        <Sidebar>
          <BotCard>
            <BotAvatarLarge>🤖</BotAvatarLarge>
            <BotName>FitBot AI</BotName>
            <BotTagline>Your Personal Fitness Coach</BotTagline>
            <StatusBadge>Online & Ready</StatusBadge>
          </BotCard>
          
          {CAPABILITIES.map((cap, index) => (
            <CapabilityCard key={index} onClick={() => handleSend(cap.query)}>
              <CapabilityIcon color={cap.color}>
                <cap.icon fontSize="small" />
              </CapabilityIcon>
              <CapabilityText>
                <CapabilityTitle>{cap.title}</CapabilityTitle>
                <CapabilityDesc>{cap.desc}</CapabilityDesc>
              </CapabilityText>
            </CapabilityCard>
          ))}
        </Sidebar>

        <ChatSection>
          <ChatHeader>
            <ChatTitle>
              💬 Chat
              <MessageCount>({messages.length} messages)</MessageCount>
            </ChatTitle>
            <ClearButton onClick={clearChat}>
              <RestartAlt fontSize="small" />
              New Chat
            </ClearButton>
          </ChatHeader>

          <MessagesContainer>
            {messages.map((message) => (
              <MessageGroup key={message.id} isUser={message.isUser}>
                <MessageLabel>{message.isUser ? 'You' : 'FitBot'}</MessageLabel>
                <MessageBubble isUser={message.isUser}>
                  {message.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </MessageBubble>
              </MessageGroup>
            ))}
            
            {isTyping && (
              <MessageGroup isUser={false}>
                <MessageLabel>FitBot</MessageLabel>
                <TypingIndicator>
                  <span></span>
                  <span></span>
                  <span></span>
                </TypingIndicator>
              </MessageGroup>
            )}
            
            {messages.length === 1 && !isTyping && (
              <QuickReplies>
                {QUICK_REPLIES.map((reply, index) => (
                  <QuickReply key={index} onClick={() => handleSend(reply)}>
                    {reply}
                  </QuickReply>
                ))}
              </QuickReplies>
            )}
            
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputSection>
            <InputWrapper>
              <Input
                placeholder="Ask me anything about fitness..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <SendButton onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
                {isTyping ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Send />
                )}
              </SendButton>
            </InputWrapper>
          </InputSection>
        </ChatSection>
      </Wrapper>
    </Container>
  );
};

export default AIAssistant;