import { getChat, sendMessage } from "../common/api"
import { getAppStorage } from "../common/storage"

async function sendOrPopup(tabs: any){
  let data = {
    text: tabs[0].url,
  }
  const { botToken, chatIds } = await getAppStorage()
  var container = document.createElement('div')
  if (chatIds.length == 1){
    let chatId = chatIds[0]
    const chat = await getChat(botToken, chatId)
    const chatName = chat.title ?? chat.first_name ?? chat.id
    await sendMessage(botToken, { chat_id: chatId, ...data }).catch((error) => {
      showError(`Sending link to ${chatName} ${chat.type} failed: ${error.message}`)
    })
    var content = document.createTextNode("Sent page to " + chatName + " channel")
    container.appendChild(content)
    setTimeout(window.close, 2000)
  } else if (chatIds.length > 1) {
    var content = document.createTextNode("Send to: ")
    var select = document.createElement('select')
    select.setAttribute("id", "selection")
    for (const chatId of chatIds) {
      const chat = await getChat(botToken, chatId)
      const chatName = chat.title ?? chat.first_name ?? chat.id
      let option = document.createElement("option")
      let optionText = document.createTextNode(chatName.toString())
      option.setAttribute("value", chatId)
      option.appendChild(optionText)
      select.appendChild(option)
    }
    var button = document.createElement("button")
    button.setAttribute("id", "button")
    let buttonText = document.createTextNode("Send")
    button.appendChild(buttonText)
    button.addEventListener("click", buttonClick)
    container.appendChild(content)
    container.appendChild(select)
    container.appendChild(button)
  }
  document.body.appendChild(container)

  async function buttonClick(){
    const mySelection = document.getElementById("selection");
    if (mySelection) {
      var value = mySelection.options[mySelection.selectedIndex].value;
      var text = mySelection.options[mySelection.selectedIndex].text;
      await sendMessage(botToken, { chat_id: value, ...data }).catch((error) => {
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
