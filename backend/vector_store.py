import os

from dotenv import load_dotenv
from qdrant_client import QdrantClient

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

# Debug prints to see environment variables in server logs
print("=== ENVIRONMENT VARIABLE CHECK ===")
print(f"QDRANT_URL set: {QDRANT_URL is not None} (value: {QDRANT_URL[:25] + '...' if QDRANT_URL else 'None'})")
print(f"QDRANT_API_KEY set: {QDRANT_API_KEY is not None}")
print(f"JINA_API_KEY set: {os.getenv('JINA_API_KEY') is not None}")
print(f"GROQ_API_KEY set: {os.getenv('GROQ_API_KEY') is not None}")
print("==================================")

COLLECTION_NAME = "pdf_chunks"

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)