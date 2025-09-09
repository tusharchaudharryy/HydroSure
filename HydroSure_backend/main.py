from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

class ImageRequest(BaseModel):
    chart: str   # base64 string
    strip: str   # base64 string

@app.post("/analyze-strip")
def analyze_strip(data: ImageRequest):
    chart_img = f"data:image/png;base64,{data.chart}"
    strip_img = f"data:image/png;base64,{data.strip}"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an assistant that analyzes water test strips against a chart and outputs JSON only."
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Compare strip against chart and return water quality results in JSON format."},
                    {"type": "image_url", "image_url": {"url": chart_img}},
                    {"type": "image_url", "image_url": {"url": strip_img}}
                ]
            }
        ]
    )

    return {"results": response.choices[0].message["content"]}
