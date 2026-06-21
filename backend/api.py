from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
from pathlib import Path
import os
import tempfile
from PyPDF2 import PdfReader
from memory import add_message, get_history, clear_history

from chroma_store import (
    get_collection,
    store_documents
)

from chroma_search import (
    search_chunks
)

from llm import (
    generate_answer
)

from chunker import create_chunks
from embedder import generate_embeddings

app = FastAPI()

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

# Enable CORS for frontend
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

@app.get("/app", response_class=HTMLResponse)
def frontend_app():

    return FileResponse(
        FRONTEND_DIR / "index.html"
    )


@app.get("/styles.css")
def frontend_styles():

    return FileResponse(
        FRONTEND_DIR / "styles.css"
    )


@app.get("/script.js")
def frontend_script():

    return FileResponse(
        FRONTEND_DIR / "script.js"
    )

@app.post("/ask")
def ask_question(request: QueryRequest):

    question = request.question.strip()

    if not question:
        return {
            "error": "Question cannot be empty."
        }

    # Get previous conversation
    history = get_history()

    # Get Chroma collection
    collection = get_collection()

    # Retrieve relevant chunks
    results = search_chunks(
        query=question,
        collection=collection,
        top_k=3
    )

    # Build context
    context = "\n\n".join(
        [
            result["chunk"]
            for result in results
        ]
    )

    # Generate answer using memory + context
    answer = generate_answer(
        history,
        context,
        question
    )

    # Save conversation
    add_message(
        "user",
        question
    )

    add_message(
        "assistant",
        answer
    )

    # Build sources
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
        "question": question,
        "answer": answer,
        "sources": sources,
        "history_length": len(
            get_history()
        )
    }

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process a PDF file"""
    
    if not file.filename.endswith('.pdf'):
        return {
            "success": False,
            "message": "Only PDF files are allowed"
        }
    
    try:
        # Save uploaded file temporarily
        contents = await file.read()
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
        
        # Extract text from PDF
        reader = PdfReader(tmp_path)
        text = ""
        
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
        
        # Clean up temp file
        os.unlink(tmp_path)
        
        if not text.strip():
            return {
                "success": False,
                "message": "Could not extract text from PDF"
            }
        
        # Create chunks and embeddings
        collection = get_collection()
        
        chunks = create_chunks(text)
        embeddings = generate_embeddings(chunks)
        
        # Generate IDs starting from current max ID
        current_id = collection.count()
        ids = [str(current_id + i) for i in range(len(chunks))]
        
        metadata = [
            {
                "source": file.filename,
                "chunk_id": idx
            }
            for idx in range(len(chunks))
        ]
        
        # Store in collection
        collection.add(
            ids=ids,
            documents=chunks,
            embeddings=embeddings.tolist(),
            metadatas=metadata
        )
        
        return {
            "success": True,
            "message": f"Successfully uploaded and processed {file.filename}",
            "chunks_stored": len(chunks)
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"Error processing file: {str(e)}"
        }

@app.post('/clear')
def clear_chat():
    clear_history()

    return{
        "message":"Conversation Cleared"
    }