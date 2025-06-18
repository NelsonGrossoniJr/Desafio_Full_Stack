from datetime import timedelta  # Importa timedelta para controle de expiração do token
from fastapi import FastAPI, Depends, HTTPException, status  # Importa FastAPI e utilitários de dependências/Exceções
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm  # Importa classes de segurança OAuth2
from sqlalchemy.orm import Session  # Importa a sessão do ORM do SQLAlchemy
from fastapi.middleware.cors import CORSMiddleware  # Importa o middleware de CORS do FastAPI

from . import models, schemas, auth, database  # Importa módulos locais: modelos, schemas, autenticação e banco

# Criação do banco de dados e tabelas (apenas para desenvolvimento inicial)
database.Base.metadata.create_all(bind=database.engine)  # Cria as tabelas no banco se ainda não existirem

app = FastAPI()  # Instancia o aplicativo FastAPI

# Definição dos domínios/origens permitidos para CORS (exemplo: front-end local)
origins = [
    "http://localhost:3000",  # Porta padrão do React dev server
    "http://localhost:5173",  # Porta padrão do Vite dev server
    # Adicione aqui a URL de deploy do seu frontend em produção
]

# Adiciona o middleware CORS para permitir requisições de outros domínios (ex: frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Lista de origens permitidas que podem acessar a API
    allow_credentials=True,       # Permite envio de cookies/autenticação via CORS
    allow_methods=["*"],          # Permite todos os métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],          # Permite todos os headers nas requisições
)

# Configura o esquema OAuth2 para autenticação usando tokens Bearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # tokenUrl define a rota de obtenção do token

@app.post("/register", response_model=schemas.UsuarioResponse)
def register_user(user: schemas.UsuarioCreate, db: Session = Depends(database.get_db)):
    """
    Rota para registrar um novo usuário no sistema.
    Recebe os dados do usuário, verifica se o e-mail já está cadastrado,
    cria uma nova entrada na tabela de usuários e retorna os dados do usuário criado.
    """
    db_user = db.query(models.Usuario).filter(models.Usuario.email == user.email).first()  # Busca usuário pelo e-mail
    if db_user:
        raise HTTPException(status_code=400, detail="Email já registrado")  # Email já existe na base

    hashed_password = auth.get_password_hash(user.senha)  # Gera hash da senha recebida
    db_user = models.Usuario(nome=user.nome, email=user.email, senha_hash=hashed_password)  # Instancia novo usuário
    db.add(db_user)   # Adiciona usuário na sessão do banco
    db.commit()       # Salva as alterações no banco
    db.refresh(db_user)  # Atualiza db_user com dados gerados no banco, como o ID
    return db_user    # Retorna usuário cadastrado

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    """
    Rota para autenticação de usuário e geração do token de acesso.
    Recebe as credenciais do usuário, valida e retorna um token JWT caso os dados estejam corretos.
    """
    user = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()  # Busca usuário pelo e-mail
    if not user or not auth.verify_password(form_data.password, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )  # Usuário não existe ou senha incorreta

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)  # Define tempo de expiração do token
    access_token = auth.create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )  # Gera o token JWT
    return {"access_token": access_token, "token_type": "bearer"}  # Retorna o token para o cliente

@app.get("/users/me", response_model=schemas.UsuarioResponse)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    """
    Retorna dados do usuário logado, usando o token JWT enviado no header da requisição.
    Decodifica o token, valida e busca o usuário no banco de dados.
    """
    payload = auth.decode_access_token(token)  # Decodifica o token JWT
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido")  # Token inválido

    email: str = payload.get("sub")  # Pega o e-mail armazenado no token
    if email is None:
        raise HTTPException(status_code=401, detail="Token inválido")  # Token sem e-mail

    user = db.query(models.Usuario).filter(models.Usuario.email == email).first()  # Busca usuário pelo e-mail
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")  # Usuário não existe
    return user  # Retorna dados do usuário autenticado

@app.get("/health")
def health_check():
    """
    Endpoint para checagem de saúde da API. 
    Útil para monitoramento e verificações rápidas.
    """
    return {"status": "healthy", "message": "API do Fórum funcionando corretamente"}