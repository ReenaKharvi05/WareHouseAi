from typing import Optional
import datetime
import decimal

from sqlalchemy import DECIMAL, DateTime, Float, ForeignKeyConstraint, Index, Integer, String, TIMESTAMP, Text, text
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass


class Commoditymaster(Base):
    __tablename__ = 'commoditymaster'

    IdCommodity: Mapped[int] = mapped_column(Integer, primary_key=True)
    Commodity_Name: Mapped[Optional[str]] = mapped_column(String(45))
    CommodityStorage: Mapped[Optional[str]] = mapped_column(String(45))
    Description: Mapped[Optional[str]] = mapped_column(String(255))
    IsActive: Mapped[Optional[int]] = mapped_column(Integer, server_default=text("'1'"))
    CreatedAt: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    Category: Mapped[Optional[str]] = mapped_column(String(45))

    inspections: Mapped[list['Inspections']] = relationship('Inspections', back_populates='commoditymaster')


class Questions(Base):
    __tablename__ = 'questions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    text_: Mapped[str] = mapped_column('text', String(500), nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(100))
    risk_weight: Mapped[Optional[float]] = mapped_column(Float, server_default=text("'1'"))

    inspection_answers: Mapped[list['InspectionAnswers']] = relationship('InspectionAnswers', back_populates='question')


class Users(Base):
    __tablename__ = 'users'

    idusers: Mapped[int] = mapped_column(Integer, primary_key=True)
    UserName: Mapped[Optional[str]] = mapped_column(String(45))
    Full_Name: Mapped[Optional[str]] = mapped_column(String(45))
    Role: Mapped[Optional[str]] = mapped_column(String(45))
    EmailId: Mapped[Optional[str]] = mapped_column(String(45))
    Password: Mapped[Optional[str]] = mapped_column(String(45))
    Is_Active: Mapped[Optional[int]] = mapped_column(Integer, server_default=text("'1'"))

    inspector_inspectionform: Mapped[list['InspectorInspectionform']] = relationship('InspectorInspectionform', back_populates='inspector')
    managers: Mapped[list['Managers']] = relationship('Managers', back_populates='users')
    inspections: Mapped[list['Inspections']] = relationship('Inspections', back_populates='users')
    user_warehouse_map: Mapped[list['UserWarehouseMap']] = relationship('UserWarehouseMap', back_populates='User')


class Warehouses(Base):
    __tablename__ = 'warehouses'

    Id_Warehouse: Mapped[int] = mapped_column(Integer, primary_key=True)
    Warehouse_Name: Mapped[Optional[str]] = mapped_column(String(45))
    Location: Mapped[Optional[str]] = mapped_column(String(45))
    Code: Mapped[Optional[str]] = mapped_column(String(45))
    Capacity: Mapped[Optional[int]] = mapped_column(Integer)
    Latitude: Mapped[Optional[decimal.Decimal]] = mapped_column(DECIMAL(10, 6))
    Longitude: Mapped[Optional[decimal.Decimal]] = mapped_column(DECIMAL(10, 6))

    inspections: Mapped[list['Inspections']] = relationship('Inspections', back_populates='warehouses')
    user_warehouse_map: Mapped[list['UserWarehouseMap']] = relationship('UserWarehouseMap', back_populates='Warehouse')


