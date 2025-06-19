from datetime import timedelta  
from fastapi import FastAPI, HTTPException, status, Query, Depends   
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm  
from sqlalchemy.orm import Session  
from fastapi.middleware.cors import CORSMiddleware  
from sqlalchemy.orm import selectinload

from . import models, schemas, auth, database

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --------------------
# Registro de usuário
# --------------------
@app.post("/register", response_model=schemas.UsuarioResponse)
def register_user(user: schemas.UsuarioCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.Usuario).filter(models.Usuario.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email já registrado")
    hashed_password = auth.get_password_hash(user.senha)
    db_user = models.Usuario(nome=user.nome, email=user.email, senha_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db_user = db.query(models.Usuario).options(selectinload(models.Usuario.topicos)).filter(models.Usuario.id == db_user.id).first()
    return db_user

# --------------------
# Login e token
# --------------------
@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --------------------
# Listar dados do usuário logado
# --------------------
@app.get("/users/me", response_model=schemas.UsuarioResponse)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    payload = auth.decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido")
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Token inválido")
    user = db.query(models.Usuario).options(selectinload(models.Usuario.topicos)).filter(models.Usuario.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

# --------------------
# Adiconando tópico 
# --------------------
@app.post("/topicos/", response_model=schemas.TopicoResponse)
def criar_topico(topico: schemas.TopicoCreate, db: Session = Depends(database.get_db), usuario: models.Usuario = Depends(auth.get_current_user)):
    novo_topico = models.Topico(
        titulo=topico.titulo,
        conteudo=topico.conteudo,
        autor_id=usuario.id,  # <-- pegue o id do usuário autenticado!
    )
    db.add(novo_topico)
    db.commit()
    db.refresh(novo_topico)
    return novo_topico

# --------------------
# Listar TODOS os tópicos 
# --------------------
@app.get("/topicos/", response_model=list[schemas.TopicoResponse])
def listar_topicos(db: Session = Depends(database.get_db)):
    topicos = db.query(models.Topico).all()
    return topicos

# --------------------
# Buscar tópicos por parte do título
# --------------------
@app.get("/topicos/search", response_model=list[schemas.TopicoResponse])
def buscar_topicos_por_titulo(query: str = Query(..., min_length=1), db: Session = Depends(database.get_db)):
    topicos = db.query(models.Topico).filter(models.Topico.titulo.ilike(f"%{query}%")).all()
    return topicos

# --------------------
# Healthcheck
# --------------------
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API do Fórum funcionando corretamente"}

# --------------------------------------------------
# NOVA ROTA: Adicionar mensagem (POST /mensagens/)
# --------------------------------------------------
@app.post("/mensagens/", response_model=schemas.MensagemResponse, status_code=201)
def criar_mensagem(
    mensagem: schemas.MensagemCreate,
    db: Session = Depends(database.get_db),
    usuario: models.Usuario = Depends(auth.get_current_user)
):
    # Checa se tópico existe antes
    topico = db.query(models.Topico).filter(models.Topico.id == mensagem.topico_id).first()
    if not topico:
        raise HTTPException(status_code=404, detail="Tópico não encontrado")

    nova_mensagem = models.Mensagem(
        conteudo=mensagem.conteudo,
        topico_id=mensagem.topico_id,
        usuario_id=usuario.id  
    )
    db.add(nova_mensagem)
    db.commit()
    db.refresh(nova_mensagem)
    return nova_mensagem