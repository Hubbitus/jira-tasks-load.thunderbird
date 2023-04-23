async function extendMessage() {
    let messageDetails = await browser.runtime.sendMessage({
        command: "getMessageDetails",
    });

    // Get the details back from the formerly serialized content.
    const { text, issueJiraLink } = messageDetails;

    /**
    * Unfortunately iframe does not work and content is not loaded by security reasons!
    * So, instead content fetched and injected directly in the message!
    **/
//    $.get("https://jira-new.gid.team/browse/DATA-1104")
    $.get(issueJiraLink)
        .done(function( data ) {
            console.log('JIRA data received');
            let div = $('<div style="display: flex; border: 1px solid green; height: 1000px;">');
            let content = $('<html />').html(data);
            console.log('Styles: ', content.find('style'));
            console.log('Links: ', content.find('link[type="text/css"]'));

            div.append(content.find('style'));
            div.append(content.find('link[type="text/css"]'));
            div.append($('<style>body { overflow: auto !important;}</style>'));
            div.append(content.find('#main'));
            $('.moz-text-html').append(div);
        });
};

// Workaround to call async function
extendMessage();
