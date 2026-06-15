import pickle

def save_data(chunks, embeddings):
    with open("vector_store.pkl", "wb") as f:
        pickle.dump(
            {
                "chunks":chunks,
                "embeddings": embeddings
            },
            f
        )

def load_data():
    with open("vector_store.pkl", "rb") as f:
        return pickle.load(f)
    
