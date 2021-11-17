import re
import csv
import urllib
from bs4 import BeautifulSoup

class CleanSlateHandler:
    def parseText(self):
        # provide url
        url = 'https://www.reddit.com/r/CasualConversation/comments/pt93vf/if_i_win_the_lottery_what_would_you_like/'

        # open url
        html = urllib.request.urlopen(url)

        # parse file
        parsedText = BeautifulSoup(html, 'html.parser')

        return parsedText

    def __init__(self):
        self.INAPPROPRIATE_WORD_LIST = []
        with open("../data/bad-words.csv") as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                self.INAPPROPRIATE_WORD_LIST += row

    def searchInappropriateWordsInText(self, text):
        censorPairs = []
        for word in self.INAPPROPRIATE_WORD_LIST:
            censorPairs += [(match.start(), len(word)) for match in re.finditer(word, text)]
        return censorPairs

    def censorText(self, text, censorPairs):
        censoredText = text
        for pair in censorPairs:
            censoredText =  censoredText[:pair[0]] + ("-" * pair[1]) + censoredText[pair[0]+pair[1]:]
        return censoredText