class InspectorInspectionform(Base):
    __tablename__ = 'inspector_inspectionform'
    __table_args__ = (
        ForeignKeyConstraint(['inspector_id'], ['users.idusers'], name='fk_inspectorId_idinspector'),
        Index('fk_inspectorId_idinspector_idx', 'inspector_id')
    )

    idinspector_inspectionform: Mapped[int] = mapped_column(Integer, primary_key=True)
    inspector_id: Mapped[int] = mapped_column(Integer, nullable=False)
    NatureOfAgreement: Mapped[Optional[str]] = mapped_column(String(45))
    AgreementIsValid: Mapped[Optional[str]] = mapped_column(String(45))
    PremisesDetails: Mapped[Optional[str]] = mapped_column(String(45))
    StockAndKey: Mapped[Optional[str]] = mapped_column(String(45))
    DoorsAndWindows: Mapped[Optional[str]] = mapped_column(String(45))
    AnyDamageInStructure: Mapped[Optional[str]] = mapped_column(String(45))
    WaterLogging: Mapped[Optional[str]] = mapped_column(String(45))
    VentilationAvailable: Mapped[Optional[str]] = mapped_column(String(45))
    ElectricalFittings: Mapped[Optional[str]] = mapped_column(String(45))
    SignsOfSeepage: Mapped[Optional[str]] = mapped_column(String(45))
    SignsOfInfestation: Mapped[Optional[str]] = mapped_column(String(45))
    TypeOfConstruction: Mapped[Optional[str]] = mapped_column(String(45))
    ConditionOfRoof: Mapped[Optional[str]] = mapped_column(String(45))
    PuccaWall: Mapped[Optional[str]] = mapped_column(String(45))
    SurroundingAreaWithWater: Mapped[Optional[str]] = mapped_column(String(45))
    HistoryOfFlooding: Mapped[Optional[str]] = mapped_column(String(45))
    LicenseOfFSSAI: Mapped[Optional[str]] = mapped_column(String(45))
    PhysicalStockMatch: Mapped[Optional[str]] = mapped_column(String(45))
    CommodityVarietyMatch: Mapped[Optional[str]] = mapped_column(String(45))
    AverageSizeOfBagPresent: Mapped[Optional[str]] = mapped_column(String(45))
    StacksAreProperlyArranged: Mapped[Optional[str]] = mapped_column(String(45))
    StackAndLotCards: Mapped[Optional[str]] = mapped_column(String(45))
    LenderNameDIsplayed: Mapped[Optional[str]] = mapped_column(String(45))
    StockRegisterIsUpdated: Mapped[Optional[str]] = mapped_column(String(45))
    CopiesOfDocsAvailable: Mapped[Optional[str]] = mapped_column(String(45))
    StockFoundOverlapping: Mapped[Optional[str]] = mapped_column(String(45))
    AdulteratedCommodity: Mapped[Optional[str]] = mapped_column(String(45))
    UnrecoveredStock: Mapped[Optional[str]] = mapped_column(String(45))
    LastFumigationRecord: Mapped[Optional[str]] = mapped_column(String(45))
    RandomSamplesTaken: Mapped[Optional[str]] = mapped_column(String(45))
    InfestationObservedInStock: Mapped[Optional[str]] = mapped_column(String(45))
    NameOfStorageInCharge: Mapped[Optional[str]] = mapped_column(String(45))
    InChargeWearingId: Mapped[Optional[str]] = mapped_column(String(45))
    CMServiceStaffVisit: Mapped[Optional[str]] = mapped_column(String(45))
    LastInspectionDone: Mapped[Optional[str]] = mapped_column(String(45))
    Selection: Mapped[Optional[str]] = mapped_column(String(45))
    Remark: Mapped[Optional[str]] = mapped_column(String(45))
    Images: Mapped[Optional[str]] = mapped_column(String(45))
    Status: Mapped[Optional[str]] = mapped_column(String(45))

    inspector: Mapped['Users'] = relationship('Users', back_populates='inspector_inspectionform')


class Managers(Base):
    __tablename__ = 'managers'
    __table_args__ = (
        ForeignKeyConstraint(['User_Id'], ['users.idusers'], name='fk_userId_Users'),
        Index('fk_userId_Users_idx', 'User_Id')
    )

    Id_Manager: Mapped[int] = mapped_column(Integer, primary_key=True)
    User_Id: Mapped[int] = mapped_column(Integer, nullable=False)
    Department: Mapped[Optional[str]] = mapped_column(String(45))

    users: Mapped['Users'] = relationship('Users', back_populates='managers')
    inspections: Mapped[list['Inspections']] = relationship('Inspections', back_populates='managers')
    user_warehouse_map: Mapped[list['UserWarehouseMap']] = relationship('UserWarehouseMap', back_populates='Manager')


