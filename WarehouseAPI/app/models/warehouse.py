from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String
from ..database import Base


class Warehouse(Base):
    __tablename__ = "warehouses"

    Id_Warehouse: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    Warehouse_Name: Mapped[str | None] = mapped_column(String(45))
    Location: Mapped[str | None] = mapped_column(String(45))
    Code: Mapped[str | None] = mapped_column(String(45))


