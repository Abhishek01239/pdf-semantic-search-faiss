import os

from dotenv import load_dotenv

from qdrant_client import QdrantClient

load_dotenv()

COLLECTION_NAME = "pdf_chunks"

qdrant_url = os.getenv("QDRANT_URL") or os.getenv("QUADRANT_URL")
if qdrant_url:
    qdrant_url = qdrant_url.strip()

qdrant_api_key = os.getenv("QDRANT_API_KEY") or os.getenv("QUADRANT_API_KEY")
if qdrant_api_key:
    qdrant_api_key = qdrant_api_key.strip()

client = QdrantClient(
    url=qdrant_url,
    api_key=qdrant_api_key
)