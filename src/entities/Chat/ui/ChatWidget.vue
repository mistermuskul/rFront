<template>
  <div class="chat-widget">
    <q-btn
      round
      color="primary"
      icon="chat"
      class="chat-button"
      @click="showChat = true"
    >
      <q-badge
        v-if="totalUnread > 0"
        color="red"
        floating
        class="unread-badge"
      >
        {{ totalUnread }}
      </q-badge>
    </q-btn>

    <q-dialog
      v-model="showChat"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="chat-dialog">
        <q-card-section class="row items-center q-pb-none chat-header">
          <template v-if="isAdmin && !selectedUser">
            <div class="text-h6">Сообщения</div>
          </template>
          <template v-else>
            <div class="row items-center">
              <q-btn
                v-if="isAdmin"
                icon="arrow_back"
                flat
                round
                dense
                @click="selectedUser = null"
                class="back-button"
              />
              <div class="text-h6">{{ isAdmin ? selectedUser?.name : 'Администратор' }}</div>
            </div>
          </template>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <template v-if="isAdmin && !selectedUser">
          <q-card-section class="users-list">
            <q-list>
              <q-item
                v-for="user in users"
                :key="user.id"
                clickable
                @click="selectUser(user)"
                class="user-item"
              >
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ user.name.charAt(0) }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="user-name">{{ user.name }}</q-item-label>
                  <q-item-label caption class="last-message">
                    {{ getLastMessage(user.id)?.content || 'Нет сообщений' }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="message-info">
                    <span class="message-time">{{ getLastMessageTime(user.id) }}</span>
                    <q-badge
                      v-if="getUnreadForUser(user.id) > 0"
                      color="primary"
                      class="message-badge"
                    >
                      {{ getUnreadForUser(user.id) }}
                    </q-badge>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </template>

        <template v-else>
          <q-card-section class="chat-messages" style="padding: 0; height: 100%; max-height: 100%;">
            <q-scroll-area
              ref="messagesScroll"
              style="height: 100%; max-height: 100%; min-height: 200px;"
              :bar-style="{ background: '#00ffb3' }"
            >
              <div class="column no-wrap">
                <q-chat-message
                  v-for="message in messages"
                  :key="message.id"
                  :name="message.sender.name"
                  :avatar="getAvatarUrl(message.sender.avatar, message.sender.name, message.sender_id)"
                  :text="[message.content]"
                  :style="{
                    textAlign: currentUserId && message.sender_id === currentUserId ? 'right' : 'left',
                    marginLeft: currentUserId && message.sender_id === currentUserId ? 'auto' : '0',
                    marginRight: currentUserId && message.sender_id === currentUserId ? '0' : 'auto',
                    color: currentUserId && message.sender_id === currentUserId ? '#18181f' : '#ffffff',
                    borderRadius: '12px',
                    padding: '12px',
                    margin: '8px'
                  }"
                  :sent="!!(currentUserId && message.sender_id === currentUserId)"
                  :stamp="formatTime(message.created_at)"
                  size="8"
                />
              </div>
            </q-scroll-area>
          </q-card-section>

          <q-card-section class="chat-input">
            <q-input
              v-model="newMessage"
              placeholder="Введите сообщение..."
              outlined
              dense
              @keyup.enter="sendMessage"
            >
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="send"
                  @click="sendMessage"
                  :disable="!newMessage.trim()"
                />
              </template>
            </q-input>
          </q-card-section>
        </template>
      </q-card>
    </q-dialog>
  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useQuasar, QScrollArea } from 'quasar'
import type { Message, User } from '../model/chat.model'
import { chatApi } from '../api/chat.api'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const showChat = ref(false)
const messages = ref<Message[]>([])
const newMessage = ref('')
const unreadCount = ref(0)
const currentUserId = ref<number | null>(null)
const users = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const auth = useAuthStore()
const unreadByUser = ref<Record<number, number>>({})
const messagesScroll = ref<InstanceType<typeof QScrollArea> | null>(null)

const props = defineProps<{
  adminAvatar?: string
}>()

const isAdmin = computed(() => {
  return auth.userRoles.includes('SuperAdmin') || auth.userRoles.includes('Admin')
})

const totalUnread = computed(() => {
  return Object.values(unreadByUser.value).reduce((sum, v) => sum + v, 0)
})

function getLastMessage(userId: number): Message | undefined {
  return messages.value.filter(m => m.sender_id === userId || m.receiver_id === userId).pop()
}

function getLastMessageTime(userId: number): string {
  const lastMessage = getLastMessage(userId)
  if (!lastMessage) return ''
  return formatTime(lastMessage.created_at)
}

async function loadUsers() {
  try {
    const response = await chatApi.getUsers()
    users.value = response.data
    
    if (!isAdmin.value) {
      const admin = users.value.find(user => user.id === 1)
      if (admin) {
        selectedUser.value = admin
        await loadMessages()
      }
    }
  } catch (error) {
    console.error('Error loading users:', error)
    $q.notify({
      type: 'negative',
      message: 'Ошибка загрузки списка пользователей'
    })
  }
}

async function selectUser(user: User) {
  selectedUser.value = user
  await loadMessages()
}

