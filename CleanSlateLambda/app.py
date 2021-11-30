import cleanslate
import json

event = {
    "body": '{"URL":"https://teddit.net/r/college/comments/psd28k/college_is_fun_as_hell/", "commentID":"hdr32bh"}'
} 

response = cleanslate.handleTitlesRequest(event, None)

print(response)
