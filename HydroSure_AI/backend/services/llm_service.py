import logging
from openai import OpenAI
from typing import List, Dict, Any, Optional
from backend.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def validate_pad_images(pad_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Sends the cropped pad images to a multimodal LLM (GPT-4V) 
    to validate successful segmentation.
    
    Args:
        pad_list: List of dictionaries, each containing 'index' and 'image_b64'.
        
    Returns:
        The same list with an added 'is_valid' flag.
    """
    logging.info("LLM Service: Starting visual validation of segmented pads...")
    
    messages = [
        {
            "role": "system",
            "content": (
                "You are a quality control agent for a water testing lab. Your task is to review 16 cropped "
                "images, which are intended to be single, uniform color pads from a test strip. "
                "For each image, determine if it is a 'valid' pad (clear, single color, minimal white border) or 'invalid' "
                "(mostly white background, very blurry, or contains multiple pads/text)."
            )
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze the following 16 images. Provide your response as a simple JSON array of booleans, where 'true' means a valid pad and 'false' means invalid. DO NOT include any text outside the JSON array. Example: [true, true, false, true, ...]."}
            ]
        }
    ]
    
    for pad in pad_list:
        messages[1]["content"].append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/png;base64,{pad['image_b64']}"
            }
        })
        
    try:
        response = client.chat.completions.create(
            model="gpt-4o", 
            messages=messages,
            temperature=0.0,
            max_tokens=200, 
            response_format={"type": "json_object"}
        )
        
        json_string = response.choices[0].message.content
        if json_string:
            validation_array = json.loads(json_string) 
            if isinstance(validation_array, dict) and "result" in validation_array:
                validation_results = validation_array["result"]
            else:
                 validation_results = validation_array

            if len(validation_results) == len(pad_list):
                for i, pad in enumerate(pad_list):
                    pad["is_valid"] = validation_results[i]
                logging.info("LLM Service: Visual validation completed successfully.")
                return pad_list
        
    except Exception as e:
        logging.error("LLM Service: Visual validation failed: %s", str(e))
        
    for pad in pad_list:
        pad["is_valid"] = True
    logging.warning("LLM Service: Validation failed/incomplete. Defaulting all pads to 'valid'.")
    return pad_list


def get_interpretation_summary(results: List[Dict[str, Any]]) -> Optional[str]:
    """
    Sends the final structured results to an LLM for a human-readable summary.
    """
    logging.info("LLM Service: Starting result interpretation...")

    result_text = "\n".join([
        f"- {r['parameter']}: {r['matched_value']} {r.get('unit', '')} (Error ΔE: {r['confidence_score']:.2f})"
        for r in results
    ])
    
    prompt = (
        "You are an expert water quality analyst providing a summary for a home user. "
        "Review the following test results and provide a concise, friendly, 2-3 sentence summary "
        "of the water quality. Highlight 1-2 major points (good or bad). "
        "Do not use highly technical language or mention Delta E scores. "
        "Focus on the water's suitability for general household use.\n\n"
        "--- TEST RESULTS ---\n"
        f"{result_text}"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=300
        )
        return response.choices[0].message.content
        
    except Exception as e:
        logging.error("LLM Service: Interpretation failed: %s", str(e))
        return "Analysis summary is unavailable due to a service error."