// src/services/botService.ts
interface KnowledgeBaseItem {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  suggestions: string[];
  priority?: number;
}

interface BotResponse {
  type: 'message' | 'goodbye' | 'redirect';
  message: string;
  suggestions?: string[];
  articleId?: string;
  redirectUrl?: string;
}

interface QuickAction {
  label: string;
  action: string;
}

class BotService {
  private knowledgeBase: KnowledgeBaseItem[];

  constructor() {
    this.knowledgeBase = [
      // ============ LOGIN & ACCOUNT HELP ============
      {
        id: 'kb-001',
        keywords: ["login", "password", "sign in", "access", "account", "log in", "can't login", "forgot password", "reset password", "locked out"],
        question: "Login Issues",
        answer: " Login Help\n\nHere are the steps to resolve login issues:\n\n1️⃣ Clear your browser cache and cookies\n2️⃣ Confirm you're using the correct email and password\n3️⃣ Try incognito/private browsing mode\n4️⃣ Reset your password:\n   • Click 'Forgot Password' on the login page\n   • Check your email for the reset link\n   • Create a new strong password\n\n💡 If you're still having trouble, contact IT support.",
        suggestions: ["Reset Password", "Clear Cache", "Contact IT Support"],
        priority: 10
      },
      {
        id: 'kb-010',
        keywords: ["account", "profile", "update", "change", "email", "username", "preferences", "settings"],
        question: "Account Management",
        answer: " Account Management\n\nHere's what you can manage:\n\n1️⃣ Update your profile information\n2️⃣ Change your email address\n3️⃣ Update your password\n4️⃣ Manage notification preferences\n5️⃣ View your activity history\n\nGo to Settings in your dashboard to make these changes.",
        suggestions: ["Update Profile", "Change Password", "View Settings"],
        priority: 8
      },

      // ============ TECHNICAL HELP ============
      {
        id: 'kb-003',
        keywords: ["crash", "error", "bug", "technical", "not working", "freeze", "broken", "app not working", "loading", "slow"],
        question: "Technical Issues",
        answer: " Technical Help\n\nTry these troubleshooting steps:\n\n1️⃣ Refresh the page (F5 or Ctrl+R)\n2️⃣ Clear your browser cache\n3️⃣ Check your internet connection\n4️⃣ Try a different browser (Chrome, Firefox, Edge)\n5️⃣ Disable browser extensions temporarily\n\nIf the problem persists:\n• Check our System Status page\n• Contact IT support with screenshots\n\nI'll help you get back on track!",
        suggestions: ["Refresh", "Clear Cache", "Contact IT"],
        priority: 9
      },

      // ============ CONTACT & SUPPORT ============
      {
        id: 'kb-006',
        keywords: ["contact", "support", "human", "agent", "speak", "call", "phone", "email", "live chat", "help desk"],
        question: "Contact Support",
        answer: " Contact Support\n\nYou can reach our support team through:\n\n📧 **Email:** AIsupport@company.com\n   Response within 24 hours\n\n💬 **Live Chat:** Available 9am-5pm SAST\n   Instant responses\n\n📱 **Phone:** +27-630-555-0123\n   Mon-Fri, 9am-5pm SAST\n\n📝 **Ticket System:** Submit a request in your portal\n   Track progress easily\n\nWe're here to help! 😊",
        suggestions: ["Email Support", "Live Chat", "Phone Support"],
        priority: 7
      },

      // ============ TICKET/REQUEST STATUS ============
      {
        id: 'kb-007',
        keywords: ["status", "progress", "track", "update", "where", "check", "ticket", "request", "follow up"],
        question: "Request Status",
        answer: " Request Status\n\nWays to track your request:\n\n🔍 **1️⃣ Dashboard**\n   Go to Dashboard → My Requests\n\n🔍 **2️⃣ Ticket Number**\n   Enter your ticket number\n\n🔍 **3️⃣ Email Updates**\n   Check your email for updates\n\n📌 **Status Meanings:**\n• New → Just submitted\n• In Review → Being evaluated\n• In Progress → Being worked on\n• Resolved → Completed\n• Closed → Finalized\n\nNeed more details? Contact the assigned team member.",
        suggestions: ["View Dashboard", "Email Updates", "Contact Team"],
        priority: 6
      },

      // ============ EVIDENCE & ATTACHMENTS ============
      {
        id: 'kb-005',
        keywords: ["evidence", "attachment", "upload", "file", "screenshot", "document", "image", "attach"],
        question: "Uploading Evidence",
        answer: "📎 Uploading Evidence\n\n✅ **Supported formats:**\n• Images: PNG, JPG, GIF\n• Documents: PDF, DOC, DOCX\n• Spreadsheets: XLS, XLSX\n• Log files: TXT, LOG\n\n📏 **Size limit:** 10MB per file\n\n📌 **How to upload:**\n1️⃣ Go to your request\n2️⃣ Click 'Add Attachment'\n3️⃣ Select your file\n4️⃣ Click 'Upload'\n\nNeed help with a specific file? Let me know!",
        suggestions: ["Supported Formats", "File Limits", "Upload Help"],
        priority: 6
      },

      // ============ WELCOME/GREETING ============
      {
        id: 'kb-012',
        keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings", "start", "begin"],
        question: "Welcome",
        answer: "👋 Hello! I'm your AI Support Assistant.\n\nI'm here to help you with:\n• Login & account issues \n• Technical problems \n• Contact support \n\nHow can I assist you today?\n\nClick one of the options below or type your question!",
        suggestions: ["Login Help", "Technical Help", "Contact Support"],
        priority: 1
      }
    ];
  }

