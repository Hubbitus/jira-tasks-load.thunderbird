// Register the message display script.
messenger.messageDisplayScripts.register({
    js: [
        { file: "modules/jquery/jquery-3.6.4.js" },
        { file: "messageDisplay/message-content-script.js" }
    ],
//    css: [{ file: "messageDisplay/message-content-styles.css" }],
});

/**
 * Add a handler for the communication with other parts of the extension,
 * like our message display script.
 *
 * Note: It is best practice to always define a synchronous listener
 *       function for the runtime.onMessage event.
 *       If defined asynchronously, it will always return a Promise
 *       and therefore answer all messages, even if a different listener
 *       defined elsewhere is supposed to handle these.
 *
 *       The listener should only return a Promise for messages it is
 *       actually supposed to handle.
 */
messenger.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Check what type of message we have received and invoke the appropriate
    // handler function.
    if (message && message.hasOwnProperty("command")) {
        return commandHandler(message, sender);
    }
    // Return false if the message was not handled by this listener.
    return false;
});

async function getIssueJiraLink(messageId){
    let full = await messenger.messages.getFull(messageId);
    let html = full.parts[0].parts[0].body;
//    console.log(html);
//    <td class="issue-key" style="border-collapse: collapse; border-spacing: 0px; color: #172b4d; padding: 0px; padding-left: 5px; vertical-align: middle" valign="middle"> <a href="https://jira-new.gid.team/browse/DATA-1104" style="text-decoration: none; color: #0052cc">DATA-1104</a> </td>
    // The more correct way of parsing is use DOM, but that will require additional dependency like JQuery as a module
    // so RegExp is the good tradeoff
    let rx = /<td .*?class="issue-key".+?<a href="([^"]+)"/s;
    let matches = rx.exec(html);
    console.log('matches', matches);
    let issueJiraLink = matches[1];
    console.log('issueJiraLink: ', issueJiraLink);
    return issueJiraLink;
}

// The actual (asynchronous) handler for command messages.
async function commandHandler(message, sender) {
    // Get the message currently displayed in the sending tab, abort if that failed.
    const messageHeader = await messenger.messageDisplay.getDisplayedMessage(
        sender.tab.id
    );

    if (!messageHeader) {
        return;
    }

    // Check for known commands.
    switch (message.command) {
        case "getMessageDetails":
            // Create the information we want to return to our message display script.
            return {
                text: `Mail subject is "${messageHeader.subject}"`,
                issueJiraLink: await getIssueJiraLink(messageHeader.id)
            };
    }
}
