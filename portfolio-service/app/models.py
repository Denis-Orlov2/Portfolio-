from datetime import datetime
from typing import Literal, Optional, List
import re
from pydantic import BaseModel, Field, field_validator
from app.config import (
    NAME_MIN_LENGTH,
    NAME_MAX_LENGTH,
    MESSAGE_MIN_LENGTH,
    MESSAGE_MAX_LENGTH,
)

CategoryType = Literal["all", "html", "javascript", "python"]
ProjectCategory = Literal["html", "javascript", "python"]

EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
)

class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    category: ProjectCategory
    tech_stack: List[str]
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    code_snippet: str
    created_at: str

class ProjectsListResponse(BaseModel):
    items: List[ProjectResponse]
    total: int

class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=NAME_MIN_LENGTH, max_length=NAME_MAX_LENGTH)
    email: str = Field(...)
    message: str = Field(..., min_length=MESSAGE_MIN_LENGTH, max_length=MESSAGE_MAX_LENGTH)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        trimmed = v.strip()
        if len(trimmed) < NAME_MIN_LENGTH:
            raise ValueError("Имя должно содержать не менее 2 символов")
        if re.search(r"<[^>]*>", trimmed):
            raise ValueError("Имя не должно содержать HTML-теги")
        return trimmed

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        trimmed = v.strip().lower()
        if not EMAIL_REGEX.match(trimmed):
            raise ValueError("Некорректный формат адреса электронной почты")
        return trimmed

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        trimmed = v.strip()
        if len(trimmed) < MESSAGE_MIN_LENGTH:
            raise ValueError("Сообщение должно содержать не менее 10 символов")
        return trimmed

class ContactSuccessResponse(BaseModel):
    status: str = "success"
    message: str = "Сообщение успешно доставлено разработчику."

class HealthResponse(BaseModel):
    status: str = "healthy"
    database: str = "connected"
