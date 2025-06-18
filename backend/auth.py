from datetime import datetime, timedelta  
from typing import Optional               

from jose import JWTError, jwt            
from passlib.context import CryptContext  

# Configurações de segurança
SECRET_KEY = "1234-1234-1234-1234"        # Chave secreta para assinar/validar tokens JWT 
ALGORITHM = "HS256"                   # Algoritmo para assinatura do JWT
ACCESS_TOKEN_EXPIRE_MINUTES = 5          # Expiração padrão do token em minutos

# Cria contexto do bcrypt para hashing e verificação de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """
    Compara senha informada (plain_password) com o hash salvo (hashed_password)
    Retorna True se coincidir, False caso contrário.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """
    Gera hash seguro para uma senha simples (padrão BCrypt).
    Usado ao cadastrar ou trocar senha.
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Cria um JWT assinado contendo os dados informados.
    - data: conteúdo do token (ex: {"sub": "username"})
    - expires_delta: quanto tempo até o token expirar (pode ser customizado)
    """
    to_encode = data.copy()  # Garante que o dicionário original não será alterado
    if expires_delta:
        expire = datetime.utcnow() + expires_delta  # Usa o tempo informado
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)  # Usa padrão (30min)
    to_encode.update({"exp": expire})  # Inclui informação de expiração no token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  # Gera token JWT assinado
    return encoded_jwt  # Retorna o token gerado

def decode_access_token(token: str):
    """
    Decodifica e valida um token JWT.
    - Se válido, retorna os dados contidos no token
    - Se inválido ou expirado, retorna None
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])  # Tenta decodificar e validar
        return payload
    except JWTError:
        return None  # Se der erro (ex: token inválido ou expirado), retorna None