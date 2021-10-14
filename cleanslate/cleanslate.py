import csv
import re
import urllib
import requests
import json
from bs4 import BeautifulSoup


def parseSubmission(submissionURL):
    submissionPageHTML = requests.get(submissionURL).content
    submissionParseTree = BeautifulSoup(submissionPageHTML, "html.parser")
    submissionContent = submissionParseTree.select(".usertext-body > .md p")
    submissionText = ""

    for paragraph in submissionContent:
        submissionText += paragraph.contents[0] + "\n"

    return submissionText

def initInappropriateWordsList():
    INAPPROPRIATE_WORD_LIST = []
    with open("../data/bad-words.csv") as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            INAPPROPRIATE_WORD_LIST += row
    
    return INAPPROPRIATE_WORD_LIST

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

def handleRequest(event, context):
    requestBody = json.loads(event["body"])
    URL = requestBody["URL"]
    plaintext = parseSubmission(URL)
    matches = searchInappropriateWordsInText(plaintext)
    censortext = censor(plaintext, matches)
    return censortext