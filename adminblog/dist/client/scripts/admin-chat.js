// Admin Chat System - Real-time chat management with GPT-5 integration
class AdminChatSystem {
  constructor() {
    this.ws = null;
    this.currentUser = null;
    this.currentSessionId = null;
    this.adminName = 'Admin'; // This should come from the logged-in admin
    this.isConnected = false;
    this.adminAvailable = false;
    this.gptService = null;
    
    this.initializeElements();
    this.initializeWebSocket();
    this.loadInitialData();
    this.setupEventListeners();
  }

  initializeElements() {
    // Main elements
    this.adminAvailabilityToggle = document.getElementById('adminAvailabilityToggle');
    this.adminStatusIndicator = document.getElementById('adminStatusIndicator');
    this.gptStatusIndicator = document.getElementById('gptStatusIndicator');
    this.searchConversations = document.getElementById('searchConversations');
    this.conversationsContainer = document.getElementById('conversationsContainer');
    this.chatHeader = document.getElementById('chatHeader');
    this.messagesContainer = document.getElementById('messagesContainer');
    this.messageInput = document.getElementById('messageInput');
    this.sendButton = document.getElementById('sendButton');
    this.gptResponseBtn = document.getElementById('gptResponseBtn');
    this.typingIndicator = document.getElementById('typingIndicator');
    this.notificationToast = document.getElementById('notificationToast');
    
    // GPT suggestion panel
    this.gptSuggestionPanel = document.getElementById('gptSuggestionPanel');
    this.gptSuggestionText = document.getElementById('gptSuggestionText');
    this.approveGptBtn = document.getElementById('approveGptBtn');
    this.editGptBtn = document.getElementById('editGptBtn');
    this.rejectGptBtn = document.getElementById('rejectGptBtn');
    
    // Emoji and attachment buttons
    this.emojiPickerBtn = document.getElementById('emojiPickerBtn');
    this.attachmentBtn = document.getElementById('attachmentBtn');
    this.imageBtn = document.getElementById('imageBtn');
  }

