# Portfolio Service Backend (FastAPI + SQLite)

Асинхронный бэкенд на Python 3.11+ / FastAPI с Pydantic-валидацией, SQLite хранилищем и REST API.

## Установка и запуск

1. Создать виртуальное окружение:
```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Установить зависимости:
```bash
pip install -r requirements.txt
```

3. Запустить сервер:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

4. Документация API (Swagger UI):
Откройте в браузере: `http://127.0.0.1:8000/docs`
