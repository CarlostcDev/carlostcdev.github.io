class AiAssistant {
    constructor() {
        this.aiAssistant = document.getElementById("ai-assistant");
        this.conversationHistory = [];
    }

    init() {
        if (!this.aiAssistant) return;
        this.#toggleChat();
        this.#resizer();
        this.#keyboard();
        this.#sendMessage();
    }

    #toggleChat() {
        const bar = this.aiAssistant.querySelector(".ai-assistant-bar");
        const chat = this.aiAssistant.querySelector(".ai-assistant-chat");
        if (!bar || !chat) return;
        bar.addEventListener("click", () => {
            const isOpen = chat.classList.toggle("open");
            bar.setAttribute("aria-expanded", String(isOpen));
        });
    }

    #resizer() {
        const textarea = this.aiAssistant.querySelector(".ai-textarea");
        const form = this.aiAssistant.querySelector(".ai-form");
        const button = this.aiAssistant.querySelector(".ai-btn");
        if (!textarea || !form || !button) return;
        textarea.addEventListener("input", () => {
            button.classList.toggle("active", textarea.value.trim().length > 0);
            textarea.style.height = "40px";
            const height = Math.min(Math.max(Math.ceil(textarea.scrollHeight / 20) * 20, 40), 100);
            textarea.style.height = `${height}px`;
        });
        form.addEventListener("submit", e => {if (!textarea.value.trim()) e.preventDefault();});
    }

    #keyboard() {
        const textarea = this.aiAssistant.querySelector(".ai-textarea");
        if (!textarea) return;
        textarea.addEventListener("keydown", e => {
            if (e.key !== "Enter") return;
            if (e.ctrlKey) {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + "\n" + textarea.value.substring(end);
                textarea.selectionStart = start + 1;
                textarea.selectionEnd = start + 1;
                textarea.dispatchEvent(new Event("input", {bubbles: true}));
                return;
            }
            e.preventDefault();
            if (textarea.value.trim()) textarea.closest("form")?.requestSubmit();
        });
    }

    #sendMessage() {
        const form = this.aiAssistant.querySelector(".ai-form");
        const textarea = this.aiAssistant.querySelector(".ai-textarea");
        const button = this.aiAssistant.querySelector(".ai-btn");
        const messages = this.aiAssistant.querySelector(".messages");
        if (!form || !textarea || !button || !messages) return;

        form.addEventListener("submit", async e => {
            e.preventDefault();
            const message = textarea.value.trim();
            if (!message) return;
            this.#addMessage(message, "user");
            this.conversationHistory.push({role: "user", parts: [{text: message}]});
            textarea.value = "";
            textarea.style.height = "40px";
            button.classList.remove("active");

            try {
                const response = await fetch(
                    "https://api.carlostcdev-chatbot.workers.dev",
                    {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({messages: this.conversationHistory})
                    }
                );

                if (!response.ok) {
                    this.conversationHistory.pop();
                    const errorText = await response.text();
                    console.error(`Error ${response.status}: ${errorText}`);
                    this.#addMessage(`Error ${response.status}: ${errorText}`, "assistant");
                    return;
                }

                if (!response.body) {
                    this.#addMessage("The server has not sent a stream.", "assistant");
                    return;
                }

                const assistantMessage = this.#addMessage("", "assistant");
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                let textQueue = "";
                let assistantText = "";
                let isWriting = false;

                const writeQueue = async () => {
                    if (isWriting) return;
                    isWriting = true;
                    while (textQueue.length > 0) {
                        const match = textQueue.match(/^\s*\S+(?:\s+|$)/);
                        if (!match) break;
                        const word = match[0];
                        textQueue = textQueue.slice(word.length);
                        assistantText += word;
                        assistantMessage.innerHTML = this.#parseMarkdown(assistantText);
                        messages.scrollTop = messages.scrollHeight;
                        await new Promise(resolve => setTimeout(resolve, 60));
                    }
                    isWriting = false;
                };

                while (true) {
                    const {value, done} = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, {stream: true});
                    const lines = buffer.split("\n");
                    buffer = lines.pop() ?? "";
                    for (const line of lines) {
                        if (!line.startsWith("data: ")) continue;
                        const json = line.slice(6).trim();
                        if (!json || json === "[DONE]") continue;
                        try {
                            const data = JSON.parse(json);
                            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (text) {textQueue += text; await writeQueue();}
                        } catch (error) {
                            console.error("Error procesando SSE:", error, json);
                        }
                    }
                }

                while (textQueue.length > 0) {
                    await writeQueue();
                    if (textQueue.length > 0) await new Promise(resolve => setTimeout(resolve, 30));
                }

                assistantMessage.innerHTML = this.#parseMarkdown(assistantText);
                this.conversationHistory.push({role: "model", parts: [{text: assistantText}]});
            } catch (error) {
                console.error("Error del chatbot:", error);
                this.#addMessage(`Error: ${error.message}`, "assistant");
            }
        });
    }

    #parseMarkdown(text) {
        let html = this.#escapeHtml(text);
        const codeBlocks = [];
        html = html.replace(/```(?:[a-zA-Z0-9_+#.-]+)?\n?([\s\S]*?)```/g, (_, code) => {
            const index = codeBlocks.length;
            codeBlocks.push(`<pre><code>${code}</code></pre>`);
            return `\uE000CODE${index}\uE001`;
        });
        html = html.replace(/\[([^]]+)]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`);
        html = html.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
        html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<i>$1</i>");
        html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");
        html = html.replace(/`([^`\n]+)`/g, '<span class="underlined">$1</span>');
        html = html.replace(/^### (.+)$/gm, "<h4>$1</h4>");
        html = html.replace(/^## (.+)$/gm, "<h3>$1</h3>");
        html = html.replace(/^# (.+)$/gm, "<h2>$1</h2>");
        html = html.replace(/^[-*] (.+)$/gm, "<li>$1</li>");
        html = html.replace(/(?:<li>.*<\/li>\n?)+/g, match => `<ul>${match.replace(/\n/g, "")}</ul>`);
        html = html.replace(/\n/g, "<br>");
        codeBlocks.forEach((codeBlock, index) => {html = html.replace(`\uE000CODE${index}\uE001`, codeBlock);});
        return html;
    }

    #escapeHtml(text) {
        const element = document.createElement("div");
        element.textContent = text;
        return element.innerHTML;
    }

    #addMessage(text, sender) {
        const messages = this.aiAssistant.querySelector(".messages");
        if (!messages) return null;
        const message = document.createElement("div");
        message.classList.add("message", `message-${sender}`);
        if (sender === "assistant") message.innerHTML = this.#parseMarkdown(text);
        else message.textContent = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
        return message;
    }
}

new AiAssistant().init();