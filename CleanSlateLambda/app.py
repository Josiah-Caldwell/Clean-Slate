import cleanslate
import json

event = {
    "body": '{"URL":"https://teddit.net/r/AskReddit/comments/qv0wj6/what_is_a_fact_you_know_off_the_top_of_your_head/"}'
} 

response = cleanslate.handleCommentsRequest(event, None)

print(response)