async function loadMessages() {
  if (!selectedUser.value) return

  try {
    const response = await chatApi.getMessages(selectedUser.value.id)
    messages.value = response.data
  } catch (error) {
    console.error('Error loading messages:', error)
    $q.notify({
      type: 'negative',
      message: 'Ошибка загрузки сообщений'
    })
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || !selectedUser.value) return

  const messageContent = newMessage.value
  newMessage.value = ''

  try {
    const response = await chatApi.sendMessage(messageContent, selectedUser.value.id)
    messages.value.push(response.data)
  } catch (error) {
    console.error('Error sending message:', error)
    $q.notify({
      type: 'negative',
      message: 'Ошибка отправки сообщения'
    })
  }
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

async function loadUnreadByUser() {
  try {
    const response = await chatApi.getUnreadByUser()
    unreadByUser.value = response.data
  } catch (error) {
    unreadByUser.value = {}
  }
}

function getUnreadForUser(userId: number): number {
  return unreadByUser.value[userId] || 0
}

watch(showChat, async (newValue: boolean) => {
  if (newValue) {
    await loadUsers()
    if (selectedUser.value) {
      await loadMessages()
    }
    unreadCount.value = 0
    await loadUnreadByUser()
  }
})

watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

onMounted(async () => {
  if (auth.user) {
    currentUserId.value = auth.user.id
  }
  await loadUnreadByUser()
})

onUnmounted(() => {
  // No need to clear interval as scrollToBottom is called on messages change
})

function getAvatarUrl(avatar: string | null | undefined, name: string, userId: number): string {
  if (userId === 1 && props.adminAvatar) {
    return props.adminAvatar
  }
  if (!avatar) return `https://ui-avatars.com/api/?name=${name}&background=random`
  if (avatar.startsWith('http')) return avatar
  return `http://127.0.0.1:8000${avatar}`
}

function scrollToBottom() {
  nextTick(() => {
    const scroll = messagesScroll.value;
    if (scroll) {
      const { verticalSize, verticalContainerSize } = scroll.getScroll();
      scroll.setScrollPosition('vertical', verticalSize - verticalContainerSize);
    }
  });
}
</script>

<style scoped>
.chat-widget {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.chat-button {
  background: linear-gradient(90deg, #00ffb3, #00cfff) !important;
  color: #18181f !important;
  border: none !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(0, 255, 179, 0.3);
}

.chat-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 255, 179, 0.4);
}

.unread-badge {
  font-size: 0.8rem;
  padding: 0.2rem 0.4rem;
}

.chat-dialog {
  position: fixed !important;
  bottom: 5rem !important;
  right: 2rem !important;
  width: 400px;
  height: 600px;
  background: rgba(20, 20, 30, 0.98);
  border: 1px solid #00ffb3;
  border-radius: 12px;
  box-shadow: 0 0 32px 8px rgba(0, 255, 179, 0.2);
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  transform: none !important;
}

.chat-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
}

.users-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.user-item {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s ease;
}

.user-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.user-name {
  color: #fff;
  font-weight: 500;
  font-size: 1rem;
}

.last-message {
  color: #888;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.message-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
}

.message-time {
  color: #888;
  font-size: 0.8rem;
}

.message-badge {
  font-size: 0.8rem;
  padding: 0.2rem 0.4rem;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.chat-input {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px !important;
}

:deep(.q-field__native) {
  color: #fff !important;
}

:deep(.q-field__marginal) {
  color: #00ffb3 !important;
}

:deep(.q-field__control:before) {
  border-color: #00ffb3 !important;
}

:deep(.q-field--focused .q-field__control:after) {
  border-color: #00ffb3 !important;
}

:deep(.q-dialog__backdrop) {
  background: rgba(0, 0, 0, 0.7);
}

:deep(.text-h6) {
  color: #00ffb3;
  font-size: 1.5rem;
  margin: 0;
}

:deep(.q-btn) {
  color: #00ffb3;
}

:deep(.q-btn:hover) {
  color: #fff;
}

@media (max-width: 600px) {
  .chat-dialog {
    width: 100%;
    height: 100%;
    max-height: none;
    border-radius: 0;
    bottom: 0 !important;
    right: 0 !important;
  }

  .chat-messages {
    max-height: calc(100vh - 180px);
  }
}

.back-button {
  margin-right: 8px;
}

.back-button:hover {
  color: #fff !important;
}

:deep(.q-message-text) {
  background: currentColor;
  padding: 8px;
  line-height: 1.2;
  word-break: break-word;
  position: relative;
}

:deep(.q-message-text--sent) {
  background: linear-gradient(135deg, #ffffff 0%, #00ffb3 100%) !important;
  box-shadow: 0 4px 15px rgba(0, 255, 179, 0.2);
  color: #18181f !important;
}

:deep(.q-message-text:not(.q-message-text--sent)) {
  background: linear-gradient(135deg, #00cfff 0%, #ffffff 100%) !important;
  box-shadow: 0 4px 15px rgba(0, 207, 255, 0.2);
  color: #18181f !important;
}

:deep(.q-message-name) {
  color: #888 !important;
  font-size: 0.8rem;
  margin-bottom: 4px;
}

:deep(.q-message-stamp) {
  color: #888 !important;
  font-size: 0.7rem;
  margin-top: 4px;
}
</style> 