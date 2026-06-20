import streamlit as st
import requests


API_URL = "http://127.0.0.1:8000"


st.set_page_config(
    page_title="PDF RAG Assistant",
    page_icon="📚",
    layout="wide"
)

st.title("📚 PDF RAG Assistant")
st.markdown(
    "Ask questions about your uploaded documents."
)

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display previous messages
for message in st.session_state.messages:

    with st.chat_message(
        message["role"]
    ):

        st.markdown(
            message["content"]
        )

# Chat input
question = st.chat_input(
    "Ask a question..."
)

if question:

    # Show user message
    st.session_state.messages.append(
        {
            "role": "user",
            "content": question
        }
    )

    with st.chat_message("user"):
        st.markdown(question)

    try:

        response = requests.post(
            f"{API_URL}/ask",
            json={
                "question": question
            },
            timeout=120
        )

        response.raise_for_status()

        data = response.json()

        answer = data["answer"]

        sources = data["sources"]

        source_text = "\n\n### Sources\n"

        for source in sources:

            source_text += (
                f"- {source['source']} "
                f"(Chunk {source['chunk_id']})\n"
            )

        full_response = (
            answer +
            source_text
        )

        with st.chat_message(
            "assistant"
        ):

            st.markdown(
                full_response
            )

        st.session_state.messages.append(
            {
                "role": "assistant",
                "content": full_response
            }
        )

    except requests.exceptions.ConnectionError:

        st.error(
            "Cannot connect to FastAPI backend.\n\n"
            "Start backend using:\n"
            "uvicorn api:app --reload"
        )

    except Exception as e:

        st.error(
            f"Error: {str(e)}"
        )