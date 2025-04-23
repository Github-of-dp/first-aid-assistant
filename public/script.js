const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("user-input");

function addMessage(text, type = "bot") {
  const msg = document.createElement("div");
  msg.className = `msg ${type}`;
  msg.innerText = text;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage() {
  const userMsg = inputEl.value.trim();
  if (!userMsg) return;

  addMessage(userMsg, "user");
  inputEl.value = "";

  try {
    const res = await fetch("/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg }),
    });

    const data = await res.json();
    addMessage(data.reply || "I couldn't understand that.");
  } catch (err) {
    console.error(err);
    addMessage("Something went wrong!");
  }
}

function speak() {
  addMessage("🎤 Voice input coming soon!", "bot");
}

function uploadImage() {
  addMessage("📷 Image analysis coming soon!", "bot");
}
