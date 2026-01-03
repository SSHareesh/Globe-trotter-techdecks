from __future__ import annotations

import json
from typing import Any, List, Dict
from decouple import config
from landing.services.http import UpstreamError, post_json

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def generate_itinerary_enhancement(destination: str, duration: int, current_activities: List[Dict], hotel: str = None) -> List[Dict]:
    """
    Use Groq AI to generate additional activities to fill gaps in a travel itinerary.
    """
    api_key = config('GROQ_API_KEY', default='')
    if not api_key:
        raise UpstreamError("Groq API key not configured", status=503)

    model = "llama-3.3-70b-versatile"
    
    hotel_context = f" Staying at: {hotel}." if hotel else ""
    
    prompt = f"""
    You are a travel planning assistant for GlobeTrotter. 
    The user is visiting {destination} for {duration} days.{hotel_context}
    They have already selected these major attractions: {json.dumps(current_activities)}.
    
    TASK: Generate a dense, hour-by-hour itinerary for each day that fills the gaps between 9:00 AM and 9:00 PM.
    Include logistics (hotel check-in on Day 1), meals (breakfast, lunch, dinner, afternoon tea), and specific local hidden gems or activities.
    
    FORMAT: Return a JSON object with a 'days' key containing an array of day objects. 
    Each day object contains a 'day' index (integer 1 to {duration}) and a 'schedule' array.
    Each schedule item MUST have:
    - time: string (e.g., "10:30 AM")
    - type: string (one of: TRAVEL, DINING, SIGHTSEEING, CULTURE, LEISURE, FOOD)
    - title: short descriptive string
    - description: a 1-sentence poetic description
    
    Ensure timing is logical and dense (at least 6-8 items per day).
    Day 1 MUST start with arrival/check-in. The last day MUST end with departure.
    """

    messages = [
        {"role": "system", "content": "You are an expert travel itinerary generator. You must return a JSON object with the key 'days'."},
        {"role": "user", "content": prompt}
    ]

    try:
        resp = post_json(
            GROQ_API_URL,
            payload={
                "model": model,
                "messages": messages,
                "temperature": 0.7,
                "response_format": {"type": "json_object"}
            },
            headers={"Authorization": f"Bearer {api_key}"},
            timeout_seconds=30.0
        )
        
        content = resp.data['choices'][0]['message']['content']
        data = json.loads(content)
        days = data.get("days", [])

        # Fetch images from Pexels for each activity
        from landing.providers.pexels import search_image
        
        for day in days:
            for item in day.get('schedule', []):
                query = f"{item.get('title')} {destination}"
                try:
                    img = search_image(query)
                    if img:
                        item['image'] = img.url
                except Exception as e:
                    print(f"DEBUG: Pexels search failed for '{query}': {e}")
                    # Keep existing or fallback image if search fails
        
        return days
        
    except Exception as e:
        raise UpstreamError(f"AI generation failed: {str(e)}", status=502)

