import os
import streamlit as st

from pdf_loader import load_all_pdfs

from chroma_store import get_collection, store_documents

from chroma_search import search_chunks

from llm import generate_answer

st.set_page_config(
    page_title= "PDF RAG Assistant",
    layout = 'wide'
)

st.title("PDF RAG Assitant")

uploaded_files = st.sidebar.file_uploader(
    "Upload PDFs",
    type = ["pdf"],
    accept_multiple_files=True
)

if uploaded_files:
    os.makedirs(
        "data",
        exist_ok=True
    )

    for uploaded_file in uploaded_files:
        file_path = os.path.join(
            "data",
            uploaded_file.name
        )

        with open(
            file_path,
            "wb"
        ) as f:
            f.write(uploaded_file.getbuffer())

    st.sidebar.success("PDFs uploaded succesfully")

if st.sidebar.button("Build Knowledge Base"):
    collection = get_collection()

    if collection.count() == 0:
        documents = load_all_pdfs("data")

        store_documents(documents)

        st.sidebar.access("Knowledge Base created!")

    else:
        st.sidebar.info("Database already exists")

question = st.text_input("Ask Question:")

if question: 
    collection = get_collection()

    results =  search_chunks(
        query=question,
        collection=collection,
        top_k=3
    )

    context ="\n\n".join(
        [
            result['chunk']
            for result in results
        ]
    )

    answer  = generate_answer(
        context, 
        question
    )

    st.subheader("Answer")
    st.write(answer)

    st.subheader("Sources")

    for result in results:
        metadata =result["metadata"]
        st.write(
            f"📄 {metadata['source']} "
            f"(Chunk {metadata['chunk_id']})"
        )