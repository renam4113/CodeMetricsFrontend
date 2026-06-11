<template>
    <div class="feedback-page">
        <aside class="chat-sidebar">
            <div class="chat-sidebar__header">
                <button type="button" class="chat-sidebar__new" @click="onNewChat">
                    <i class="pi pi-plus"></i>
                    Новый чат
                </button>
            </div>
            <div class="chat-list">
                <div
                    v-for="chat in chats"
                    :key="chat.id"
                    class="chat-list__item"
                    :class="{ active: chat.id === activeChatId }"
                    @click="activeChatId = chat.id"
                >
                    <span class="chat-list__title">{{ chat.title }}</span>
                    <span class="chat-list__delete" @click.stop="deleteChat(chat.id)">
                        <i class="pi pi-trash"></i>
                    </span>
                </div>
            </div>
        </aside>

        <section class="chat-main" v-if="activeChat">
            <div class="chat-options">
                <label>
                    Проект SonarQube
                    <input v-model="activeChat.options.sonarProjectKey" type="text" placeholder="TestProject" />
                </label>
                <label>
                    Ветка
                    <input v-model="activeChat.options.sonarBranch" type="text" placeholder="main" />
                </label>
                <label>
                    Email метрик
                    <input v-model="activeChat.options.metricsAuthorEmail" type="email" placeholder="dev@example.com" />
                </label>
                <label>
                    Начало периода
                    <input v-model="activeChat.options.metricsStartDate" type="datetime-local" />
                </label>
                <label>
                    Конец периода
                    <input v-model="activeChat.options.metricsEndDate" type="datetime-local" />
                </label>
            </div>

            <div class="chat-messages" ref="messagesEl">
                <div v-if="!activeChat.messages.length" class="chat-empty">
                    Задайте вопрос по метрикам, SonarQube или качеству кода
                </div>
                <div
                    v-for="(msg, idx) in activeChat.messages"
                    :key="idx"
                    class="chat-bubble"
                    :class="msg.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--assistant'"
                >
                    {{ msg.text }}
                </div>
                <div v-if="isSending" class="chat-bubble chat-bubble--assistant chat-bubble--loading">
                    Думаю…
                </div>
            </div>

            <div class="chat-input-bar">
                <form class="chat-input-wrap" @submit.prevent="sendMessage">
                    <textarea
                        v-model="draft"
                        rows="1"
                        placeholder="Сообщение…"
                        @keydown.enter.exact.prevent="sendMessage"
                    />
                    <button type="submit" class="chat-send-btn" :disabled="isSending || !draft.trim()">
                        <i class="pi pi-send"></i>
                    </button>
                </form>
            </div>
        </section>
    </div>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue';
import { Api } from '@/services';
import { useChatStorage } from '@/composables/useChatStorage';

export default {
    name: 'PageFeedback',
    setup() {
        const { chats, activeChatId, createChat, deleteChat, getActiveChat } = useChatStorage();
        const draft = ref('');
        const isSending = ref(false);
        const messagesEl = ref(null);

        const activeChat = computed(() => getActiveChat());

        const onNewChat = () => {
            createChat(`Чат ${chats.value.length + 1}`);
            draft.value = '';
        };

        const scrollToBottom = async () => {
            await nextTick();
            if (messagesEl.value) {
                messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
            }
        };

        watch(
            () => activeChat.value?.messages.length,
            () => scrollToBottom()
        );

        const buildPayload = (text) => {
            const opts = activeChat.value.options;
            const payload = { text };
            if (opts.sonarProjectKey?.trim()) payload.sonarProjectKey = opts.sonarProjectKey.trim();
            if (opts.sonarBranch?.trim()) payload.sonarBranch = opts.sonarBranch.trim();
            if (opts.metricsAuthorEmail?.trim()) payload.metricsAuthorEmail = opts.metricsAuthorEmail.trim();
            if (opts.metricsStartDate) payload.metricsStartDate = new Date(opts.metricsStartDate).toISOString();
            if (opts.metricsEndDate) payload.metricsEndDate = new Date(opts.metricsEndDate).toISOString();
            return payload;
        };

        const sendMessage = async () => {
            const text = draft.value.trim();
            if (!text || !activeChat.value || isSending.value) return;

            activeChat.value.messages.push({ role: 'user', text });
            if (activeChat.value.title.startsWith('Новый чат') || activeChat.value.title.startsWith('Чат ')) {
                activeChat.value.title = text.slice(0, 40) + (text.length > 40 ? '…' : '');
            }
            draft.value = '';
            activeChat.value.updatedAt = Date.now();
            isSending.value = true;
            await scrollToBottom();

            try {
                const response = await Api.ask(buildPayload(text));
                const answer = response.text ?? 'Пустой ответ';
                activeChat.value.messages.push({ role: 'assistant', text: answer });
            } catch (error) {
                activeChat.value.messages.push({
                    role: 'assistant',
                    text: `Ошибка: ${error.message}`
                });
            } finally {
                isSending.value = false;
                activeChat.value.updatedAt = Date.now();
                await scrollToBottom();
            }
        };

        return {
            chats,
            activeChatId,
            activeChat,
            draft,
            isSending,
            messagesEl,
            onNewChat,
            deleteChat,
            sendMessage
        };
    }
};
</script>
