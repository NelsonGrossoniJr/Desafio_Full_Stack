from pydantic import BaseModel, EmailStr
from datetime import datetime

class UsuarioBase(BaseModel):
    """
    Classe base para outros schemas relacionados a usuários, contendo apenas o campo de e-mail.
    """
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    """
    Schema utilizado para criação de um novo usuário (input de cadastro).
    """
    nome: str
    senha: str

class UsuarioLogin(UsuarioBase):
    """
    Schema utilizado para login do usuário (input de autenticação).
    """
    senha: str

class UsuarioResponse(UsuarioBase):
    """
    Schema de resposta ao cliente contendo todas as informações do usuário (output para frontend/API).
    """
    id: int
    nome: str
    data_criacao: datetime
    ativo: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    """
    Schema para os dados do token de autenticação retornado pela API.
    """
    access_token: str
    token_type: str