class Inspections(Base):
    __tablename__ = 'inspections'
    __table_args__ = (
        ForeignKeyConstraint(['Commodity_Id'], ['commoditymaster.IdCommodity'], name='inspections_ibfk_1'),
        ForeignKeyConstraint(['Inspector_Id'], ['users.idusers'], name='fk_inspectorId_IdUser'),
        ForeignKeyConstraint(['Manager_Id'], ['managers.Id_Manager'], name='fk_managerId'),
        ForeignKeyConstraint(['Warehouse_Id'], ['warehouses.Id_Warehouse'], name='fk_warehouseId_Idwarehouse'),
        Index('Commodity_Id', 'Commodity_Id'),
        Index('fk_inspectorId_IdUser_idx', 'Inspector_Id'),
        Index('fk_managerId_IdManager_idx', 'Manager_Id'),
        Index('fk_warehouseId_Idwarehouse_idx', 'Warehouse_Id')
    )

    Id_Inspections: Mapped[int] = mapped_column(Integer, primary_key=True)
    Warehouse_Id: Mapped[int] = mapped_column(Integer, nullable=False)
    Inspector_Id: Mapped[int] = mapped_column(Integer, nullable=False)
    Manager_Id: Mapped[int] = mapped_column(Integer, nullable=False)
    Created_At: Mapped[Optional[datetime.datetime]] = mapped_column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'))
    Data: Mapped[Optional[str]] = mapped_column(String(9000))
    Status: Mapped[Optional[str]] = mapped_column(String(45))
    Remarks: Mapped[Optional[str]] = mapped_column(String(45))
    Commodity_Id: Mapped[Optional[int]] = mapped_column(Integer)
    Risk_Score: Mapped[Optional[float]] = mapped_column(Float, server_default=text("'0'"))
    Completed_At: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    Manager_Approved: Mapped[Optional[int]] = mapped_column(TINYINT(1), server_default=text("'0'"))
    Manager_Approved_At: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    Manager_Remarks: Mapped[Optional[str]] = mapped_column(Text)

    commoditymaster: Mapped[Optional['Commoditymaster']] = relationship('Commoditymaster', back_populates='inspections')
    users: Mapped['Users'] = relationship('Users', back_populates='inspections')
    managers: Mapped['Managers'] = relationship('Managers', back_populates='inspections')
    warehouses: Mapped['Warehouses'] = relationship('Warehouses', back_populates='inspections')
    inspection_answers: Mapped[list['InspectionAnswers']] = relationship('InspectionAnswers', back_populates='inspection')


class UserWarehouseMap(Base):
    __tablename__ = 'user_warehouse_map'
    __table_args__ = (
        ForeignKeyConstraint(['Manager_id'], ['managers.Id_Manager'], name='fk_managerId_IdManager'),
        ForeignKeyConstraint(['User_id'], ['users.idusers'], name='fk_userid_IdUser'),
        ForeignKeyConstraint(['Warehouse_id'], ['warehouses.Id_Warehouse'], name='fk_warehouse_id'),
        Index('fk_managerId_IdManager_idx', 'Manager_id'),
        Index('fk_userid_IdUser_idx', 'User_id'),
        Index('fk_warehouse_id_idx', 'Warehouse_id')
    )

    Id_User_Warehouse_Map: Mapped[int] = mapped_column(Integer, primary_key=True)
    User_id: Mapped[int] = mapped_column(Integer, nullable=False)
    Warehouse_id: Mapped[int] = mapped_column(Integer, nullable=False)
    Manager_id: Mapped[int] = mapped_column(Integer, nullable=False)

    Manager: Mapped['Managers'] = relationship('Managers', back_populates='user_warehouse_map')
    User: Mapped['Users'] = relationship('Users', back_populates='user_warehouse_map')
    Warehouse: Mapped['Warehouses'] = relationship('Warehouses', back_populates='user_warehouse_map')


class InspectionAnswers(Base):
    __tablename__ = 'inspection_answers'
    __table_args__ = (
        ForeignKeyConstraint(['inspection_id'], ['inspections.Id_Inspections'], ondelete='CASCADE', name='inspection_answers_ibfk_1'),
        ForeignKeyConstraint(['question_id'], ['questions.id'], ondelete='CASCADE', name='inspection_answers_ibfk_2'),
        Index('inspection_id', 'inspection_id'),
        Index('question_id', 'question_id')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    inspection_id: Mapped[int] = mapped_column(Integer, nullable=False)
    question_id: Mapped[int] = mapped_column(Integer, nullable=False)
    answer: Mapped[Optional[str]] = mapped_column(String(255))
    remarks: Mapped[Optional[str]] = mapped_column(Text)

    inspection: Mapped['Inspections'] = relationship('Inspections', back_populates='inspection_answers')
    question: Mapped['Questions'] = relationship('Questions', back_populates='inspection_answers')
