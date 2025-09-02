/**
 * SISTEMA DE BOAS-VINDAS - SERVIDOR BACKEND
 * =========================================
 * Servidor Express.js que gerencia o envio de emails de boas-vindas
 * Tecnologias: Node.js, Express, Resend, CORS, dotenv
 * Autor: Sistema de Boas-Vindas
 * Data: 18 de agosto de 2025
 */

// ========================================
// 1. IMPORTAÇÃO DE DEPENDÊNCIAS
// ========================================
const express = require('express');        // Framework web para Node.js
const cors = require('cors');              // Middleware para permitir requisições de diferentes origens
const path = require('path');              // Utilitário para trabalhar com caminhos de arquivos
const { Resend } = require('resend');      // Serviço de envio de emails
const mensagem = require('./mensagem');    // Importa templates de email do arquivo local
require('dotenv').config();                // Carrega variáveis de ambiente do arquivo .env

// ========================================
// 2. CONFIGURAÇÃO INICIAL DO SERVIDOR
// ========================================
const app = express();                             // Cria instância do aplicativo Express
const PORT = process.env.PORT || 3000;             // Define porta (variável de ambiente ou 3000 padrão)

// ========================================
// 3. CONFIGURAÇÃO DO SERVIÇO DE EMAIL
// ========================================
// Inicializa o Resend com a chave da API vinda das variáveis de ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

// ========================================
// 4. CONFIGURAÇÃO DE MIDDLEWARES
// ========================================
// Middlewares são funções que processam requisições antes de chegarem às rotas
app.use(cors());                                    // Permite requisições de qualquer origem (CORS)
app.use(express.json());                            // Interpreta corpo de requisições como JSON
app.use(express.urlencoded({ extended: true }));    // Interpreta dados de formulários HTML

// ========================================
// 5. SERVIR ARQUIVOS ESTÁTICOS
// ========================================
// Configura o Express para servir arquivos da pasta 'public' (HTML, CSS, JS, imagens)
app.use(express.static('public'));

// ========================================
// 6. ROTA PRINCIPAL - PÁGINA INICIAL
// ========================================
/**
 * GET / - Serve a página inicial do sistema
 * Retorna o arquivo HTML principal que contém o formulário
 */
app.get('/', (req, res) => {
    // Envia o arquivo index.html da pasta public
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========================================
// 7. ROTA PRINCIPAL - ENVIO DE BOAS-VINDAS
// ========================================
/**
 * POST /send-welcome - Processa o envio de emails de boas-vindas
 * Recebe: { nome: string, email: string }
 * Retorna: { sucesso: boolean, mensagem: string, emailId?: string }
 */
app.post('/send-welcome', async (req, res) => {
    try {
        // ========================================
        // 7.1 EXTRAÇÃO DOS DADOS DA REQUISIÇÃO
        // ========================================
        // Desestruturação para extrair nome e email do corpo da requisição
        const { nome, email } = req.body;

        // ========================================
        // 7.2 VALIDAÇÕES DE ENTRADA
        // ========================================
        // Verifica se ambos os campos foram preenchidos
        if (!nome || !email) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nome e email são obrigatórios'
            });
        }

        // Validação do formato do email usando expressão regular
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Formato de email inválido'
            });
        }

        // Validação do comprimento mínimo do nome (sem espaços extras)
        if (nome.trim().length < 2) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nome deve ter pelo menos 2 caracteres'
            });
        }

        // Log para acompanhamento do processo
        console.log(`📧 Enviando boas-vindas para: ${nome} (${email})`);

        // ========================================
        // 7.3 PERSONALIZAÇÃO DO TEMPLATE
        // ========================================
        // Importa o template base e substitui a variável {{nome}} pelo nome real
        const assunto = mensagem.assunto;
        const textoPersonalizado = mensagem.texto.replace(/{{nome}}/g, nome.trim());
        const htmlPersonalizado = mensagem.html.replace(/{{nome}}/g, nome.trim());

        // ========================================
        // 7.4 ENVIO DO EMAIL VIA RESEND
        // ========================================
        // Chama a API do Resend para enviar o email
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL,        // Remetente (configurado no .env)
            to: [email.trim()],                  // Destinatário (remove espaços extras)
            subject: assunto,                    // Assunto do email
            text: textoPersonalizado,            // Versão em texto simples
            html: htmlPersonalizado              // Versão em HTML
        });

        // Verificar se houve erro no envio
        if (error) {
            console.error('❌ Erro ao enviar email:', error);
            throw new Error(`Falha no envio: ${error.message}`);
        }

        // Log de sucesso com ID do email
        console.log(`✅ Email enviado com sucesso! ID: ${data.id}`);

        // ========================================
        // 7.5 RESPOSTA DE SUCESSO
        // ========================================
        res.json({
            sucesso: true,
            mensagem: `Boas-vindas enviadas para ${nome}! Verifique seu email.`,
            emailId: data.id    // ID do email para rastreamento
        });

    } catch (error) {
        // ========================================
        // 7.6 TRATAMENTO DE ERROS
        // ========================================
        // Captura qualquer erro não tratado e retorna resposta de erro
        console.error('❌ Erro no servidor:', error);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor ao enviar email'
        });
    }
});

