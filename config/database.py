"""
Database configuration and connection management.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from .settings import settings
import redis
from typing import Generator


def get_database_url() -> str:
    """Get database URL from settings."""
    return settings.database_url


def get_redis_url() -> str:
    """Get Redis URL from settings."""
    return settings.redis_url


# SQLAlchemy engine
engine = create_engine(
    get_database_url(),
    poolclass=QueuePool,
    pool_size=settings.database_pool_size,
    max_overflow=settings.database_max_overflow,
    pool_pre_ping=True,
    echo=settings.debug,
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db() -> Generator:
    """
    Dependency for getting database session.
    
    Usage:
        @app.get("/items")
        def read_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Redis connection
redis_client = redis.Redis.from_url(
    get_redis_url(),
    password=settings.redis_password,
    max_connections=settings.redis_max_connections,
    decode_responses=True,
)


def get_redis() -> redis.Redis:
    """Get Redis client instance."""
    return redis_client


def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)


def close_db_connections():
    """Close all database connections."""
    engine.dispose()
    redis_client.close()
