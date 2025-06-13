// Backend/routes/rota.ts
import express, { Request, Response } from "express";
import pool from "../controllers/db";

const router = express.Router();

// Funções matemáticas
function calcularJurosSimples(capital: number, taxa: number, meses: number): number {
    return capital + (capital * taxa / 100) * meses;
}

function calcularJurosComposto(capital: number, taxa: number, meses: number): number {
    return capital * Math.pow(1 + taxa / 100, meses);
}

// Inserir usuário
router.post("/usuario", async (req: Request, res: Response) => {
    const { nome } = req.body;
    const result = await pool.query("INSERT INTO usuarios (nome) VALUES ($1) RETURNING *", [nome]);
    res.json(result.rows[0]);
});

// Cadastrar novo empréstimo
router.post("/emprestimo", async (req: Request, res: Response) => {
    const { usuario_id, item, valor_total, parcelas, tipo_juros, taxa_juros } = req.body;
    const result = await pool.query(
        `INSERT INTO emprestimos (usuario_id, item, valor_total, parcelas, tipo_juros, taxa_juros)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [usuario_id, item, valor_total, parcelas, tipo_juros, taxa_juros]
    );
    res.json(result.rows[0]);
});

// Cadastrar tipo de investimento
router.post("/investimento", async (req: Request, res: Response) => {
    const { nome, tipo_juros, taxa_juros, descricao } = req.body;
    const result = await pool.query(
        `INSERT INTO investimentos (nome, tipo_juros, taxa_juros, descricao)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [nome, tipo_juros, taxa_juros, descricao]
    );
    res.json(result.rows[0]);
});

// Simular pagamento de empréstimo mês a mês
router.post("/simular-emprestimo", async (req: Request, res: Response) => {
    const { valor_total, parcelas, tipo_juros, taxa_juros } = req.body;
    const resultados: number[] = [];
    const capital = valor_total / parcelas;

    for (let i = 1; i <= parcelas; i++) {
        let parcela = tipo_juros === 'simples'
            ? calcularJurosSimples(capital, taxa_juros, i) / parcelas
            : calcularJurosComposto(capital, taxa_juros, i) / parcelas;
        resultados.push(Number(parcela.toFixed(2)));
    }

    res.json({ parcelas: resultados });
});

// Simular rendimento de investimento
router.post("/simular-investimento", async (req: Request, res: Response) => {
    const { usuario_id, investimento_id, valor_investido, meses } = req.body;

    const investimento = await pool.query(`SELECT * FROM investimentos WHERE id = $1`, [investimento_id]);
    if (investimento.rows.length === 0) return res.status(404).json({ erro: "Investimento não encontrado" });

    const { tipo_juros, taxa_juros } = investimento.rows[0];

    const rendimento_final = tipo_juros === 'simples'
        ? calcularJurosSimples(valor_investido, taxa_juros, meses)
        : calcularJurosComposto(valor_investido, taxa_juros, meses);

    await pool.query(
        `INSERT INTO simulacoes_investimento (usuario_id, investimento_id, valor_investido, meses, rendimento_final)
         VALUES ($1, $2, $3, $4, $5)`,
        [usuario_id, investimento_id, valor_investido, meses, rendimento_final]
    );

    res.json({ rendimento_final: Number(rendimento_final.toFixed(2)) });
});

// Relatório comparativo de investimentos
router.get("/relatorio-investimentos", async (_req: Request, res: Response) => {
    const result = await pool.query(`
        SELECT u.nome AS usuario, i.nome AS investimento, s.valor_investido, s.meses, s.rendimento_final
        FROM simulacoes_investimento s
        JOIN usuarios u ON u.id = s.usuario_id
        JOIN investimentos i ON i.id = s.investimento_id
        ORDER BY rendimento_final DESC
    `);
    res.json(result.rows);
});

export default router;
