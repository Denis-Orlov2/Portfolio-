import logging
from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, Query, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import init_db, get_db_connection
from app.models import (
    ProjectsListResponse,
    ContactMessageCreate,
    ContactSuccessResponse,
    HealthResponse,
    CategoryType,
)
from app.repositories import ProjectRepository, ContactRepository

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("portfolio.api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: init DB and seed initial projects
    await init_db()
    await ProjectRepository.seed_if_empty()
    logger.info("Application startup completed.")
    yield
    logger.info("Application shutdown.")

app = FastAPI(
    title="Developer Portfolio API",
    description="REST API сервиса портфолио разработчика с каталогом проектов и контактной формой",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get(
    "/api/v1/projects",
    response_model=ProjectsListResponse,
    status_code=status.HTTP_200_OK,
    summary="Получить список проектов с фильтрацией по категориям",
)
async def list_projects(
    category: CategoryType = Query("all", description="Категория: all, html, javascript, python")
):
    try:
        items = await ProjectRepository.get_all(category=category)
        return ProjectsListResponse(items=items, total=len(items))
    except Exception as exc:
        logger.error(f"Error fetching projects: {exc}")
        raise HTTPException(status_code=500, detail="Ошибка при получении списка проектов")

@app.post(
    "/api/v1/contacts",
    response_model=ContactSuccessResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Отправить обращение через контактную форму",
)
async def create_contact_message(
    payload: ContactMessageCreate,
    request: Request,
):
    try:
        client_ip = request.client.host if request.client else None
        await ContactRepository.create(
            name=payload.name,
            email=payload.email,
            message=payload.message,
            client_ip=client_ip,
        )
        return ContactSuccessResponse()
    except Exception as exc:
        logger.error(f"Error creating contact message: {exc}")
        raise HTTPException(status_code=500, detail="Сбой записи в базу данных.")

@app.get(
    "/api/v1/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Проверка работоспособности сервиса",
)
async def health_check():
    try:
        async with await get_db_connection() as conn:
            await conn.execute("SELECT 1")
        return HealthResponse(status="healthy", database="connected")
    except Exception as exc:
        logger.error(f"Health check failed: {exc}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unhealthy", "database": "disconnected"},
        )
