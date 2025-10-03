FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# 1️⃣ Instala dependências do sistema para mysqlclient
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    libssl-dev \
    pkg-config \
    && apt-get clean

# 2️⃣ Copia requirements e instala pacotes Python
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 3️⃣ Copia o restante do código
COPY . /app/

# 4️⃣ Expõe a porta do Django/Gunicorn
EXPOSE 8000

# 5️⃣ Comando para rodar o Gunicorn
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
