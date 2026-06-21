from pdf_loader import load_all_pdfs

from chroma_store import (
    get_collection,
    store_documents
)

from chroma_search import search_chunks

from llm import generate_answer
from memory import get_history, add_message


def build_database():

    documents = load_all_pdfs(
        "data"
    )

    store_documents(
        documents
    )


def main():

    collection = get_collection()

    if collection.count() == 0:

        print(
            "Building ChromaDB..."
        )

        build_database()

    print("=" * 70)
    print(
        "Multi-Document RAG Assistant"
    )
    print(
        "Type 'exit' to quit"
    )
    print("=" * 70)

    while True:

        query = input(
            "\nAsk a question: "
        ).strip()

        if query.lower() == "exit":

            print(
                "Goodbye!"
            )

            break

        if not query:

            print(
                "Please enter a question."
            )

            continue

        results = search_chunks(
            query=query,
            collection=collection,
            top_k=3
        )

        context = "\n\n".join(
            [
                result["chunk"]
                for result in results
            ]
        )

        history = get_history()

        answer = generate_answer(
            history,
            context,
            query
        )

        add_message(
            "user",
            query
        )

        add_message(
            "assistant",
            answer
        )

        print("\n")
        print("=" * 70)
        print("ANSWER")
        print("=" * 70)
        print(answer)

        print("\n")
        print("=" * 70)
        print("SOURCES")
        print("=" * 70)

        for result in results:

            source = (
                result["metadata"]
                ["source"]
            )

            chunk_id = (
                result["metadata"]
                ["chunk_id"]
            )

            distance = (
                result["distance"]
            )

            print(
                f"\nFile      : {source}"
            )

            print(
                f"Chunk ID  : {chunk_id}"
            )

            print(
                f"Distance  : {distance:.4f}"
            )

            print(
                "-" * 70
            )

            print(
                result["chunk"][:300]
            )

            print()

    print(
        "\nSession Ended."
    )


if __name__ == "__main__":
    main()