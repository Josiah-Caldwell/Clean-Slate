var port = chrome.runtime.connect();
port.onMessage.addListener(function(message) {
    switch(message.action) {
        case "CENSOR_PAGE_TITLE":
            document.title = message.pageTitle;
            break;
        case "CENSOR_SUBMISSION_TITLE":
            let submissionTitleEl = document.querySelector(".title a h2" );
            submissionTitleEl.innerText = message.submissionTitle;
            break;
        case "CENSOR_SUBMISSION":
            let submissionEl = document.querySelector("#post .usertext-body .md");
            submissionEl.innerText = message.submission;
            break;
        case "CENSOR_COMMENT":
            let commentEl = document.querySelector(`#${message.commentID}`);
            commentEl.querySelector(".body .md").innerText = message.content;

            let nestedComments = commentEl.querySelectorAll(".comment");
            for(let i = 0; i < nestedComments.length; i++) {
                let child = nestedComments.item(i);
                child.parentElement.removeChild(child);
            }
            break;
    }
});

async function sendCommentsInfo() {
    let comments = document.querySelector(".comments").children;
    for(let i = 0; i < comments.length; i++) {
        let comment = comments.item(i);
        port.postMessage({action: "CENSOR_COMMENT", commentID: comment.id});
    }
}

window.onload = function(event) {
    sendCommentsInfo();
};
