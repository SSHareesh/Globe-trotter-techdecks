import os
import django
import json
import secrets

os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
django.setup()

from landing.providers.groq import chat_with_ai

def test_chat():
    print("--- Testing GlobeTrotter AI Chatbot ---")
    
    # Test simple message
    try:
        msg = "Hi! What's the best time to visit Paris?"
        print(f"User: {msg}")
        resp = chat_with_ai(msg)
        print(f"AI: {resp}\n")
    except Exception as e:
        print(f"Error 1: {e}\n")

    # Test with history
    try:
        history = [
            {"role": "user", "content": "I like historical sites."},
            {"role": "assistant", "content": "That's great! Historical sites offer a deep dive into the past."}
        ]
        msg = "Based on that, suggest a destination in India."
        print(f"User: {msg} (with history)")
        resp = chat_with_ai(msg, history=history)
        print(f"AI: {resp}\n")
    except Exception as e:
        print(f"Error 2: {e}\n")

if __name__ == "__main__":
    test_chat()