// ========================================
// 8. ROTA DE STATUS DA API
// ========================================
/**
 * GET /api/status - Verifica se a API está funcionando
 * Útil para monitoramento e health checks
 * Retorna: { status: string, mensagem: string, timestamp: string }
 */
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',                           // Status do sistema
        mensagem: 'Sistema de Boas-Vindas funcionando!',  // Mensagem informativa
        timestamp: new Date().toISOString()         // Timestamp atual em formato ISO
    });
});

// ========================================
// 9. MIDDLEWARE PARA ROTAS NÃO ENCONTRADAS (404)
// ========================================
/**
 * Middleware que captura todas as requisições para rotas que não existem
 * Deve vir após todas as rotas definidas
 */
app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada'
    });
});

// ========================================
// 10. MIDDLEWARE DE TRATAMENTO DE ERROS GLOBAIS
// ========================================
/**
 * Middleware para capturar erros não tratados em toda a aplicação
 * Deve ser o último middleware definido
 * @param {Error} error - Erro capturado
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta  
 * @param {NextFunction} next - Função para passar controle
 */
app.use((error, req, res, next) => {
    console.error('Erro não tratado:', error);
    res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor'
    });
});

// ========================================
// 11. INICIALIZAÇÃO DO SERVIDOR
// ========================================
/**
 * Inicia o servidor HTTP na porta especificada
 * Exibe informações importantes sobre o sistema
 */
app.listen(PORT, () => {
    console.log(`
🚀 Servidor iniciado com sucesso!
📧 Sistema de Boas-Vindas
🌐 Acesse: http://localhost:${PORT}
📝 Status: http://localhost:${PORT}/api/status

💡 Pronto para enviar emails de boas-vindas!
    `);
});

// ========================================
// 12. EXPORTAÇÃO DO MÓDULO
// ========================================
/**
 * Exporta a instância do app para permitir testes e reutilização
 * Útil para testes unitários e integração com outros módulos
 */
module.exports = app;

// ========================================
// FIM DO ARQUIVO - RESUMO DAS FUNCIONALIDADES
// ========================================
/**
 * FUNCIONALIDADES IMPLEMENTADAS:
 * 
 * ✅ Servidor Express configurado
 * ✅ Middleware de CORS, JSON e URL-encoded
 * ✅ Servir arquivos estáticos (frontend)
 * ✅ Rota GET / (página principal)
 * ✅ Rota POST /send-welcome (envio de emails)
 * ✅ Rota GET /api/status (health check)
 * ✅ Validação de dados de entrada
 * ✅ Integração com Resend para envio de emails
 * ✅ Sistema de templates com substituição de variáveis
 * ✅ Tratamento completo de erros
 * ✅ Middleware para rotas 404
 * ✅ Logs informativos e de erro
 * ✅ Configuração via variáveis de ambiente
 * 
 * FLUXO PRINCIPAL:
 * Frontend → POST /send-welcome → Validação → Template → Resend → Resposta
 * 
 * DEPENDÊNCIAS EXTERNAS:
 * - Resend API (para envio de emails)
 * - Arquivo .env (para configurações)
 * - Arquivo mensagem.js (para templates)
 */
