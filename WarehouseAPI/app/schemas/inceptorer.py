from pydantic import BaseModel
from typing import Optional 

class InspectionFormBase(BaseModel):
    NatureOfAgreement: Optional[str] = None
    AgreementIsValid: Optional[str] = None
    PremisesDetails: Optional[str] = None
    StockAndKey: Optional[str] = None
    DoorsAndWindows: Optional[str] = None
    AnyDamageInStructure: Optional[str] = None
    WaterLogging: Optional[str] = None
    VentilationAvailable: Optional[str] = None
    ElectricalFittings: Optional[str] = None
    SignsOfSeepage: Optional[str] = None
    SignsOfInfestation: Optional[str] = None
    TypeOfConstruction: Optional[str] = None
    ConditionOfRoof: Optional[str] = None
    PuccaWall: Optional[str] = None
    SurroundingAreaWithWater: Optional[str] = None
    HistoryOfFlooding: Optional[str] = None
    LicenseOfFSSAI: Optional[str] = None
    PhysicalStockMatch: Optional[str] = None
    CommodityVarietyMatch: Optional[str] = None
    AverageSizeOfBagPresent: Optional[str] = None
    StacksAreProperlyArranged: Optional[str] = None
    StackAndLotCards: Optional[str] = None
    LenderNameDIsplayed: Optional[str] = None
    StockRegisterIsUpdated: Optional[str] = None
    CopiesOfDocsAvailable: Optional[str] = None
    StockFoundOverlapping: Optional[str] = None
    AdulteratedCommodity: Optional[str] = None
    UnrecoveredStock: Optional[str] = None
    LastFumigationRecord: Optional[str] = None
    RandomSamplesTaken: Optional[str] = None
    InfestationObservedInStock: Optional[str] = None
    NameOfStorageInCharge: Optional[str] = None
    InChargeWearingId: Optional[str] = None
    CMServiceStaffVisit: Optional[str] = None
    LastInspectionDone: Optional[str] = None
    Selection: Optional[str] = None
    Remark: Optional[str] = None
    Images: Optional[str] = None
    Status: Optional[str] = None
    inspector_id: Optional[int] = None

class InspectionFormCreate(InspectionFormBase):
    pass

class InspectionFormUpdate(InspectionFormBase):
    pass

class InspectionFormResponse(InspectionFormBase):
    idinspector_inspectionform: int

    class Config:
        from_attributes = True