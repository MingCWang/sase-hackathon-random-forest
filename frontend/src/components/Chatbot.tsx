import { useState } from 'react';
import styles from './Chatbot.module.css';
import { FaGraduationCap } from 'react-icons/fa';
import { BsPersonFill } from 'react-icons/bs';


export default function Chatbot() {
    const [messages, setMessages] = useState([{role: "assistant", content: "How would you like me to respond? (e.g., friendly, professional, empathetic)"}]);
    const [userInput, setUserInput] = useState('');
    const [showBot, setShowBot] = useState(false);
    const [interactionStep, setInteractionStep] = useState(0);

    const categories = {
        0: "Classesy", 
        1: "Dorm Life", 
        2: "Jobs/Internships", 
        3: "Family", 
        4: "Social", 
    }

    function getClosestCategory(userMessage) {
        const lowercasedMessage = userMessage.toLowerCase();
        let closestCategoryKey = null;
        let highestMatchCount = 0;

        for (let key in categories) {
            const category = categories[key].toLowerCase();
            const matchCount = category.split(' ').filter(word => lowercasedMessage.includes(word)).length;
            if (matchCount > highestMatchCount) {
                highestMatchCount = matchCount;
                closestCategoryKey = key;
            }
        }
        console.log(categories[closestCategoryKey]);
        return categories[closestCategoryKey];
    }

    const sendToOpenAI = async (userMessage) => {
      let payload;
      switch (interactionStep) {
          case 0: // Priming the model
          payload = {
              model: "gpt-3.5-turbo",
              messages: [
                  ...messages, 
                  {role: "user", content: userMessage},
              ],
              max_tokens: 150, // increase this to ensure complete output
              temperature: 0.8
          };
          break;
    
  
          case 1: // Getting the user's concern and suggesting a category
            const categoriesList = Object.values(categories).join(", "); // Convert categories to a string list
            payload = {
                model: "gpt-3.5-turbo",
                messages: [
                    ...messages,
                    {role: "user", content: `Out of these categories: ${categoriesList}, which one most fits my problems: ${userMessage}?`}
                ],
                max_tokens: 150,
                temperature: 0.7
            };
            break;
      
          case 2: // Handling further interaction if any
              payload = {
                  model: "gpt-3.5-turbo",
                  messages: [
                      ...messages, {role: "user", content: userMessage}
                  ],
                  max_tokens: 50,
                  temperature: 0.8
              };
              break;
  
          default:
              console.error("Unexpected interaction step:", interactionStep);
              return;
      }

        const apiEndpoint = "https://api.openai.com/v1/chat/completions";
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${(import.meta.env.VITE_OPENAI_API_KEY as string)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    
        const data = await response.json();
    
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
          let assistantMessage = data.choices[0].message.content;
          if (interactionStep === 0) {
              assistantMessage += " What are you concerned with?";
              setInteractionStep(1); // Transition to the next step
          } else if (interactionStep === 1) {
              assistantMessage = `Based on your input, I suggest you visit the TreeHouse "${assistantMessage}". However, I'm here to help with any other concerns you have :)`;
              setInteractionStep(2);
          }
          setMessages(messages => [...messages, {role: "user", content: userMessage}, {role: "assistant", content: assistantMessage}]);
          } else {
              console.error("Unexpected response format from OpenAI API:", data);
          }
      
      
      
    };

        const handleUserSubmit = (e: { preventDefault: () => void; }) => {
            e.preventDefault();
            sendToOpenAI(userInput);
            setUserInput(''); 
    };

    return (
        <div className={styles.chatbotContainer}>
          {showBot ? (
            <div className={styles.chatWindow}>

            <div className={styles.chatHeader}>
                <div className={styles.centerText}>What are your concerns?</div>
                <div className={styles.closeButtonContainer}>
                    <button className={styles.closeButton} onClick={() => setShowBot(false)}>X</button>
                </div>
            </div>

            <div className={styles.chatMessages}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                  {msg.role === 'user' ? (
                    <>
                      <h2>
                        <BsPersonFill className="custom-icon" />
                      </h2>
                      <span>{msg.content}</span>
                    </>
                  ) : (
                    <>
                      <h2>
                        <FaGraduationCap className="custom-icon" />
                      </h2>
                      <span>{msg.content}</span>
                    </>
                  )}
                </div>
              ))}
            </div>


            <form className={styles.chatInput} onSubmit={handleUserSubmit}>
            <input
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Type your message..."
            />
            <button className={styles.sendButton} type="submit">Send</button>
            </form>

            </div>
          ) : (
          <button className={styles.chatToggle} onClick={() => setShowBot(true)}>
            Chat with us
          </button>
          )}
        </div>
      );
}