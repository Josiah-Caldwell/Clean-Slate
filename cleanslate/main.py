from cleanslate import CleanSlateHandler

text = """
This fucking planet is hell.
"""

handler = CleanSlateHandler()
censorPairs = handler.searchInappropriateWordsInText(text)
censoredText = handler.censorText(text, censorPairs)
print(censoredText)