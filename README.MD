# 📚 PDF RAG Assistant

A full-stack Retrieval-Augmented Generation (RAG) application built using:

- React (Frontend)
- FastAPI (Backend)
- ChromaDB (Vector Database)
- Ollama + Mistral (LLM)
- Sentence Transformers (Embeddings)

The application allows users to upload PDF documents, build a knowledge base, and ask questions about the uploaded documents using a local Large Language Model.

---

# 🚀 Features

✅ PDF Upload

✅ Multi-document support

✅ Semantic Search

✅ ChromaDB Vector Database

✅ Local LLM using Ollama

✅ Source Citation

✅ Conversation Memory

✅ React Frontend

✅ FastAPI Backend

✅ Multi-turn Chat

---

# 🏗️ Architecture

```text
React Frontend
       │
       ▼
FastAPI Backend
       │
       ▼
ChromaDB
       │
       ▼
Sentence Transformers
       │
       ▼
Ollama (Mistral)
```

---

# 📂 Project Structure

```text
pdf-rag-assistant/
│
├── backend/
│   ├── api.py
│   ├── memory.py
│   ├── llm.py
│   ├── pdf_loader.py
│   ├── chunker.py
│   ├── embedder.py
│   ├── chroma_store.py
│   └── chroma_search.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── data/
│
├── chroma_db/
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

# ⚙️ Tech Stack

| Technology | Purpose |
|-----------|----------|
| React | Frontend UI |
| FastAPI | Backend API |
| ChromaDB | Vector Database |
| Ollama | Local LLM |
| Mistral | Language Model |
| Sentence Transformers | Embeddings |
| PyPDF2 | PDF Extraction |

---

# 🛠 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/pdf-rag-assistant.git

cd pdf-rag-assistant
```

---

## Create Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

---

## Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

# Install Ollama

Download Ollama:

https://ollama.com

Pull Mistral:

```bash
ollama pull mistral
```

---

# ▶️ Running the Project

## Step 1: Start Ollama

```bash
ollama run mistral
```

---

## Step 2: Start FastAPI

```bash
cd backend

uvicorn api:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Step 3: Start React Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# 💬 Example Questions

- What is machine learning?
- Explain deep learning.
- How many leaves are allowed?
- Summarize the HR policy.
- Explain it in simple words.

---

# 🔍 RAG Pipeline

```text
PDF Files
    │
    ▼
Text Extraction
    │
    ▼
Chunking
    │
    ▼
Embeddings
    │
    ▼
ChromaDB
    │
    ▼
Retriever
    │
    ▼
Ollama (Mistral)
    │
    ▼
Answer + Sources
```

---

# 🧠 Conversation Memory

The system stores previous messages to support follow-up questions.

Example:

User:
> What is machine learning?

User:
> Explain it simply.

The assistant remembers the previous conversation.

---

# 📌 API Endpoints

## Ask Question

```http
POST /ask
```

Request:

```json
{
    "question": "What is machine learning?"
}
```

---

## Clear Conversation

```http
POST /clear
```

---

# 📦 Dependencies

```text
fastapi
uvicorn
chromadb
sentence-transformers
PyPDF2
ollama
pydantic
```

---

# 🚀 Future Improvements

- User Authentication
- Session-based Memory
- Hybrid Search (BM25 + Vector Search)
- Redis Cache
- Docker Deployment
- Cloud Deployment
- Streaming Responses
- Multi-user Support

---

# 👨‍💻 Author

Abhishek Jaiswar

---

# ⭐ If you found this project useful, consider giving it a star.