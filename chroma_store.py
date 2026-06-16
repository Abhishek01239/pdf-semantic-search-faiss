import chromadb
from embedder import generate_embeddings

CHROMA_PATH = "chroma_db"
COLLECTION_NAME = "pdf_chunks"

def get_collection():
    client = chromadb.PersistentClient(
        path = CHROMA_PATH
    )

    collection = client.get_or_create_collection(
        name = COLLECTION_NAME
    )

    return collection

def store_chunks(chunks):
    collection = get_collection()

    if collection.count() > 0:
        print("Data already exist")
        return
    
    embeddings = generate_embeddings(chunks)

    collection.add(
        ids = [
            str(i) for i in range(len(chunks))
        ],
        documents = chunks,
        embeddings = embeddings.tolist()
    )

    print(f"{len(chunks)} chunks stored successfully")


