from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
from pathlib import Path
import os
import tempfile

from PyPDF2 import PdfReader

from memory import (
    add_message,
    get_history,
    clear_history
)

from qdrant_search import search_chunks

from qdrant_store import (
    store_chunks
)
from llm import generate_answer

from chunker import create_chunks
from embedder import generate_embeddings


import sys

app = FastAPI()


def safe_print(*args, **kwargs):
    try:
        print(*args, **kwargs)
    except UnicodeEncodeError:
        encoding = sys.stdout.encoding or "utf-8"
        safe_args = [
            str(arg).encode(encoding, errors="replace").decode(encoding)
            for arg in args
        ]
        print(*safe_args, **kwargs)


FRONTEND_DIR = (
    Path(__file__).resolve().parent.parent
    / "frontend"
)

dist_assets = (
    FRONTEND_DIR
    / "dist"
    / "assets"
)

os.makedirs(
    dist_assets,
    exist_ok=True
)

app.mount(
    "/assets",
    StaticFiles(
        directory=dist_assets
    ),
    name="assets"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


@app.get("/")
def home():

    return {
        "message":
        "PDF RAG API Running"
    }


@app.get(
    "/app",
    response_class=HTMLResponse
)
def frontend_app():

    dist_index = (
        FRONTEND_DIR
        / "dist"
        / "index.html"
    )

    if dist_index.exists():
        return FileResponse(
            dist_index
        )

    return HTMLResponse(
        "<h2>React frontend not built.</h2>"
    )


@app.post("/ask")
def ask_question(
    request: QueryRequest
):

    question = (
        request.question.strip()
    )

    if not question:

        return {
            "error":
            "Question cannot be empty."
        }

    history = get_history()

    special_queries = [
        "give questions from pdf",
        "summarize pdf",
        "important topics",
        "generate questions",
        "what is in pdf"
    ]

    if question.lower() in special_queries:

        results = search_chunks(
            "",
            top_k=15
        )

    else:

        results = search_chunks(
            question,
            top_k=5
        )

    safe_print("\nQUESTION:")
    safe_print(question)

    safe_print("\nRESULTS:")
    safe_print(results)

    context = "\n\n".join(
        [
            result["chunk"]
            for result in results
        ]
    )

    safe_print("\nCONTEXT:")
    safe_print(context)

    if not context.strip():

        answer = (
            "I could not find relevant "
            "information in the uploaded "
            "documents."
        )

    else:

        try:

            answer = generate_answer(
                history,
                context,
                question
            )

        except Exception as e:
            import traceback
            traceback.print_exc()
            answer = (
                f"Groq Error: {str(e)}"
            )

    add_message(
        "user",
        question
    )

    add_message(
        "assistant",
        answer
    )

    sources = []

    for result in results:

        metadata = result["metadata"]

        sources.append(
            {
                "source":
                metadata["source"],

                "chunk_id":
                metadata["chunk_id"],

                "distance":
                result["distance"]
            }
        )

    return {
        "question":
        question,

        "answer":
        answer,

        "sources":
        sources,

        "history_length":
        len(get_history())
    }


@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):

    if not file.filename.endswith(
        ".pdf"
    ):

        return {
            "success": False,
            "message":
            "Only PDF files are allowed."
        }

    try:

        contents = await file.read()

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as tmp:

            tmp.write(contents)

            tmp_path = tmp.name

        reader = PdfReader(
            tmp_path
        )

        text = ""

        for page in reader.pages:

            page_text = (
                page.extract_text()
            )

            if page_text:

                text += (
                    page_text + "\n"
                )

        os.unlink(tmp_path)

        if not text.strip():

            return {
                "success": False,
                "message":
                "No text could be extracted."
            }

        chunks = create_chunks(
            text
        )

        embeddings = (
            generate_embeddings(
                chunks
            )
        )

        metadata = []

        for idx in range(
            len(chunks)
        ):

            metadata.append(
                {
                    "source":
                    file.filename,

                    "chunk_id":
                    idx
                }
            )

        store_chunks(
            chunks,
            embeddings,
            metadata
        )

        return {
            "success": True,

            "message":
            f"{file.filename} uploaded successfully.",

            "chunks_stored":
            len(chunks)
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "success": False,

            "message":
            str(e)
        }


@app.post("/clear")
def clear_chat():

    clear_history()

    return {
        "message":
        "Conversation cleared."
    }