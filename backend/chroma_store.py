import chromadb

from chunker import create_chunks
from embedder import generate_embeddings


CHROMA_PATH = "chroma_db"
COLLECTION_NAME = "pdf_chunks"


def get_collection():

    client = chromadb.PersistentClient(
        path=CHROMA_PATH
    )

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME
    )

    return collection


def store_documents(documents):

    collection = get_collection()

    if collection.count() > 0:
        print("Database already contains data.")
        return

    ids = []
    chunks = []
    metadata = []

    current_id = 0

    for document in documents:

        source = document["source"]

        document_chunks = create_chunks(
            document["text"]
        )

        for chunk_index, chunk in enumerate(
            document_chunks
        ):

            ids.append(
                str(current_id)
            )

            chunks.append(chunk)

            metadata.append(
                {
                    "source": source,
                    "chunk_id": chunk_index
                }
            )

            current_id += 1

    embeddings = generate_embeddings(
        chunks
    )

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings.tolist(),
        metadatas=metadata
    )

    print(
        f"Stored {len(chunks)} chunks successfully."
    )