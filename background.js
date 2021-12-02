const CLEAN_SLATE_API = "https://eqtk61pp5h.execute-api.us-east-1.amazonaws.com/prod";

// Run content script when tab is updated
chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });
    }
);

chrome.runtime.onConnect.addListener(function(port) {
    console.log(`CONNECTED TO ${port.sender.tab.id} @ ${port.sender.tab.url}`) // FOR DEBUGGING

    const TAB_URL = port.sender.tab.url;

    // Send censored titles to web page
    getCensoredTitles(TAB_URL).then(titles => {
        port.postMessage({action: "CENSOR_PAGE_TITLE", pageTitle: titles.pageTitle});
        port.postMessage({action: "CENSOR_SUBMISSION_TITLE", submissionTitle: titles.submissionTitle});
    });

    // Send censored post content to web page
    getCensoredSubmission(TAB_URL).then(submission => {
        port.postMessage({action: "CENSOR_SUBMISSION", submission: submission});
    });

    port.onMessage.addListener(function(message) {
        switch(message.action) {
            case "CENSOR_COMMENT":
                getCensoredComment(TAB_URL, message.commentID).then(comment => {
                    port.postMessage({action: "CENSOR_COMMENT", commentID: comment.id, content: comment.content});
                });
                break;
        }
    });
});

// Get censored webpage title and submission title from Clean Slate API
async function getCensoredTitles(url) {
    let titlesResponse = await fetch(`${CLEAN_SLATE_API}/titles`, {
        method: 'POST',
        header: {
            "Origin": 'text/plain',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            "URL": url
        })
    });

    let titles = await titlesResponse.json();
    return titles;
}

async function getCensoredSubmission(url) {
    let submissionResponse = await fetch(`${CLEAN_SLATE_API}/submission`, {
        method: 'POST',
        header: {
            "Origin": 'text/plain',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            "URL": url
        })
    });

    let submission = await submissionResponse.text();
    return submission;
}

async function getCensoredComment(url, commentID) {
    let commentResponse = await fetch(`${CLEAN_SLATE_API}/comment`, {
        method: 'POST',
        header: {
            "Origin": 'text/plain',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            "URL": url,
            "commentID": commentID
        })
    });

    let comment = await commentResponse.json();
    return comment;
}