  searchKnowledgeBase(message: string): KnowledgeBaseItem | null {
    const lowerMessage = message.toLowerCase();
    
    // Check for exact matches first (when user clicks suggestions)
    const exactMatches = this.knowledgeBase.filter(article => {
      return article.question.toLowerCase() === lowerMessage ||
             article.question.toLowerCase().includes(lowerMessage);
    });
    
    if (exactMatches.length > 0) {
      return exactMatches[0];
    }
    
    // Then check keywords
    const matches = this.knowledgeBase.filter(article => {
      return article.keywords.some(keyword => lowerMessage.includes(keyword));
    });
    
    if (matches.length === 0) return null;
    
    matches.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    return matches[0];
  }

  processMessage(message: string): BotResponse {
    const lowerMessage = message.toLowerCase();
    
    // 🚨 CHECK FOR GOODBYE
    if (lowerMessage.includes("i'm done") || 
        lowerMessage.includes("im done") ||
        lowerMessage.includes("goodbye") ||
        lowerMessage.includes("bye") ||
        lowerMessage.includes("that's all") ||
        lowerMessage.includes("thats all") ||
        lowerMessage.includes("no more") ||
        lowerMessage.includes("no, i'm done") ||
        lowerMessage.includes("no im done")) {
      return {
        type: 'goodbye',
        message: "👋 Thanks for chatting with me!\n\nI hope I was able to help! If you need anything else, just click the chat button again.\n\nHave a great day! 😊",
        suggestions: []
      };
    }

    // 🚨 CHECK FOR "THANK YOU"
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return {
        type: 'message',
        message: "You're welcome! 😊 Is there anything else I can help you with?",
        suggestions: ["Yes, another question", "No, I'm done"]
      };
    }

    // 🚨 CHECK FOR "YES" OR "NO"
    if (lowerMessage === 'yes' || lowerMessage === 'no' || 
        lowerMessage === 'yeah' || lowerMessage === 'nope') {
      if (lowerMessage === 'yes' || lowerMessage === 'yeah') {
        return {
          type: 'message',
          message: "Great! What else can I help you with? 🤗",
          suggestions: ["Login Help", "Technical Help", "Contact Support"]
        };
      } else {
        return {
          type: 'message',
          message: "I'm sorry I couldn't help this time. 😔\n\nIs there something specific I can assist with?",
          suggestions: ["Login Help", "Technical Help", "Contact Support"]
        };
      }
    }

    // 🚨 SEARCH KNOWLEDGE BASE
    const article = this.searchKnowledgeBase(message);
    
    if (article) {
      return {
        type: 'message',
        articleId: article.id,
        message: article.answer,
        suggestions: article.suggestions || []
      };
    }

    // 🚨 FALLBACK
    return {
      type: 'message',
      message: "I'm not sure I understand that question. 🤔\n\nHere are some things I can help with:\n\n Login & Account Issues\n Technical Problems\n Contact Support\n\nCould you please rephrase your question?",
      suggestions: ["Login Help", "Technical Help", "Contact Support"]
    };
  }

  getQuickActions(): QuickAction[] {
    return [
      { label: " Login Help", action: "login" },
      { label: " Technical Help", action: "technical" },
      { label: " Contact Support", action: "contact" }
    ];
  }

  getQuickActionMessage(action: string): string {
    const actions: Record<string, string> = {
      'login': "Login Help",
      'technical': "Technical Help",
      'contact': "Contact Support"
    };
    return actions[action] || "I need help with something.";
  }
}

export default BotService;