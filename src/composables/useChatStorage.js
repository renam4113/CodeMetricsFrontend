import { ref, watch } from 'vue';

/** @typedef {import('@/models/ollama.models.js').OllamaTextRequestDto} OllamaTextRequestDto */

/**
 * @typedef {'user'|'assistant'} ChatRole
 */

/**
 * @typedef {Object} ChatMessage
 * @property {ChatRole} role
 * @property {string} text
 */

/**
 * @typedef {OllamaTextRequestDto} ChatOptions
 */

/**
 * @typedef {Object} FeedbackChat
 * @property {string} id
 * @property {string} title
 * @property {ChatMessage[]} messages
 * @property {ChatOptions} options
 * @property {number} updatedAt
 */

const STORAGE_KEY = 'codeMetrics_feedback_chats';

function loadChats() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveChats(chats) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
}

export function useChatStorage() {
    /** @type {import('vue').Ref<FeedbackChat[]>} */
    const chats = ref(loadChats());
    const activeChatId = ref(chats.value[0]?.id ?? null);

    watch(chats, (value) => saveChats(value), { deep: true });

    /**
     * @param {string} [title]
     * @returns {FeedbackChat}
     */
    function createChat(title = 'Новый чат') {
        const chat = {
            id: `chat_${Date.now()}`,
            title,
            messages: [],
            options: {
                sonarProjectKey: '',
                sonarBranch: '',
                metricsAuthorEmail: '',
                metricsStartDate: '',
                metricsEndDate: ''
            },
            updatedAt: Date.now()
        };
        chats.value.unshift(chat);
        activeChatId.value = chat.id;
        return chat;
    }

    /**
     * @param {string} id
     */
    function deleteChat(id) {
        chats.value = chats.value.filter((c) => c.id !== id);
        if (activeChatId.value === id) {
            activeChatId.value = chats.value[0]?.id ?? null;
        }
        if (!chats.value.length) {
            createChat();
        }
    }

    /**
     * @returns {FeedbackChat|null}
     */
    function getActiveChat() {
        return chats.value.find((c) => c.id === activeChatId.value) || null;
    }

    function ensureChat() {
        if (!chats.value.length) {
            createChat();
        } else if (!activeChatId.value) {
            activeChatId.value = chats.value[0].id;
        }
    }

    ensureChat();

    return {
        chats,
        activeChatId,
        createChat,
        deleteChat,
        getActiveChat,
        ensureChat
    };
}
