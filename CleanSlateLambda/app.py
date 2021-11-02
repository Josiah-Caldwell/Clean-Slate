import cleanslate
import json

event = {
    "body": '{"URL":"https://teddit.net/r/rant/comments/q7a47b/i_hate_being_a_parent/"}'
} 

response = cleanslate.handleRequest(event, None)

print(response)
