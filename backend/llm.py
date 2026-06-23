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
Conversation History:
{previous}

Context:
{context}

Question:
{question}

Answer:
"""

    response = client.chat.completions.create(
        model=
        "llama-3.3-70b-versatile",

        messages=[
            {
                "role":
                "user",

                "content":
                prompt
            }
        ],

        temperature=0.3
    )

    return response.choices[0].message.content