from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    senha_hash = Column(String(255), nullable=False)
    data_criacao = Column(DateTime, default=func.now())
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())
    ativo = Column(Boolean, default=True, index=True)

    topicos = relationship("Topico", back_populates="autor")
    mensagens = relationship("Mensagem", back_populates="autor")   # <-- ADICIONADO

class Topico(Base):
    __tablename__ = "topicos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False)
    conteudo = Column(Text, nullable=False)
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())
    autor_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    autor = relationship("Usuario", back_populates="topicos")
    mensagens = relationship("Mensagem", back_populates="topico")  # <-- ADICIONADO

class Mensagem(Base):
    __tablename__ = "mensagens"

    id = Column(Integer, primary_key=True, index=True)
    conteudo = Column(Text, nullable=False)
    data_criacao = Column(DateTime, default=func.now())
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    topico_id = Column(Integer, ForeignKey("topicos.id"), nullable=False)

    autor = relationship("Usuario", back_populates="mensagens")
    topico = relationship("Topico", back_populates="mensagens")