def chat_with_ai(message: str, history: List[Dict] = None) -> Dict[str, Any]:
    """
    General conversational chat with Groq AI.
    Detects travel queries and fetches real data from APIs.
    """
    api_key = config('GROQ_API_KEY', default='')
    if not api_key:
        raise UpstreamError("Groq API key not configured", status=503)

    model = "llama-3.3-70b-versatile"
    
    # First, use AI to detect intent and extract parameters
    intent_prompt = f"""
    Analyze this user message and determine if they're asking about:
    1. Flights (looking for flight options, prices, routes)
    2. Hotels (looking for accommodation)
    3. Destinations (asking about places to visit)
    4. General travel advice
    
    User message: "{message}"
    
    Respond with ONLY a JSON object in this format:
    {{
        "intent": "flight" | "hotel" | "destination" | "general",
        "origin": "airport code if mentioned, else null",
        "destination": "city or airport code if mentioned, else null",
        "date": "date if mentioned, else null"
    }}
    """
    
    try:
        # Get intent from AI
        intent_resp = post_json(
            GROQ_API_URL,
            payload={
                "model": model,
                "messages": [
                    {"role": "system", "content": "You are a travel intent analyzer. Return only valid JSON."},
                    {"role": "user", "content": intent_prompt}
                ],
                "temperature": 0.3,
                "response_format": {"type": "json_object"}
            },
            headers={"Authorization": f"Bearer {api_key}"},
            timeout_seconds=15.0
        )
        
        intent_data = json.loads(intent_resp.data['choices'][0]['message']['content'])
        intent = intent_data.get('intent', 'general')
        
        # If flight query detected, fetch real flights
        if intent == 'flight':
            from landing.providers.amadeus import search_flights_offer
            origin = intent_data.get('origin') or 'MAA'  # Default Chennai
            dest = intent_data.get('destination') or 'DEL'  # Default Delhi
            dep_date = intent_data.get('date') or '2026-04-05'
            
            try:
                flights = search_flights_offer(origin, dest, dep_date, limit=3)
                if flights:
                    flight_cards = []
                    for f in flights[:3]:
                        price = f.get('price', {})
                        itineraries = f.get('itineraries', [])
                        route = f"{origin} → {dest}"
                        if itineraries:
                            segments = itineraries[0].get('segments', [])
                            if segments:
                                route = f"{segments[0].get('departure', {}).get('iataCode', origin)} → {segments[-1].get('arrival', {}).get('iataCode', dest)}"
                        
                        flight_cards.append({
                            'price': price.get('total', 'N/A'),
                            'route': route,
                            'airline': f.get('validatingAirlineCodes', [''])[0] if f.get('validatingAirlineCodes') else 'N/A'
                        })
                    
                    return {
                        'response': f"Here are {len(flight_cards)} flights from {origin} to {dest} on {dep_date}:",
                        'data': {
                            'type': 'flight',
                            'items': flight_cards
                        }
                    }
            except Exception as e:
                print(f"Flight fetch error: {e}")
        
        # If hotel query detected, fetch real hotels
        elif intent == 'hotel':
            from landing.providers.serpapi import search_hotels
            city = intent_data.get('destination') or 'Paris'
            check_in = intent_data.get('date') or '2026-04-05'
            
            try:
                hotels = search_hotels(city, check_in, limit=3)
                if hotels:
                    hotel_cards = []
                    for h in hotels[:3]:
                        hotel_cards.append({
                            'name': h.get('name', 'Hotel'),
                            'rating': h.get('rating', 'N/A'),
                            'price': h.get('rate_per_night', {}).get('lowest', 'N/A')
                        })
                    
                    return {
                        'response': f"Here are {len(hotel_cards)} hotels in {city}:",
                        'data': {
                            'type': 'hotel',
                            'items': hotel_cards
                        }
                    }
            except Exception as e:
                print(f"Hotel fetch error: {e}")
        
        # If destination query, fetch destinations
        elif intent == 'destination':
            from landing.providers.amadeus import search_cities
            query = intent_data.get('destination') or message.split()[-1]
            
            try:
                cities = search_cities(query, limit=3)
                if cities:
                    dest_cards = []
                    for c in cities[:3]:
                        dest_cards.append({
                            'name': c.name,
                            'country': c.country or 'Unknown'
                        })
                    
                    return {
                        'response': f"Here are some destinations matching '{query}':",
                        'data': {
                            'type': 'destination',
                            'items': dest_cards
                        }
                    }
            except Exception as e:
                print(f"Destination fetch error: {e}")
        
        # Fallback to general conversation
        system_prompt = "You are GlobeTrotter, a helpful and friendly travel assistant. Keep responses concise and engaging."
        messages = [{"role": "system", "content": system_prompt}]
        if history:
            messages.extend(history[-6:])  # Last 6 messages for context
        messages.append({"role": "user", "content": message})

        resp = post_json(
            GROQ_API_URL,
            payload={
                "model": model,
                "messages": messages,
                "temperature": 0.7,
            },
            headers={"Authorization": f"Bearer {api_key}"},
            timeout_seconds=20.0
        )
        
        return {'response': resp.data['choices'][0]['message']['content']}
        
    except Exception as e:
        raise UpstreamError(f"Chat failed: {str(e)}", status=502)
