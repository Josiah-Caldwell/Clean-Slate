import urllib
from bs4 import BeautifulSoup

#provide url
url = 'https://www.reddit.com/r/CasualConversation/comments/pt93vf/if_i_win_the_lottery_what_would_you_like/'

#open url
html = urllib.request.urlopen(url)

#parse file
redditParse = BeautifulSoup(html, 'html.parser')

#print paragraphs
for para in redditParse.find_all('p') :
    print(para.get_text())