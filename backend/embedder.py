import os
import requests

from dotenv import load_dotenv

load_dotenv()

JINA_API_KEY = os.getenv(
    "JINA_API_KEY"
)


def generate_embeddings(texts):

    response = requests.post(
        "https://api.jina.ai/v1/embeddings",

        headers={
            "Authorization":
            f"Bearer {JINA_API_KEY}",
            "Content-Type":
            "application/json"
        },

        json={
            "model":
            "jina-embeddings-v3",

            "input":
            texts
        }
    )

    response.raise_for_status()

    data = response.json()

    embeddings = []

    for item in data["data"]:
        embeddings.append(
            item["embedding"]
        )

    return embeddings