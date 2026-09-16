from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# We use SQLite for the hackathon as it requires no separate server setup
# and stores everything in a local file (mandispread.db) inside the backend folder.
# It is extremely fast to set up and perfect for MVP prototypes.
SQLALCHEMY_DATABASE_URL = "sqlite:///./mandispread.db"

# Setting check_same_thread=False is needed for SQLite when used with FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# This creates a database session factory that we will use in our API routes
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All our database models will inherit from this Base class
Base = declarative_base()
