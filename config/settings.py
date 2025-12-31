"""
Production-grade settings management using Pydantic.
"""

from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import List, Optional
from functools import lru_cache
import os


class Settings(BaseSettings):
    """Application settings with validation."""

    # Application
    app_name: str = Field(default="Web3 Accounting Enterprise", env="APP_NAME")
    app_version: str = Field(default="1.0.0", env="APP_VERSION")
    environment: str = Field(default="production", env="ENVIRONMENT")
    debug: bool = Field(default=False, env="DEBUG")
    secret_key: str = Field(..., env="SECRET_KEY")

    # Server
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8000, env="PORT")
    workers: int = Field(default=4, env="WORKERS")
    reload: bool = Field(default=False, env="RELOAD")

    # Database
    database_url: str = Field(..., env="DATABASE_URL")
    database_pool_size: int = Field(default=20, env="DATABASE_POOL_SIZE")
    database_max_overflow: int = Field(default=10, env="DATABASE_MAX_OVERFLOW")

    # Redis
    redis_url: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    redis_password: Optional[str] = Field(default=None, env="REDIS_PASSWORD")
    redis_max_connections: int = Field(default=50, env="REDIS_MAX_CONNECTIONS")

    # Blockchain
    blockchain_storage_path: str = Field(default="./blockchain_data", env="BLOCKCHAIN_STORAGE_PATH")
    blockchain_backup_path: str = Field(default="./blockchain_backups", env="BLOCKCHAIN_BACKUP_PATH")
    auto_backup_enabled: bool = Field(default=True, env="AUTO_BACKUP_ENABLED")
    backup_interval_hours: int = Field(default=24, env="BACKUP_INTERVAL_HOURS")

    # Security
    jwt_secret_key: str = Field(..., env="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", env="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(default=7, env="REFRESH_TOKEN_EXPIRE_DAYS")
    password_min_length: int = Field(default=12, env="PASSWORD_MIN_LENGTH")
    require_2fa: bool = Field(default=True, env="REQUIRE_2FA")

    # CORS
    cors_origins: List[str] = Field(default=["*"], env="CORS_ORIGINS")
    cors_allow_credentials: bool = Field(default=True, env="CORS_ALLOW_CREDENTIALS")

    # Rate Limiting
    rate_limit_enabled: bool = Field(default=True, env="RATE_LIMIT_ENABLED")
    rate_limit_per_minute: int = Field(default=60, env="RATE_LIMIT_PER_MINUTE")
    rate_limit_per_hour: int = Field(default=1000, env="RATE_LIMIT_PER_HOUR")

    # Email
    smtp_host: str = Field(default="smtp.gmail.com", env="SMTP_HOST")
    smtp_port: int = Field(default=587, env="SMTP_PORT")
    smtp_user: Optional[str] = Field(default=None, env="SMTP_USER")
    smtp_password: Optional[str] = Field(default=None, env="SMTP_PASSWORD")
    smtp_from_email: str = Field(default="noreply@example.com", env="SMTP_FROM_EMAIL")
    smtp_from_name: str = Field(default="Web3 Accounting", env="SMTP_FROM_NAME")

    # Twilio
    twilio_account_sid: Optional[str] = Field(default=None, env="TWILIO_ACCOUNT_SID")
    twilio_auth_token: Optional[str] = Field(default=None, env="TWILIO_AUTH_TOKEN")
    twilio_phone_number: Optional[str] = Field(default=None, env="TWILIO_PHONE_NUMBER")

    # Stripe
    stripe_public_key: Optional[str] = Field(default=None, env="STRIPE_PUBLIC_KEY")
    stripe_secret_key: Optional[str] = Field(default=None, env="STRIPE_SECRET_KEY")
    stripe_webhook_secret: Optional[str] = Field(default=None, env="STRIPE_WEBHOOK_SECRET")

    # AWS
    aws_access_key_id: Optional[str] = Field(default=None, env="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: Optional[str] = Field(default=None, env="AWS_SECRET_ACCESS_KEY")
    aws_region: str = Field(default="us-east-1", env="AWS_REGION")
    aws_s3_bucket: Optional[str] = Field(default=None, env="AWS_S3_BUCKET")

    # Monitoring
    sentry_dsn: Optional[str] = Field(default=None, env="SENTRY_DSN")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_file_path: str = Field(default="./logs/app.log", env="LOG_FILE_PATH")
    log_rotation_size_mb: int = Field(default=100, env="LOG_ROTATION_SIZE_MB")
    log_retention_days: int = Field(default=30, env="LOG_RETENTION_DAYS")

    # Analytics
    google_analytics_id: Optional[str] = Field(default=None, env="GOOGLE_ANALYTICS_ID")
    mixpanel_token: Optional[str] = Field(default=None, env="MIXPANEL_TOKEN")

    # Web3
    web3_provider_url: Optional[str] = Field(default=None, env="WEB3_PROVIDER_URL")
    chain_id: int = Field(default=1, env="CHAIN_ID")
    gas_limit: int = Field(default=300000, env="GAS_LIMIT")
    max_gas_price_gwei: int = Field(default=100, env="MAX_GAS_PRICE_GWEI")

    # Multi-tenancy
    multi_tenant_enabled: bool = Field(default=True, env="MULTI_TENANT_ENABLED")
    max_organizations_per_user: int = Field(default=5, env="MAX_ORGANIZATIONS_PER_USER")
    default_organization_storage_gb: int = Field(default=100, env="DEFAULT_ORGANIZATION_STORAGE_GB")

    # Compliance
    audit_log_retention_years: int = Field(default=7, env="AUDIT_LOG_RETENTION_YEARS")
    compliance_mode: str = Field(default="strict", env="COMPLIANCE_MODE")
    default_accounting_standard: str = Field(default="IFRS", env="DEFAULT_ACCOUNTING_STANDARD")
    default_audit_standard: str = Field(default="ISA", env="DEFAULT_AUDIT_STANDARD")

    # Feature Flags
    enable_ai_analytics: bool = Field(default=True, env="ENABLE_AI_ANALYTICS")
    enable_auto_classification: bool = Field(default=True, env="ENABLE_AUTO_CLASSIFICATION")
    enable_mobile_app: bool = Field(default=True, env="ENABLE_MOBILE_APP")
    enable_api_access: bool = Field(default=True, env="ENABLE_API_ACCESS")
    enable_webhooks: bool = Field(default=True, env="ENABLE_WEBHOOKS")

    # API Keys
    openai_api_key: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    plaid_client_id: Optional[str] = Field(default=None, env="PLAID_CLIENT_ID")
    plaid_secret: Optional[str] = Field(default=None, env="PLAID_SECRET")

    # Performance
    cache_ttl_seconds: int = Field(default=300, env="CACHE_TTL_SECONDS")
    enable_query_cache: bool = Field(default=True, env="ENABLE_QUERY_CACHE")
    max_upload_size_mb: int = Field(default=50, env="MAX_UPLOAD_SIZE_MB")
    max_concurrent_requests: int = Field(default=100, env="MAX_CONCURRENT_REQUESTS")

    # Localization
    default_language: str = Field(default="en", env="DEFAULT_LANGUAGE")
    default_timezone: str = Field(default="UTC", env="DEFAULT_TIMEZONE")
    supported_languages: List[str] = Field(default=["en", "ar"], env="SUPPORTED_LANGUAGES")

    # License
    license_key: Optional[str] = Field(default=None, env="LICENSE_KEY")
    license_type: str = Field(default="enterprise", env="LICENSE_TYPE")
    max_users: str = Field(default="unlimited", env="MAX_USERS")
    license_expiry_date: Optional[str] = Field(default=None, env="LICENSE_EXPIRY_DATE")

    # Support
    support_email: str = Field(default="support@example.com", env="SUPPORT_EMAIL")
    support_phone: Optional[str] = Field(default=None, env="SUPPORT_PHONE")
    company_name: str = Field(default="Your Company", env="COMPANY_NAME")
    company_website: str = Field(default="https://example.com", env="COMPANY_WEBSITE")

    @validator("cors_origins", pre=True)
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    @validator("supported_languages", pre=True)
    def parse_supported_languages(cls, v):
        """Parse supported languages from string or list."""
        if isinstance(v, str):
            return [lang.strip() for lang in v.split(",")]
        return v

    @validator("environment")
    def validate_environment(cls, v):
        """Validate environment value."""
        allowed = ["development", "staging", "production"]
        if v not in allowed:
            raise ValueError(f"Environment must be one of {allowed}")
        return v

    @validator("log_level")
    def validate_log_level(cls, v):
        """Validate log level."""
        allowed = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in allowed:
            raise ValueError(f"Log level must be one of {allowed}")
        return v.upper()

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
