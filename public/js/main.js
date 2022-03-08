const chatForm = document.getElementById("chat-form");
const chatContainer = document.querySelector(".chat-messages");

const socket = io();

// message from server
socket.on("message", (msgObj) => {
  console.log(msgObj);
  outputMessage(msgObj);

  //scroll down effect
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

//mesage submission

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //getting msg from the client form
  const msg = e.target.elements.msg.value;

  //emit message to server
  socket.emit("chatMsg", msg);

  //clearing input box
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username}<span>${msg.time}</span></p>
  <p class="text">
   ${msg.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
