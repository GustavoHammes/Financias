import { Client } from "pg";
import * as dotenv from "dotenv";
import pool from "./db"; // usa pool para a conexão com bd_financas

dotenv.config({ path: __dirname + "/../.env" });

// Apenas para criar o banco (usa Client diretamente)
async function createDatabase(): Promise<void> {
    const client = new Client({
        host: process.env.INIT_DB_HOST,
        port: Number(process.env.INIT_DB_PORT),
        user: process.env.INIT_DB_USER,
        password: process.env.INIT_DB_PASSWORD,
        database: process.env.INIT_DB_NAME, // geralmente 'postgres'
    });

    await client.connect();

    try {
        await client.query(`CREATE DATABASE bd_financas`);
        console.log("Banco de dados 'bd_financas' criado.");
    } catch (err: any) {
        if (err.code === "42P04") {
            console.log("Banco de dados 'bd_financas' já existe.");
        } else {
            throw err;
        }
    } finally {
        await client.end();
    }
}

// Checa se a conexão via pool está ok
async function waitForDatabaseReady(retries = 5, delay = 1000): Promise<void> {
    for (let i = 0; i < retries; i++) {
        try {
            const client = await pool.connect();
            client.release();
            return;
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(res => setTimeout(res, delay));
        }
    }
}

async function setupTables(): Promise<void> {
    await waitForDatabaseReady();

    const client = await pool.connect();

    try {
        // Função auxiliar para checar existência da tabela
        const tableExists = async (tableName: string): Promise<boolean> => {
            const result = await client.query(
                `SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' AND table_name = $1
                )`,
                [tableName]
            );
            return result.rows[0].exists;
        };

        // Tabela usuarios
        if (!(await tableExists("usuarios"))) {
            await client.query(`
                CREATE TABLE usuarios (
                    id SERIAL PRIMARY KEY,
                    nome VARCHAR(100) NOT NULL
                );
            `);
            console.log("Tabela 'usuarios' criada.");
        } else {
            console.log("Tabela 'usuarios' já existe.");
        }

        // Tabela emprestimos
        if (!(await tableExists("emprestimos"))) {
            await client.query(`
                CREATE TABLE emprestimos (
                    id SERIAL PRIMARY KEY,
                    usuario_id INT REFERENCES usuarios(id),
                    item VARCHAR(100) NOT NULL,
                    valor_total NUMERIC(10, 2) NOT NULL,
                    parcelas INT NOT NULL,
                    tipo_juros VARCHAR(20) CHECK (tipo_juros IN ('simples', 'composto')),
                    taxa_juros NUMERIC(5, 2) NOT NULL,
                    data_inicio DATE DEFAULT CURRENT_DATE
                );
            `);
            console.log("Tabela 'emprestimos' criada.");
        } else {
            console.log("Tabela 'emprestimos' já existe.");
        }

        // Tabela investimentos
        if (!(await tableExists("investimentos"))) {
            await client.query(`
                CREATE TABLE investimentos (
                    id SERIAL PRIMARY KEY,
                    nome VARCHAR(100) NOT NULL,
                    tipo_juros VARCHAR(20) CHECK (tipo_juros IN ('simples', 'composto')),
                    taxa_juros NUMERIC(5, 2) NOT NULL,
                    descricao TEXT
                );
            `);
            console.log("Tabela 'investimentos' criada.");
        } else {
            console.log("Tabela 'investimentos' já existe.");
        }

        // Tabela simulacoes_investimento
        if (!(await tableExists("simulacoes_investimento"))) {
            await client.query(`
                CREATE TABLE simulacoes_investimento (
                    id SERIAL PRIMARY KEY,
                    usuario_id INT REFERENCES usuarios(id),
                    investimento_id INT REFERENCES investimentos(id),
                    valor_investido NUMERIC(10, 2) NOT NULL,
                    meses INT NOT NULL,
                    rendimento_final NUMERIC(10, 2),
                    data_simulacao DATE DEFAULT CURRENT_DATE
                );
            `);
            console.log("Tabela 'simulacoes_investimento' criada.");
        } else {
            console.log("Tabela 'simulacoes_investimento' já existe.");
        }

        console.log("Verificação de tabelas finalizada.");
    } finally {
        client.release();
        console.log("Conexão com o banco de dados fechada.");
    }
}

async function init() {
    try {
        await createDatabase(); // cria o banco se necessário
        await setupTables();    // usa pool para conectar e criar tabelas
    } catch (error) {
        console.error("Erro ao inicializar:", error);
    }
}

init();
