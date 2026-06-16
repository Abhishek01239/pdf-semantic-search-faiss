from embedder import generate_embeddings

def search_chunks(query, collection, top_k=3):
    query_embedding = generate_embeddings([query])[0]

    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=top_k
    )

    formatted_results = []

    docs = results.get("documents", [[]])[0]
    dists = results.get("distances", [[]])[0]

    for i in range(len(docs)):
        formatted_results.append({
            "rank": i + 1,
            "chunk": docs[i],
            "distance": dists[i]
        })

    return formatted_results

    