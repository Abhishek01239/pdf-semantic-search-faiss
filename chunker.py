try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except Exception:
    RecursiveCharacterTextSplitter = None


def create_chunks(text):
    """Split `text` into chunks. Use langchain's splitter when available,
    otherwise fall back to a simple Python implementation.
    """
    if RecursiveCharacterTextSplitter is not None:
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100
        )

        return splitter.split_text(text)

    # Fallback simple splitter
    chunk_size = 500
    chunk_overlap = 100
    if not text:
        return []

    chunks = []
    start = 0
    length = len(text)

    while start < length:
        end = start + chunk_size
        chunks.append(text[start:end])
        start = max(0, end - chunk_overlap)

    return chunks

