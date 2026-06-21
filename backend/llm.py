from ollama import chat


def generate_answer(history,context, question):

    previous = ""

    for message in history:
        previous += (
            f"{message['role']}:"
            f"{message['content']}\n"
        )
    prompt = f"""
Conversation History: {previous}

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