  async initializeWebSocket() {
    try {
      // Check if WebSocket is supported
      if (!window.WebSocket) {
        throw new Error('WebSocket not supported');
      }

      // Connect to WebSocket server
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/chat`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.isConnected = true;
        this.registerAdmin();
        this.updateConnectionStatus(true);
      };

      this.ws.onmessage = (event) => {
        this.handleWebSocketMessage(JSON.parse(event.data));
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.isConnected = false;
        this.updateConnectionStatus(false);
        
        // Try to reconnect after 5 seconds
        setTimeout(() => {
          if (!this.isConnected) {
            this.initializeWebSocket();
          }
        }, 5000);
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.updateConnectionStatus(false);
      };

    } catch (error) {
      console.error('❌ Failed to initialize WebSocket:', error);
      this.showNotification('Erreur de connexion WebSocket', 'error');
    }
  }

  registerAdmin() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'register_admin',
        data: {
          adminId: Date.now(), // Simple ID for demo
          name: this.adminName
        }
      }));
    }
  }

  handleWebSocketMessage(message) {
    console.log('📨 WebSocket message received:', message);
    
    switch (message.type) {
      case 'connection_established':
        console.log('✅ WebSocket connection established');
        break;
        
      case 'admin_registered':
        console.log('👨‍💼 Admin registered successfully');
        break;
        
      case 'admin_status_update':
        this.updateAdminStatus(message.available);
        break;
        
      case 'new_user_message':
        this.handleNewUserMessage(message);
        break;
        
      case 'user_typing':
        this.showTypingIndicator(message.sessionId, true);
        break;
        
      case 'user_stopped_typing':
        this.showTypingIndicator(message.sessionId, false);
        break;
        
      case 'user_connected':
        this.handleUserConnected(message);
        break;
        
      case 'user_disconnected':
        this.handleUserDisconnected(message);
        break;
        
      case 'gpt_auto_response':
        this.handleGPTAutoResponse(message);
        break;
        
      case 'gpt_response_sent':
        this.handleGPTResponseSent(message);
        break;
        
      case 'admin_message_sent':
        this.handleAdminMessageSent(message);
        break;
        
      default:
        console.warn('⚠️ Unknown message type:', message.type);
    }
  }

  async loadInitialData() {
    try {
      // Load admin status
      const statusResponse = await fetch('/api/admin/chat?action=status');
      const statusData = await statusResponse.json();
      this.updateAdminStatus(statusData.available);
      
      // Load conversations
      await this.loadConversations();
      
      // Test GPT-5 service
      this.testGPTService();
      
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
    }
  }

  async loadConversations() {
    try {
      const response = await fetch('/api/admin/chat?action=conversations');
      const conversations = await response.json();
      this.renderConversations(conversations);
    } catch (error) {
      console.error('❌ Error loading conversations:', error);
    }
  }

  renderConversations(conversations) {
    if (!conversations || conversations.length === 0) {
      this.conversationsContainer.innerHTML = `
        <div class="p-4 text-center text-gray-500 dark:text-gray-400">
          Aucune conversation active
        </div>
      `;
      return;
    }

    this.conversationsContainer.innerHTML = conversations.map(conv => `
      <div class="conversation-item p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors" 
           data-user-id="${conv.id}" 
           data-session-id="${conv.session_id}">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
              ${conv.name || 'Anonyme'}
            </h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              ${conv.email || 'Aucun email'}
            </p>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              ${this.formatTimestamp(conv.last_message_at)}
            </span>
            <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
              ${conv.message_count}
            </span>
          </div>
        </div>
      </div>
    `).join('');

    // Add click event listeners
    this.conversationsContainer.querySelectorAll('.conversation-item').forEach(item => {
      item.addEventListener('click', () => {
        const userId = item.dataset.userId;
        const sessionId = item.dataset.sessionId;
        this.selectConversation(userId, sessionId);
      });
    });
  }

  async selectConversation(userId, sessionId) {
    try {
      this.currentUser = { id: userId, sessionId };
      this.currentSessionId = sessionId;
      
      // Update UI
      this.updateChatHeader();
      this.enableChatInput();
      
      // Load messages
      const response = await fetch(`/api/admin/chat?action=messages&user_id=${userId}`);
      const messages = await response.json();
      this.renderMessages(messages);
      
      // Highlight selected conversation
      this.conversationsContainer.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
        if (item.dataset.userId === userId) {
          item.classList.add('bg-blue-50', 'dark:bg-blue-900/20');
        }
      });
      
    } catch (error) {
      console.error('❌ Error selecting conversation:', error);
    }
  }

  updateChatHeader() {
    if (!this.currentUser) return;
    
    // Find the conversation item to get user info
    const conversationItem = this.conversationsContainer.querySelector(`[data-user-id="${this.currentUser.id}"]`);
    if (conversationItem) {
      const userName = conversationItem.querySelector('h4').textContent;
      const userEmail = conversationItem.querySelector('p').textContent;
      
      document.getElementById('currentUserName').textContent = userName;
      document.getElementById('currentUserInfo').textContent = userEmail;
    }
  }

  enableChatInput() {
    this.messageInput.disabled = false;
    this.sendButton.disabled = false;
    this.gptResponseBtn.disabled = false;
  }

  renderMessages(messages) {
    if (!messages || messages.length === 0) {
      this.messagesContainer.innerHTML = `
        <div class="text-center text-gray-500 dark:text-gray-400 py-8">
          Aucun message dans cette conversation
        </div>
      `;
      return;
    }

    this.messagesContainer.innerHTML = messages.map(message => this.renderMessage(message)).join('');
    this.scrollToBottom();
  }

  renderMessage(message) {
    const isUser = message.sender === 'user';
    const isAdmin = message.sender === 'admin';
    const isGPT = message.sender === 'gpt';
    
    const senderClass = isUser ? 'bg-blue-100 dark:bg-blue-900/20' : 
                       isAdmin ? 'bg-green-100 dark:bg-green-900/20' : 
                       'bg-gray-100 dark:bg-gray-700';
    
    const senderName = isUser ? 'Utilisateur' : 
                      isAdmin ? 'Admin' : 
                      'GPT-5';
    
    const timestamp = this.formatTimestamp(message.timestamp);
    
    return `
      <div class="message-item ${isUser ? 'text-right' : 'text-left'}">
        <div class="inline-block max-w-xs lg:max-w-md">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
            ${senderName} • ${timestamp}
          </div>
          <div class="px-4 py-2 rounded-lg ${senderClass} text-gray-900 dark:text-white">
            ${this.escapeHtml(message.message)}
            ${message.has_attachment ? this.renderAttachment(message) : ''}
          </div>
        </div>
      </div>
    `;
  }

  renderAttachment(message) {
    if (message.attachment_type && message.attachment_type.startsWith('image/')) {
      return `<img src="${message.attachment_url}" alt="Image" class="mt-2 max-w-full rounded">`;
    }
    return `<div class="mt-2 text-sm text-blue-600 dark:text-blue-400">📎 Pièce jointe</div>`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async sendMessage() {
    if (!this.currentUser || !this.messageInput.value.trim()) return;
    
    const message = this.messageInput.value.trim();
    this.messageInput.value = '';
    
    try {
      // Send via WebSocket if connected
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'send_message',
          data: {
            user_id: this.currentUser.id,
            message: message,
            session_id: this.currentUser.sessionId,
            admin_name: this.adminName
          }
        }));
      } else {
        // Fallback to HTTP API
        const response = await fetch('/api/admin/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'send_message',
            user_id: this.currentUser.id,
            message: message,
            session_id: this.currentUser.sessionId,
            admin_name: this.adminName
          })
        });
        
        if (!response.ok) throw new Error('Failed to send message');
      }
      
      // Add message to UI immediately
      this.addMessageToUI({
        id: Date.now(),
        message: message,
        sender: 'admin',
        timestamp: new Date().toISOString(),
        adminName: this.adminName
      });
      
    } catch (error) {
      console.error('❌ Error sending message:', error);
      this.showNotification('Erreur lors de l\'envoi du message', 'error');
    }
  }

  addMessageToUI(message) {
    const messageHtml = this.renderMessage(message);
    this.messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  async generateGPTResponse() {
    if (!this.currentUser || !this.gptService) return;
    
    try {
      // Get the last user message
      const messages = Array.from(this.messagesContainer.querySelectorAll('.message-item'));
      const lastUserMessage = messages.reverse().find(msg => 
        msg.querySelector('.bg-blue-100, .dark\\:bg-blue-900\\/20')
      );
      
      if (!lastUserMessage) {
        this.showNotification('Aucun message utilisateur trouvé', 'warning');
        return;
      }
      
      const userMessageText = lastUserMessage.querySelector('.px-4.py-2').textContent;
      
      // Generate GPT response
      const gptResponse = await this.gptService.generateChatResponse(userMessageText);
      
      // Show suggestion panel
      this.gptSuggestionText.value = gptResponse;
      this.gptSuggestionPanel.classList.remove('hidden');
      
    } catch (error) {
      console.error('❌ Error generating GPT response:', error);
      this.showNotification('Erreur lors de la génération de la réponse GPT', 'error');
    }
  }

  async approveGPTResponse() {
    if (!this.currentUser) return;
    
    const message = this.gptSuggestionText.value.trim();
    if (!message) return;
    
    try {
      // Send via WebSocket if connected
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'approve_gpt_response',
          data: {
            userId: this.currentUser.id,
            message: message,
            sessionId: this.currentUser.sessionId,
            originalMessage: ''
          }
        }));
      } else {
        // Fallback to HTTP API
        const response = await fetch('/api/admin/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'approve_gpt',
            user_id: this.currentUser.id,
            message: message,
            session_id: this.currentUser.sessionId,
            original_message: ''
          })
        });
        
        if (!response.ok) throw new Error('Failed to approve GPT response');
      }
      
      // Hide suggestion panel
      this.gptSuggestionPanel.classList.add('hidden');
      
      // Add message to UI
      this.addMessageToUI({
        id: Date.now(),
        message: message,
        sender: 'gpt',
        timestamp: new Date().toISOString(),
        intercepted: true
      });
      
    } catch (error) {
      console.error('❌ Error approving GPT response:', error);
      this.showNotification('Erreur lors de l\'approbation de la réponse GPT', 'error');
    }
  }

  editGPTResponse() {
    // The textarea is already editable, just focus it
    this.gptSuggestionText.focus();
  }

  rejectGPTResponse() {
    // Hide suggestion panel
    this.gptSuggestionPanel.classList.add('hidden');
    this.gptSuggestionText.value = '';
  }

  async updateAdminAvailability(available) {
    try {
      const response = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'availability',
          available: available
        })
      });
      
      if (!response.ok) throw new Error('Failed to update availability');
      
      this.adminAvailable = available;
      this.updateAdminStatus(available);
      
      // Send via WebSocket if connected
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'admin_availability',
          data: { available: available }
        }));
      }
      
    } catch (error) {
      console.error('❌ Error updating admin availability:', error);
      this.showNotification('Erreur lors de la mise à jour de la disponibilité', 'error');
    }
  }

  updateAdminStatus(available) {
    this.adminAvailable = available;
    this.adminAvailabilityToggle.checked = available;
    
    if (available) {
      this.adminStatusIndicator.className = 'w-3 h-3 bg-green-500 rounded-full';
      this.adminStatusIndicator.nextElementSibling.textContent = 'Admin: En ligne';
    } else {
      this.adminStatusIndicator.className = 'w-3 h-3 bg-red-500 rounded-full';
      this.adminStatusIndicator.nextElementSibling.textContent = 'Admin: Hors ligne';
    }
  }

  updateConnectionStatus(connected) {
    if (connected) {
      this.gptStatusIndicator.className = 'w-3 h-3 bg-green-500 rounded-full';
      this.gptStatusIndicator.nextElementSibling.textContent = 'GPT-5: Connecté';
    } else {
      this.gptStatusIndicator.className = 'w-3 h-3 bg-red-500 rounded-full';
      this.gptStatusIndicator.nextElementSibling.textContent = 'GPT-5: Déconnecté';
    }
  }

  async testGPTService() {
    try {
      if (window.GPT5Service) {
        this.gptService = new window.GPT5Service();
        const isValid = await this.gptService.testApiKey();
        
        if (isValid) {
          this.gptStatusIndicator.className = 'w-3 h-3 bg-green-500 rounded-full';
          this.gptStatusIndicator.nextElementSibling.textContent = 'GPT-5: Prêt';
        } else {
          this.gptStatusIndicator.className = 'w-3 h-3 bg-red-500 rounded-full';
          this.gptStatusIndicator.nextElementSibling.textContent = 'GPT-5: Erreur API';
        }
      } else {
        this.gptStatusIndicator.className = 'w-3 h-3 bg-yellow-500 rounded-full';
        this.gptStatusIndicator.nextElementSibling.textContent = 'GPT-5: Service non disponible';
      }
    } catch (error) {
      console.error('❌ Error testing GPT service:', error);
      this.gptStatusIndicator.className = 'w-3 h-3 bg-red-500 rounded-full';
      this.gptStatusIndicator.nextElementSibling.textContent = 'GPT-5: Erreur';
    }
  }

  handleNewUserMessage(message) {
    // Show notification
    this.showNotification(`Nouveau message de ${message.userName || 'un utilisateur'}`, 'info');
    
    // Update conversations if this is a new user
    this.loadConversations();
    
    // If this conversation is currently selected, add the message to UI
    if (this.currentUser && this.currentUser.id === message.userId) {
      this.addMessageToUI(message);
    }
  }

  handleUserConnected(message) {
    this.showNotification(`${message.name} s'est connecté`, 'info');
    this.loadConversations();
  }

  handleUserDisconnected(message) {
    this.showNotification(`${message.name} s'est déconnecté`, 'warning');
    this.loadConversations();
  }

  handleGPTAutoResponse(message) {
    this.showNotification('Réponse GPT automatique envoyée', 'info');
    this.loadConversations();
  }

  handleGPTResponseSent(message) {
    this.showNotification('Réponse GPT approuvée et envoyée', 'success');
  }

  handleAdminMessageSent(message) {
    // Message already added to UI, just show success notification
    this.showNotification('Message admin envoyé', 'success');
  }

  showTypingIndicator(sessionId, isTyping) {
    if (this.currentUser && this.currentUser.sessionId === sessionId) {
      this.typingIndicator.classList.toggle('hidden', !isTyping);
    }
  }

  showNotification(message, type = 'info') {
    const notificationText = document.getElementById('notificationText');
    notificationText.textContent = message;
    
    // Update notification color based on type
    this.notificationToast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50 ${
      type === 'error' ? 'bg-red-600' :
      type === 'success' ? 'bg-green-600' :
      type === 'warning' ? 'bg-yellow-600' :
      'bg-blue-600'
    } text-white`;
    
    // Show notification
    this.notificationToast.classList.remove('translate-x-full');
    
    // Hide after 5 seconds
    setTimeout(() => {
      this.notificationToast.classList.add('translate-x-full');
    }, 5000);
  }

  formatTimestamp(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
  }

  setupEventListeners() {
    // Send message
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // GPT response
    this.gptResponseBtn.addEventListener('click', () => this.generateGPTResponse());
    
    // GPT suggestion panel
    this.approveGptBtn.addEventListener('click', () => this.approveGPTResponse());
    this.editGptBtn.addEventListener('click', () => this.editGPTResponse());
    this.rejectGptBtn.addEventListener('click', () => this.rejectGPTResponse());

    // Admin availability toggle
    this.adminAvailabilityToggle.addEventListener('change', (e) => {
      this.updateAdminAvailability(e.target.checked);
    });

    // Search conversations
    this.searchConversations.addEventListener('input', (e) => {
      this.filterConversations(e.target.value);
    });

    // Emoji picker (simple implementation)
    this.emojiPickerBtn.addEventListener('click', () => {
      const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '💯', '✨', '🚀'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      this.messageInput.value += randomEmoji;
    });
  }

  filterConversations(query) {
    const conversationItems = this.conversationsContainer.querySelectorAll('.conversation-item');
    
    conversationItems.forEach(item => {
      const userName = item.querySelector('h4').textContent.toLowerCase();
      const userEmail = item.querySelector('p').textContent.toLowerCase();
      const searchQuery = query.toLowerCase();
      
      const isVisible = userName.includes(searchQuery) || userEmail.includes(searchQuery);
      item.style.display = isVisible ? 'block' : 'none';
    });
  }
}

// Initialize the admin chat system when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new AdminChatSystem();
});


