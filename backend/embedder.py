from sentence_transformers import SentenceTransformer

model = None


def get_model():
    global model

    if model is None:
        model = SentenceTransformer(
            "all-MiniLM-L6-v2",
            device="cpu"
        )

    return model


def generate_embeddings(texts):
    model = get_model()

    embeddings = model.encode(
        texts,
        convert_to_numpy=True
    )

    return embeddings