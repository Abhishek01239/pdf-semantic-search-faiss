import os

from pdf_loader import extract_pdf_text
from chunker import create_chunks
from embedder import generate_embeddings

from faiss_store import (
    create_faiss_index,
    load_faiss_index
)

from faiss_search import search_faiss

def build_index():

    print("Building FAISS index...")

    pdf_path = "chunking/data/sample.pdf"

    text = extract_pdf_text(pdf_path)

    chunks = create_chunks(text)

    embeddings = generate_embeddings(chunks)

    create_faiss_index(
        chunks,
        embeddings
    )

    print("Index created successfully!\n")


def main():

    if not os.path.exists("faiss_index.bin"):
        build_index()

    index, chunks = load_faiss_index()

    print("=" * 60)
    print("PDF Semantic Search using FAISS")
    print("Type 'exit' to quit")
    print("=" * 60)

    while True:

        query = input("\nAsk a question: ").strip()

        if query.lower() == "exit":
            print("Goodbye!")
            break

        if not query:
            print("Please enter a valid question.")
            continue

        query_embedding = generate_embeddings([query])[0]

        results = search_faiss(
            query_embedding=query_embedding,
            index=index,
            chunks=chunks,
            top_k=3
        )

        print("\nTop Matching Chunks:\n")

        for result in results:

            print("=" * 80)
            print(f"Rank     : {result['rank']}")
            print(f"Distance : {result['distance']:.4f}")
            print("-" * 80)
            print(result["chunk"])
            print()

        print("=" * 80)


if __name__ == "__main__":
    main()