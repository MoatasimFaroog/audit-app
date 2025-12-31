"""
Logging configuration for production environment.
"""

import logging
import logging.handlers
import sys
from pathlib import Path
from .settings import settings


def setup_logging():
    """Configure logging for the application."""
    
    # Create logs directory if it doesn't exist
    log_dir = Path(settings.log_file_path).parent
    log_dir.mkdir(parents=True, exist_ok=True)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.log_level))
    
    # Remove existing handlers
    root_logger.handlers.clear()
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, settings.log_level))
    console_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(console_formatter)
    root_logger.addHandler(console_handler)
    
    # File handler with rotation
    file_handler = logging.handlers.RotatingFileHandler(
        settings.log_file_path,
        maxBytes=settings.log_rotation_size_mb * 1024 * 1024,
        backupCount=settings.log_retention_days,
        encoding='utf-8'
    )
    file_handler.setLevel(getattr(logging, settings.log_level))
    file_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    file_handler.setFormatter(file_formatter)
    root_logger.addHandler(file_handler)
    
    # JSON handler for structured logging (production)
    if settings.environment == "production":
        try:
            import json_log_formatter
            
            json_handler = logging.handlers.RotatingFileHandler(
                str(log_dir / "app.json.log"),
                maxBytes=settings.log_rotation_size_mb * 1024 * 1024,
                backupCount=settings.log_retention_days,
                encoding='utf-8'
            )
            json_handler.setFormatter(json_log_formatter.JSONFormatter())
            root_logger.addHandler(json_handler)
        except ImportError:
            pass
    
    # Configure third-party loggers
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy").setLevel(logging.WARNING)
    logging.getLogger("fastapi").setLevel(logging.INFO)
    
    logging.info(f"Logging configured - Level: {settings.log_level}, Environment: {settings.environment}")


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance."""
    return logging.getLogger(name)
