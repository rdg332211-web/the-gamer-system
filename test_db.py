import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")
# mysql://3wq7dhnYtNqF5eW.root:<PASSWORD>@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/github_sample
parts = db_url.replace("mysql://", "").split("@")
user_pass = parts[0].split(":")
host_port_db = parts[1].split("/")
host_port = host_port_db[0].split(":")

config = {
  'user': user_pass[0],
  'password': user_pass[1],
  'host': host_port[0],
  'port': int(host_port[1]),
  'database': host_port_db[1],
  'ssl_verify_cert': True,
  'ssl_ca': '/etc/ssl/certs/ca-certificates.crt'
}

try:
    conn = mysql.connector.connect(**config)
    print("Conexão bem-sucedida!")
    conn.close()
except Exception as e:
    print(f"Erro na conexão: {e}")
