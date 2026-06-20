from ollama import chat


def generate_answer(context, question):

    prompt = f"""
You are a helpful AI assistant.

Use ONLY the provided context to answer.

Context:
{context}

Question:
{question}

Answer:
"""

    response = chat(
        model="mistral",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]