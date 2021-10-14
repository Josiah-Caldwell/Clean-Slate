import cleanslate
import json

event = {"body": '{"URL":"https://teddit.net/r/college/comments/psd28k/college_is_fun_as_hell/"}'} 

censortext = cleanslate.handleRequest(event, None)

print(censortext)

