import uuid
from qdrant_client.models import PointStruct, Distance, VectorParams
from embedder import (
    generate_embeddings
)

from vector_store import (
    client,
    COLLECTION_NAME
)


def store_chunks(chunks, embeddings, metadata):
    if not chunks:
        return
    
    vector_size = len(embeddings[0])
    
    # Ensure the collection exists
    try:
        if not client.collection_exists(COLLECTION_NAME):
            client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE)
            )
    except Exception:
        # Fallback for older client versions/compatibility
        try:
            client.get_collection(COLLECTION_NAME)
        except Exception:
            client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE)
            )

    points = []
    for idx, (chunk, embedding, meta) in enumerate(zip(chunks, embeddings, metadata)):
        point_id = str(uuid.uuid4())
        payload = {
            "text": chunk,
            "source": meta.get("source"),
            "chunk_id": meta.get("chunk_id")
        }
        points.append(
            PointStruct(
                id=point_id,
                vector=embedding,
                payload=payload
            )
        )
        
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )


def search_chunks(
    query,
    top_k=3
):
    try:
        query_embedding = generate_embeddings(
            [query]
        )[0]
    except Exception as e:
        print(f"Embedding generation error: {e}")
        return []

    try:
        # Check if collection exists before searching
        try:
            exists = client.collection_exists(COLLECTION_NAME)
        except Exception:
            exists = True # default to True to attempt search if API check is not supported
            
        if not exists:
            return []

        results = client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_embedding,
            limit=top_k
        )
    except Exception as e:
        print(f"Qdrant search error: {e}")
        return []

    formatted_results = []

    for result in results:
        formatted_results.append(
            {
                "chunk":
                result.payload["text"],

                "distance":
                result.score,

                "metadata":
                {
                    "source":
                    result.payload["source"],

                    "chunk_id":
                    result.payload["chunk_id"]
                }
            }
        )

    return formatted_results