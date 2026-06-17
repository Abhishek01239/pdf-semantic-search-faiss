from pdf_loader import extract_pdf_text
from chunker import create_chunks

from chroma_store import (
    get_collection,
    store_chunks
)

from chroma_search import search_chunks

from llm import generate_answer


def build_database():

    text = extract_pdf_text(
        "data/sample.pdf"
    )

    chunks = create_chunks(text)

    store_chunks(chunks)


def main():

    collection = get_collection()

    if collection.count() == 0:
        build_database()

    print("=" * 60)
    print("PDF RAG Assistant (ChromaDB + Ollama)")
    print("Type 'exit' to quit")
    print("=" * 60)

    while True:

        query = input(
            "\nAsk a question: "
        ).strip()

        if query.lower() == "exit":
            print("Goodbye!")
            break

        if not query:
            print("Please enter a valid question.")
            continue

        # Retrieve relevant chunks
        results = search_chunks(
            query,
            collection,
            top_k=3
        )

        # Build context from retrieved chunks
        context = "\n\n".join(
            [
                result["chunk"]
                for result in results
            ]
        )

        # Generate answer using Ollama
        answer = generate_answer(
            context,
            query
        )

        print("\n" + "=" * 80)
        print("ANSWER")
        print("=" * 80)
        print(answer)

        print("\n" + "=" * 80)
        print("SOURCE CHUNKS")
        print("=" * 80)

        for result in results:

            print(
                f"\nDistance: "
                f"{result['distance']:.4f}"
            )

            print("-" * 80)

            print(result["chunk"])

    print("\nSession Ended.")


if __name__ == "__main__":
    main()