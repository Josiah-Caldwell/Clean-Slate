from cleanslate import CleanSlateHandler

text = """
Good fuckin shit it’s nice to see some good social content on this sub. Seems like everybody’s complaining about not having friends or not enjoying their on campus experience.
"""

handler = CleanSlateHandler()
censorPairs = handler.searchInappropriateWordsInText(text)
censoredText = handler.censorText(text, censorPairs)

print(text + "\n\n")
print(censoredText)