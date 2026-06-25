import os

from groq import Groq

from dotenv import load_dotenv

load_dotenv()

groq_key = os.getenv("GROQ_API_KEY")
if groq_key:
    groq_key = groq_key.strip()

client = Groq(
    api_key=groq_key
)


def generate_answer(
    history,
    context,
    question
):

    previous = ""

    for message in history:
        previous += (
            f"{message['role']}: "
            f"{message['content']}\n"
        )

    prompt = f"""
You are an AI assistant that answers ONLY from uploaded PDF documents.

IMPORTANT RULES:

1. The user has already uploaded documents.
2. Never ask the user to upload a PDF.
3. Never say:
   - "Please upload a PDF."
   - "I don't see any PDF."
   - "Provide the document."
4. Use ONLY the document context below.
5. If the answer is not present, say:
   "The uploaded documents do not contain this information."

Conversation:
{previous}

Document Context:
{context}

Question:
{question}

Answer:
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content