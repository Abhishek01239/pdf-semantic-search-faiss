from pdf_loader import extract_pdf_text
from chunker import create_chunks

from chroma_store import (
    get_collection,
    store_chunks
)

from chroma_search import search_chunks


def build_database():

    text = extract_pdf_text(
        "pdf-semantic-search-faiss/data/sample.pdf"
    )

    chunks = create_chunks(text)

    store_chunks(chunks)


def main():

    collection = get_collection()

    if collection.count() == 0:
        build_database()

    print("=" * 60)
    print("PDF Semantic Search using ChromaDB")
    print("=" * 60)

    while True:

        query = input(
            "\nAsk a question (exit to quit): "
        ).strip()

        if query.lower() == "exit":
            break

        results = search_chunks(
            query,
            collection,
            top_k=3
        )

        print("\nResults:\n")

        for result in results:

            print("=" * 80)

            print(
                f"Rank: {result['rank']}"
            )

            print(
                f"Distance: "
                f"{result['distance']:.4f}"
            )

            print("-" * 80)

            print(result["chunk"])

            print()

    print("Goodbye!")


if __name__ == "__main__":
    main()