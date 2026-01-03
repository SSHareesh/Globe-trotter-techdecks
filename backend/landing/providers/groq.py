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
