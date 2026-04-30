/**
 * AiNpc.js - Reusable AI-powered NPC conversation system
 */

import DialogueSystem from './DialogueSystem.js';
import { pythonURI, fetchOptions } from '../../api/config.js';

class AiNpc {
    /**
     * Main entry point - Shows full AI interaction dialog for an NPC
     */
    static showInteraction(npcInstance) {
        const npc = npcInstance;
        const data = npc.spriteData;

        if (npc.dialogueSystem?.isDialogueOpen()) {
            npc.dialogueSystem.closeDialogue();
        }

        if (!npc.dialogueSystem) {
            npc.dialogueSystem = new DialogueSystem({
                dialogues: data.dialogues || [data.greeting || "Hello!"],
                gameControl: npc.gameControl
            });
        }

        npc.dialogueSystem.showRandomDialogue(data.id, data.src, data);

        const ui = AiNpc.createChatUI(data);
        AiNpc.attachEventHandlers(npc, data, ui);
        AiNpc.attachToDialogue(npc.dialogueSystem, ui.container);
    }

    static createChatUI(spriteData) {
        const container = document.createElement('div');
        container.className = 'ai-npc-container';

        const inputField = document.createElement('textarea');
        inputField.className = 'ai-npc-input';
        
        let placeholder = `Ask about ${spriteData.expertise}...`;
        const topics = spriteData.knowledgeBase?.[spriteData.expertise] || [];
        if (topics.length > 0) {
            const randomTopic = topics[Math.floor(Math.random() * topics.length)];
            placeholder = randomTopic.question;
        }
        inputField.placeholder = placeholder;
        inputField.rows = 2;

        const buttonRow = document.createElement('div');
        buttonRow.className = 'ai-npc-button-row';

        const historyBtn = document.createElement('button');
        historyBtn.textContent = '📋 Chat History';
        historyBtn.className = 'ai-npc-history-btn';

        const responseArea = document.createElement('div');
        responseArea.className = 'ai-npc-response-area';
        responseArea.style.display = 'none';

        buttonRow.appendChild(historyBtn);
        container.appendChild(inputField);
        container.appendChild(buttonRow);
        container.appendChild(responseArea);

        return { container, inputField, historyBtn, responseArea };
    }

    static attachEventHandlers(npcInstance, spriteData, ui) {
        const { inputField, historyBtn, responseArea } = ui;

        historyBtn.onclick = () => AiNpc.showChatHistory(spriteData);

        const sendMessage = async () => {
            const userMessage = inputField.value.trim();
            if (!userMessage) return;
            inputField.value = '';

            // --- LOCAL BRAIN OVERRIDE ---
            // If the NPC (like the Wolf) has a handleResponse function, use it!
            if (npcInstance && typeof npcInstance.handleResponse === 'function') {
                const localReply = npcInstance.handleResponse(userMessage);
                spriteData.chatHistory.push({ role: 'user', message: userMessage });
                spriteData.chatHistory.push({ role: 'ai', message: localReply });
                AiNpc.showResponse(localReply, responseArea);
                return; // Stop here! Don't call the broken server.
            }

            await AiNpc.sendPromptToBackend(spriteData, userMessage, responseArea);
        };

        AiNpc.preventGameInput(inputField);

        inputField.onkeypress = e => {
            e.stopPropagation();
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        };

        setTimeout(() => inputField.focus(), 100);
    }

    static attachToDialogue(dialogueSystem, container) {
        const dialogueBox = document.getElementById('custom-dialogue-box-' + dialogueSystem.safeId);
        if (dialogueBox) {
            const existingContainers = dialogueBox.querySelectorAll('.ai-npc-container');
            existingContainers.forEach(existing => existing.remove());
            
            const closeBtn = document.getElementById('dialogue-close-btn-' + dialogueSystem.safeId);
            if (closeBtn && closeBtn.parentNode === dialogueBox) {
                dialogueBox.insertBefore(container, closeBtn);
            } else {
                dialogueBox.appendChild(container);
            }
        }
    }

    static async sendPromptToBackend(spriteData, userMessage, responseArea) {
        spriteData.chatHistory.push({ role: 'user', message: userMessage });
        responseArea.textContent = 'Thinking...';
        responseArea.style.display = 'block';

        try {
            const pythonURL = pythonURI + '/api/ainpc/prompt';
            const response = await fetch(pythonURL, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({
                    prompt: userMessage,
                    npc_type: spriteData.expertise,
                    expertise: spriteData.expertise
                })
            });

            const data = await response.json();
            const aiResponse = data?.response || "I'm not sure how to answer that yet.";
            spriteData.chatHistory.push({ role: 'ai', message: aiResponse });
            AiNpc.showResponse(aiResponse, responseArea);
        } catch (err) {
            AiNpc.showResponse("I'm having trouble reaching my brain right now.", responseArea);
        }
    }

    static showResponse(text, element, speed = 30) {
        element.textContent = '';
        element.style.display = 'block';
        let index = 0;
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index++);
                setTimeout(type, speed);
            }
        };
        type();
    }

    static preventGameInput(element) {
        ['keydown', 'keyup', 'keypress'].forEach(eventType => {
            element.addEventListener(eventType, e => e.stopPropagation());
        });
    }

    static showChatHistory(spriteData) {
        const modal = document.createElement('div');
        modal.className = 'ai-npc-modal';
        const title = document.createElement('h3');
        title.textContent = 'Chat History';
        modal.appendChild(title);

        spriteData.chatHistory.forEach(msg => {
            const div = document.createElement('div');
            div.className = msg.role === 'user' ? 'user-message' : 'ai-message';
            div.textContent = msg.message;
            modal.appendChild(div);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.onclick = () => modal.remove();
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
    }
}

export default AiNpc;