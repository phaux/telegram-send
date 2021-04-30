import { getChat, sendMessage } from "../common/api"
import { getAppStorage } from "../common/storage"

async function sendOrPopup(tabs: any){
    let data = {
      text: tabs[0].url,
    }
    const { botToken, chatIds } = await getAppStorage()
    const myElement = document.getElementById("replaceMe");
    if (chatIds.length == 1){
      let chatId = chatIds[0]
      console.log(chatId)
      console.log(data)
      const chat = await getChat(botToken, chatId)
      const chatName = chat.title ?? chat.first_name ?? chat.id
      console.log("passed")
      await sendMessage(botToken, { chat_id: chatId, ...data }).catch((error) => {
        showError(`Sending link to ${chatName} ${chat.type} failed: ${error.message}`)
      })
      if(myElement)(myElement.innerHTML = "Sent page to " + chatName + " channel")
      setTimeout(window.close, 2000)
    } else if (chatIds.length > 1) {
      let inner = "<p>Send to: <select id=\"selection\">"
      for (const chatId of chatIds) {
        const chat = await getChat(botToken, chatId)
        const chatName = chat.title ?? chat.first_name ?? chat.id
        inner += "<option value=\"" + chatId + "\">" + chatName + "</option>"
      }
      inner += "</select></p><button id=\"send\">Send</button>"
      if(myElement)(myElement.innerHTML = inner)
      const myButton = document.getElementById("send");
      if(myButton)(myButton.addEventListener("click", buttonClick))
    }

  function buttonClick(){
    console.log("button clicked")
    const mySelection = document.getElementById("selection");
    if (mySelection) {
      var value = mySelection.options[mySelection.selectedIndex].value;
      var text = mySelection.options[mySelection.selectedIndex].text;
      sendMessage(botToken, { chat_id: value, ...data }).catch((error) => {
        showError(`Sending link to ${text} failed: ${error.message}`)
      })
    }
    window.close()
  }

  function showError(message: string) {
    browser.notifications.create({
      type: "basic",
      title: "Telegram Send Error",
      message,
    })
  }
}

let querying = browser.tabs.query({currentWindow: true, active: true});
querying.then(sendOrPopup);
