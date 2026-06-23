from embedder import generate_embeddings

def search_chunks(query, collection, top_k=3):
    query_embedding = generate_embeddings([query])[0]

    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=top_k
    )

    formatted_results = []
    
    for i in range(
        len(results["documents"][0])
    ):
        formatted_results.append(
            {
                "rank": 1,

                "chunk": results["documents"][0][i],

                "distance": results["distances"][0][i],

                "metadata": results["metadatas"][0][i]
            }
        )

    return formatted_results

    