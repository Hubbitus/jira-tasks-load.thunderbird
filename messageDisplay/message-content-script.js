async function extendMessage() {
    let messageDetails = await browser.runtime.sendMessage({
        command: "getMessageDetails",
    });

    // Get the details back from the formerly serialized content.
    const { text, issueJiraLink } = messageDetails;

    if (typeof issueJiraLink !== 'undefined'){
        console.log('issueJiraLink:', issueJiraLink);
        $(document.head).append($(`
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
                .issue-body-content {
                    min-height: 200px !important;
                }
                .issue-body-content .module > .mod-header + .mod-content {
                    margin-top: 15px !important;
                }

                /* Compact mail itself */
                .spacer-10, .spacer-20, .spacer-30, .spacer-40, .spacer-50, .spacer-60 {
                    height: 0 !important;
                    font-size: 0 !important;
                    line-height: 0 !important;
                }
                h1, h2, h3, h4, div.panel, .panelHeader, .panelContent {
                    padding: 0 !important;
                    margin: 0 !important;
                }
                h1 {
                    font-size: 20px !important;
                }
                /* /Compact mail itself */
            </style>
        `));

        /**
        * Unfortunately iframe does not work and content is not loaded by security reasons!
        * So, instead content fetched and injected directly in the message!
        **/
    //    $.get("https://jira-new.gid.team/browse/DATA-1104")
        $.get(issueJiraLink)
            .done(function(data) {
                console.log('JIRA data received');
                let div = $('<div id="jira-ext-content" style="display: flex;">');
                let content = $('<html />').html(data);

                div.append(content.find('style'));
                div.append(content.find('link[type="text/css"]'));
                div.append(content.find('link[rel="stylesheet"]'));
                content.find('#ppm-wbs-issue-details-panel-biggantt, #checklistPanelRight, #activitymodule, #tempo-issue-view-panel').remove();
                // Again add same style! To re-define changes from jira!
                div.append($(`
                    <style>
                        h1, h2, h3, h4, div.panel, .panelHeader, .panelContent {
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                    </style>
                `));
                div.append(content.find('#main'));

    // At right. @TODO
    //            $('table.structure').parent().parent().append($('<td></td>').append(div));
                $('.moz-text-html').append(div);
            })
        ;
    }
};

// Workaround to call async function
extendMessage();
