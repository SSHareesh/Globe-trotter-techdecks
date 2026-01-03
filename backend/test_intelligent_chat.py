import os
import django
import json

os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
django.setup()

from landing.providers.groq import chat_with_ai

def test_intelligent_chat():
    print("=== Testing Intelligent Chatbot ===\n")
    
    # Test 1: Flight query
    print("1. Testing flight query...")
    try:
        result = chat_with_ai("Show me flights to Paris for April 5th")
        print(f"Response: {result.get('response')}")
        if result.get('data'):
            print(f"Data type: {result['data'].get('type')}")
            print(f"Items count: {len(result['data'].get('items', []))}")
            if result['data'].get('items'):
                print(f"First item: {json.dumps(result['data']['items'][0], indent=2)}")
        print()
    except Exception as e:
        print(f"Error: {e}\n")
    
    # Test 2: Hotel query
    print("2. Testing hotel query...")
    try:
        result = chat_with_ai("Find hotels in London")
        print(f"Response: {result.get('response')}")
        if result.get('data'):
            print(f"Data type: {result['data'].get('type')}")
            print(f"Items count: {len(result['data'].get('items', []))}")
        print()
    except Exception as e:
        print(f"Error: {e}\n")
    
    # Test 3: General query
    print("3. Testing general query...")
    try:
        result = chat_with_ai("What's the best time to visit Japan?")
        print(f"Response: {result.get('response')}")
        print(f"Has data: {bool(result.get('data'))}")
        print()
    except Exception as e:
        print(f"Error: {e}\n")

if __name__ == "__main__":
    test_intelligent_chat()
