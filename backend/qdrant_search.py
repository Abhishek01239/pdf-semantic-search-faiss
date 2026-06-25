from vector_store import (
    client,
    COLLECTION_NAME
)

from embedder import (
    generate_embeddings
)


def search_chunks(
    query,
    top_k=5
):

    try:

        query_embedding = (
            generate_embeddings(
                [query]
            )[0]
        )

        results = client.query_points(
            collection_name=
            COLLECTION_NAME,

            query=
            query_embedding,

            limit=
            top_k
        )

        formatted_results = []

        for point in results.points:

            formatted_results.append(
                {
                    "chunk":
                    point.payload["text"],

                    "distance":
                    point.score,

                    "metadata":
                    {
                        "source":
                        point.payload["source"],

                        "chunk_id":
                        point.payload["chunk_id"]
                    }
                }
            )

        return formatted_results

    except Exception as e:

        print(
            "Qdrant search error:",
            str(e)
        )

        return []