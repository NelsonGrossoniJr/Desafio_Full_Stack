from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional  # <- Adicionado Optional

# --- USUÁRIO SCHEMA ---
class UsuarioBase(BaseModel):
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    nome: str
    senha: str

class UsuarioLogin(UsuarioBase):
    senha: str

# --- TÓPICO SCHEMA ---
class TopicoBase(BaseModel):
    titulo: str
    conteudo: str
    categoria: Optional[str] = None   # <- Adicionado

class TopicoCreate(TopicoBase):
    pass  # NÃO inclui mais autor_id, pois será atribuído no backend via usuário autenticado

class TopicoResponse(TopicoBase):
    id: int
    data_criacao: datetime
    autor_id: int

    class Config:
        from_attributes = True

# --- USUÁRIO SCHEMA ---
class UsuarioResponse(UsuarioBase):
    id: int
    nome: str
    data_criacao: datetime
    ativo: bool
    topicos: List[TopicoResponse] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# --- MENSAGEM SCHEMA ---
class MensagemBase(BaseModel):
    conteudo: str

class MensagemCreate(MensagemBase):
    topico_id: int  # Ao criar, o usuário autenticado já está associado, só precisa informar o tópico

# Novo schema para informações básicas do tópico
class TopicoInfo(BaseModel):
    id: int
    titulo: str
    categoria: Optional[str] = None

    class Config:
        from_attributes = True

class MensagemResponse(MensagemBase):
    id: int
    data_criacao: datetime
    usuario_id: int
    topico_id: int
    topico: Optional[TopicoInfo] = None  # Adicionando informações do tópico

    class Config:
        from_attributes = True