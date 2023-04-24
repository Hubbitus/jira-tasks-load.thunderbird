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
            let div = $('<div id="jira-ext-content" style="display: flex;">');
            let content = $('<html />').html(data);
//            console.log('Styles: ', content.find('style'));
//            console.log('Links: ', content.find('link[type="text/css"]'));

            div.append(content.find('style'));
            div.append(content.find('link[type="text/css"]'));
//??            div.append(content.find('script'));
            content.find('#ppm-wbs-issue-details-panel-biggantt').remove();
            div.append($(`
                <style>
                    body {
                        overflow: auto !important;
                        background: initial !important;
                    }
                    #issue-content, header#stalker
                        , .issue-body-content .module > .mod-header > h1, .issue-body-content .module > .mod-header > h2, .issue-body-content .module > .mod-header > h3, .issue-body-content .module > .mod-header > h4, .issue-body-content .module > .mod-header > h5, .issue-body-content .module > .mod-header > h6
                        , .ghx-issuetable
                        , .issue-body-content .module > .mod-header .ops {
                        background-color: initial !important;
                    }
                    #jira-ext-content {
                        background: var(--aui-body-background);
                        border: 3px inset lightgreen;
                        /* height: 1000px; */
                        margin: 20px;
                        border-radius: 10px;
                    }
                    #project-avatar {
                        width: 48px;
                        height: 48px;
                    }
                </style>
            `));
            div.append(content.find('#main'));

// At right. @TODO
//            $('table.structure').parent().parent().append($('<td></td>').append(div));
            $('.moz-text-html').append(div);
        });
};

// Workaround to call async function
extendMessage();
