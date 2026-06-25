from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct
)
import uuid
from vector_store import (
    client,
    COLLECTION_NAME
)


def create_collection(vector_size):

    collections = client.get_collections()

    names = [
        collection.name
        for collection
        in collections.collections
    ]

    if COLLECTION_NAME not in names:

        client.create_collection(
            collection_name=COLLECTION_NAME,

            vectors_config=VectorParams(
                size=vector_size,
                distance=Distance.COSINE
            )
        )


def store_chunks(
    chunks,
    embeddings,
    metadata
):

    vector_size = len(
        embeddings[0]
    )

    create_collection(
        vector_size
    )

    points = []

    for i in range(
        len(chunks)
    ):

        points.append(
            PointStruct(
                
                id=str(uuid.uuid4()),

                vector=embeddings[i],

                payload={
                    "text":
                    chunks[i],

                    "source":
                    metadata[i]["source"],

                    "chunk_id":
                    metadata[i]["chunk_id"]
                }
            )
        )

    client.upsert(
        collection_name=
        COLLECTION_NAME,

        points=points
    )