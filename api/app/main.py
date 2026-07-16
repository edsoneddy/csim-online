from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from csim import Compare
from csim.utils import group_by_exhaustive_search
import os
import uvicorn

class FileItem(BaseModel):
    name: str = Field(..., min_length=1, description="The name of the file")
    content: str = Field(
        ..., min_length=1, description="The source code or content of the file"
    )


class AnalysisRequest(BaseModel):
    lang: str = Field(
        ..., min_length=1, description="Programming language of the files"
    )
    threshold: float | None = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="Optional similarity threshold between 0.0 and 1.0",
    )
    files: list[FileItem] = Field(..., description="List of files to compare")


app = FastAPI(title="CSIM Online API")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://edsoneddy.github.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)

@app.get("/")
def read_root():
    return {"status": "API is running smoothly"}


@app.post("/api/analyze")
def analyze_similarity(data: AnalysisRequest):
    if len(data.files) != 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must provide exactly two files to compare similarity.",
        )

    file1 = data.files[0]
    file2 = data.files[1]

    similarity_index = Compare(
        name_a=file1.name,
        content_a=file1.content,
        name_b=file2.name,
        content_b=file2.content,
        lang=data.lang,
        ted_algorithm="apted",
    )

    return {
        "result": similarity_index,
    }

@app.post("/api/analyze-all")
def analyze_similarity_all(data: AnalysisRequest):
    if len(data.files) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must provide at least two files to compare similarity.",
        )

    language = data.lang
    threshold = data.threshold
    file_names = [file.name for file in data.files]
    file_contents = [file.content for file in data.files]

    similarity_groups, similarity_groups_avg, unique_groups, printable_output = group_by_exhaustive_search(
        file_names=file_names,
        file_contents=file_contents,
        lang=language,
        threshold=threshold,
        ted_algorithm="apted",
        printable_output=False
    )

    return {
        "similarity_groups": similarity_groups,
        "similarity_groups_avg": similarity_groups_avg,
        "unique_groups": unique_groups,
        "printable_output": printable_output
    }