FROM python:3.13.2

WORKDIR /app/mechepro

# Install system dependencies (optional, depending on your needs, e.g., for psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./

RUN pip install -r requirements.txt --no-deps --no-cache-dir

COPY . /

EXPOSE 8000

CMD ["gunicorn", "mechepro.wsgi:application", "--bind", "0.0.0.0:8000"]