from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from .database import Base  


class Usuario(Base):
    """
    Define a classe do modelo de usuário, herdando de Base (necessário para o SQLAlchemy)
    """
    __tablename__ = "usuarios"  # Nome da tabela no banco de dados

    id = Column(Integer, primary_key=True, index=True)    # Coluna ID: inteiro, chave primária, índice para buscas rápidas
    nome = Column(String(100), nullable=False)            # Coluna nome: texto até 100 caracteres, obrigatório
    email = Column(String(150), unique=True, nullable=False, index=True)  # Coluna e-mail: texto até 150, valor único, obrigatório, com índice (para buscas)
    senha_hash = Column(String(255), nullable=False)      # Coluna senha_hash: armazena o hash da senha do usuário, obrigatório
    data_criacao = Column(DateTime, default=func.now())   # Coluna data_criacao: armazena a data/hora da criação, pega horário atual por padrão
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())  # Coluna data_atualizacao: atualizada automaticamente toda vez que o registro é alterado
    ativo = Column(Boolean, default=True, index=True)     # Coluna ativo: indica se o usuário está ativo (True/False), valor padrão True, com índice para filtragem
