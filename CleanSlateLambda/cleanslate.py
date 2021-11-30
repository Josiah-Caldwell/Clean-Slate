import boto3
import csv
import json
import re
import requests
import urllib
from bs4 import BeautifulSoup

def initInappropriateWordsList():
    INAPPROPRIATE_WORD_LIST = []
    BUCKET_NAME = "cleanslatedata"
    S3_FILENAME = "bad-words.csv" 
    LOCAL_FILENAME = "/tmp/bad-words.csv"
    
    s3 = boto3.client("s3")
    s3.download_file(BUCKET_NAME, S3_FILENAME, LOCAL_FILENAME)

    with open(LOCAL_FILENAME) as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            INAPPROPRIATE_WORD_LIST += row
    
    return INAPPROPRIATE_WORD_LIST

def parseTitles(submissionURL):
    submissionPageHTML = requests.get(submissionURL).content
    submissionParseTree = BeautifulSoup(submissionPageHTML, "html.parser")

    pageTitle = submissionParseTree.select("head title")[0].contents[0]
    submissionTitle = submissionParseTree.select("div.title a h2")[0].contents[0]

    titles = {
        "pageTitle": pageTitle, 
        "submissionTitle": submissionTitle
    }
    return titles

def parseSubmission(submissionURL):
    submissionPageHTML = requests.get(submissionURL).content
    submissionParseTree = BeautifulSoup(submissionPageHTML, "html.parser")
    submissionContent = submissionParseTree.select(".usertext-body > .md p")
    submissionText = ""

    for paragraph in submissionContent:
        submissionText += paragraph.contents[0] + "\n"

    return submissionText

def parseComment(submissionURL, commentID):
    submissionPageHTML = requests.get(submissionURL).content
    submissionParseTree = BeautifulSoup(submissionPageHTML, "html.parser")
    commentElement = submissionParseTree.select(f"#{commentID}")[0]

    commentContent = commentElement.find_all("div", class_="body")[0].p.contents[0]
    comment = {
        "id": commentID,
        "content": commentContent
    }
    
    return comment

def searchInappropriateWordsInText(plaintext):
    INAPPROPRIATE_WORD_LIST = initInappropriateWordsList()
    matches = []
    plaintext = plaintext.lower()
    for word in INAPPROPRIATE_WORD_LIST:
        regex = "(?<![^ .,?!;])" + word + "(?![^ .,?!;\r\n])"
        matches += [(match.start(), word) for match in re.finditer(regex, plaintext)]
    return matches

def censor(plaintext, matches):
    censortext = plaintext
    for match in matches:
        censortext =  censortext[:match[0]] + ("-" * len(match[1])) + censortext[match[0]+len(match[1]):]
    return censortext

def handleTitlesRequest(event, context):
    requestBody = json.loads(event["body"])
    URL = requestBody["URL"]
    titles = parseTitles(URL)
    pageTitleMatches = searchInappropriateWordsInText(titles["pageTitle"])
    censoredPageTitle = censor(titles["pageTitle"], pageTitleMatches)
    submissionTitleMatches = searchInappropriateWordsInText(titles["submissionTitle"])
    censoredSubmissionTitle = censor(titles["submissionTitle"], submissionTitleMatches)

    responseBody = {
        'pageTitle': censoredPageTitle,
        'submissionTitle': censoredSubmissionTitle
    }      

    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        'body': json.dumps(responseBody) 
    }

def handleSubmissionRequest(event, context):
    requestBody = json.loads(event["body"])
    URL = requestBody["URL"]
    plaintext = parseSubmission(URL)
    matches = searchInappropriateWordsInText(plaintext)
    censortext = censor(plaintext, matches)

    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        'body': censortext
    }

def handleCommentRequest(event, context):
    requestBody = json.loads(event["body"])
    URL = requestBody["URL"]
    commentID = requestBody["commentID"]
    comment = parseComment(URL, commentID)

    matches = searchInappropriateWordsInText(comment["content"])
    censoredComment = {
        "id": comment["id"],
        "content": censor(comment["content"], matches)
    }

    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        'body': json.dumps(censoredComment)
    }
