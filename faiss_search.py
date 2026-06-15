import numpy as np

def faiss_search(
        query_embedding,
        index,
        chunks,
        top_k = 3
):
    query_embedding = np.array(
        [query_embedding]
    ).astype("float32")

    distance, indices = index.search(
        query_embedding,
        top_k
    )


    results = []

    for rank, idx  in enumerate(indices[0]):
        results.append({
            "rank": rank+1,
            "chunk":chunks[idx],
            "distance":float(
                distance[0][rank]
            )
        })

    return results

# Backwards-compatible alias expected by app.py
def search_faiss(query_embedding, index, chunks, top_k=3):
    return faiss_search(query_embedding, index, chunks, top_k)

