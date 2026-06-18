import os
from PyPDF2 import PdfReader

def load_all_pdfs(data_folder):
    documents = []

    for filename in os.listdir(data_folder):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(
                data_folder,
                filename
            )

            reader = PdfReader(pdf_path)

            text = ""

            for page in reader.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text

            documents.append(
                {
                    "source": filename,
                    "text": text
                }
            )  

    return documents