//Consistent variable for pathways
var url = 'https://eqtk61pp5h.execute-api.us-east-1.amazonaws.com/prod';
var titleEndPoint = '/titles';
var commentsEndPoint = '/comment';
var postContentEndPoint = '/submission';
var tabUrl; 

//Get url of current tab
function getTabUrl() {
    console.log("Get Tab Url");
    return chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    });
}

//Fill Out
function getCommentID() {

}

function getTitles() {

    getTabUrl()
        .then(tabs => {
            console.log("Get Title")
            var tab = tabs[0];
            console.log(tab.url);
            tabUrl = tab.url;
            console.log("URL: " + tabUrl)
            return tabUrl;
        })
        .then(tabUrl => {
            console.log("API Call with URL: " + tabUrl)
            return fetch(url + titleEndPoint, {
                method: 'POST',
                header: {
                    "Origin": 'text/plain',
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    "URL": tabUrl
                })
            });
        })
        .then(response => {
            response.json().then(responseJson => {
                console.log(responseJson)
            })
        });

}

//Format
//function getComments() {
//    getTabUrl()
//        .then(tabs => {
//            console.log("Get Title")
//            var tab = tabs[0];
//            console.log(tab.url);
//            tabUrl = tab.url;
//            console.log("URL: " + tabUrl)
//            return tabUrl;
//        })
//        .then(tabUrl => {
//            console.log("API Call with URL: " + tabUrl)
//            return fetch(url + commentsEndPoint, {
//                method: 'POST',
//                header: {
//                    "Origin": 'text/plain',
//                    "Content-Type": 'application/json'
//                },
//                body: JSON.stringify({
//                    "URL": tabUrl
//                    "commentID" : //ID of comment changed
//                })
//            });
//        })
//        .then(response => {
//            response.json().then(responseJson => {
//                console.log(responseJson)
//            })
//        });

//}

//Format
function getSubmission() {
    getTabUrl()
        .then(tabs => {
            console.log("Get Title")
            var tab = tabs[0];
            console.log(tab.url);
            tabUrl = tab.url;
            console.log("URL: " + tabUrl)
            return tabUrl;
        })
        .then(tabUrl => {
            console.log("API Call with URL: " + tabUrl)
            return fetch(url + postContentEndPoint, {
                method: 'POST',
                header: {
                    "Origin": 'text/plain',
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    "URL": tabUrl
                })
            });
        })
        .then(response => {
            response.text().then(responseJson => {
                console.log(responseJson)
            })
        });
}

getTitles();
getSubmission();

//Change Webpage title with API Response JSON obj

//Change Webpage Comments based on associated ID
//Change Submission Content