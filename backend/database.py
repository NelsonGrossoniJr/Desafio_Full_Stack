from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# String de conexão com o banco de dados MySQL, usando PyMySQL como driver.
DATABASE_URL = "mysql+pymysql://root:1234@localhost/forum_discussao"

# Cria o objeto 'engine' responsável pela comunicação com o banco de dados
engine = create_engine(DATABASE_URL)

# Cria uma fábrica de sessões, responsável por abrir e fechar as conexões com o banco     
SessionLocal = sessionmaker(autocommit=False,       # autocommit=False: você controla quando salvar alterações
                            autoflush=False,       # autoflush=False: não atualiza automaticamente os dados na sessão
                            bind=engine         # bind=engine: vincula a sessão ao engine criado acima
                            )

# Cria uma classe base que será usada como herança para todos os modelos ORM
Base = declarative_base()

def get_db():
    """
    Função geradora que fornece uma sessão com o banco para uso em rotas FastAPI
    """
    db = SessionLocal()     # Cria uma nova sessão ao chamar a função
    try:
        yield db        # Entrega a sessão para quem chamou (exemplo: uma rota do FastAPI)
    finally:
        db.close()      # Garante que a sessão será fechada ao fim da requisição