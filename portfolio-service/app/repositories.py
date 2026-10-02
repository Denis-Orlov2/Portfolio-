import json
from typing import List, Optional
from app.database import get_db_connection
from app.models import ProjectResponse, CategoryType
from app.seed_data import SEED_PROJECTS

class ProjectRepository:
    @staticmethod
    async def seed_if_empty() -> None:
        async with await get_db_connection() as conn:
            cursor = await conn.execute("SELECT COUNT(*) FROM projects")
            row = await cursor.fetchone()
            count = row[0] if row else 0
            if count == 0:
                for p in SEED_PROJECTS:
                    await conn.execute(
                        """
                        INSERT INTO projects (title, description, category, tech_stack, github_url, demo_url, code_snippet)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            p["title"],
                            p["description"],
                            p["category"],
                            json.dumps(p["tech_stack"]),
                            p["github_url"],
                            p["demo_url"],
                            p["code_snippet"],
                        ),
                    )
                await conn.commit()

    @staticmethod
    async def get_all(category: CategoryType = "all") -> List[ProjectResponse]:
        async with await get_db_connection() as conn:
            if category != "all":
                cursor = await conn.execute(
                    "SELECT id, title, description, category, tech_stack, github_url, demo_url, code_snippet, created_at FROM projects WHERE category = ? ORDER BY id ASC",
                    (category,),
                )
            else:
                cursor = await conn.execute(
                    "SELECT id, title, description, category, tech_stack, github_url, demo_url, code_snippet, created_at FROM projects ORDER BY id ASC"
                )
            rows = await cursor.fetchall()
            items = []
            for r in rows:
                items.append(
                    ProjectResponse(
                        id=r["id"],
                        title=r["title"],
                        description=r["description"],
                        category=r["category"],
                        tech_stack=json.loads(r["tech_stack"]),
                        github_url=r["github_url"],
                        demo_url=r["demo_url"],
                        code_snippet=r["code_snippet"],
                        created_at=str(r["created_at"]),
                    )
                )
            return items

class ContactRepository:
    @staticmethod
    async def create(name: str, email: str, message: str, client_ip: Optional[str]) -> int:
        async with await get_db_connection() as conn:
            cursor = await conn.execute(
                """
                INSERT INTO contact_messages (name, email, message, client_ip)
                VALUES (?, ?, ?, ?)
                """,
                (name, email, message, client_ip),
            )
            await conn.commit()
            return cursor.lastrowid or 0
