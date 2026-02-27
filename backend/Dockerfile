FROM python:3.11-slim
WORKDIR /app
# Install dependencies
RUN pip install --no-cache-dir fastapi uvicorn
# Copy code and start server
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
