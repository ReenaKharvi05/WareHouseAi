from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Any, Dict


security_scheme = HTTPBearer(auto_error=False)


def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme)) -> Dict[str, Any]:
    if credentials is None or not credentials.scheme or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = credentials.credentials
    try:
        import jwt  # type: ignore
        payload = jwt.decode(token, "dev-secret", algorithms=["HS256"])  # matches login encoder
        user_id = payload.get("sub")
        role = payload.get("role")
        if user_id is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": int(user_id), "role": str(role)}
    except HTTPException:
        raise
    except Exception:
        # Fallback for unsigned dev tokens like token-<id>
        if token.startswith("token-"):
            try:
                user_id = int(token.split("-", 1)[1])
                return {"id": user_id, "role": "Inspector"}
            except Exception:
                pass
        raise HTTPException(status_code=401, detail="Could not validate credentials")


