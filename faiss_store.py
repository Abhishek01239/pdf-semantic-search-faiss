import faiss
import numpy as np
import pickle


def create_faiss_index(chunks, embeddings):

    embeddings = np.array(embeddings).astype("float32")

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(embeddings)

    faiss.write_index(index, "faiss_index.bin")

    with open("chunks.pkl", "wb") as f:
        pickle.dump(chunks, f)

    print("FAISS index created successfully!")


def load_faiss_index():

    index = faiss.read_index("faiss_index.bin")

    with open("chunks.pkl", "rb") as f:
        chunks = pickle.load(f)

    return index, chunks