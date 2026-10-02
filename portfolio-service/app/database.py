import aiosqlite
import logging
from app.config import DATABASE_PATH

logger = logging.getLogger(__name__)

CREATE_PROJECTS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('html', 'javascript', 'python')),
    tech_stack TEXT NOT NULL,
    github_url TEXT,
    demo_url TEXT,
    code_snippet TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

CREATE_CONTACTS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    client_ip TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

async def get_db_connection() -> aiosqlite.Connection:
    conn = await aiosqlite.connect(DATABASE_PATH)
    conn.row_factory = aiosqlite.Row
    return conn

async def init_db() -> None:
    logger.info("Initializing SQLite database at %s", DATABASE_PATH)
    async with await get_db_connection() as conn:
        await conn.execute(CREATE_PROJECTS_TABLE_SQL)
        await conn.execute(CREATE_CONTACTS_TABLE_SQL)
        await conn.commit()
    logger.info("Database initialized successfully.")
