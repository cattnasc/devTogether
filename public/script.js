/**
 * SISTEMA DE BOAS-VINDAS - FRONTEND JAVASCRIPT
 * =============================================
 * Este arquivo controla a interação do usuário com o formulário de envio de emails
 * Responsável por: capturar dados, enviar para API e exibir resultados
 */

// ========================================
// 1. CAPTURA DOS ELEMENTOS DO DOM
// ========================================
// Busca e armazena referências dos elementos HTML que serão manipulados
const form = document.getElementById('welcomeForm');           // Formulário principal
const nomeInput = document.getElementById('nome');             // Campo de entrada do nome
const emailInput = document.getElementById('email');           // Campo de entrada do email
const enviarBtn = document.getElementById('enviarBtn');        // Botão de envio
const mensagensDiv = document.getElementById('mensagens');     // Área para exibir mensagens

// ========================================
// 2. INICIALIZAÇÃO DA APLICAÇÃO
// ========================================
// Aguarda o carregamento completo do DOM antes de configurar os eventos
document.addEventListener('DOMContentLoaded', function () {
    // Adiciona o listener para interceptar o envio do formulário
    form.addEventListener('submit', enviarFormulario);
    console.log('✅ Sistema de boas-vindas carregado e pronto!');
});

// ========================================
// 3. FUNÇÃO PRINCIPAL - ENVIO DO FORMULÁRIO
// ========================================
/**
 * Função assíncrona que gerencia todo o processo de envio do email
 * @param {Event} event - Evento de submissão do formulário
 */
async function enviarFormulario(event) {
    // Previne o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();

    // Coleta os dados dos campos de entrada
    const dados = {
        nome: nomeInput.value,      // Valor do campo nome
        email: emailInput.value     // Valor do campo email
    };

    // Desabilita o botão para evitar múltiplos envios
    enviarBtn.disabled = true;
    console.log('📤 Enviando dados:', dados);

    try {
        // ========================================
        // 3.1 REQUISIÇÃO HTTP PARA A API
        // ========================================
        // Envia uma requisição POST para o endpoint /send-welcome
        const response = await fetch('/send-welcome', {
            method: 'POST',                              // Método HTTP
            headers: {
                'Content-Type': 'application/json'       // Tipo de conteúdo JSON
            },
            body: JSON.stringify(dados)                  // Converte dados para JSON
        });

        // Converte a resposta da API para objeto JavaScript
        const resultado = await response.json();
        console.log('📥 Resposta recebida:', resultado);

        // ========================================
        // 3.2 TRATAMENTO DA RESPOSTA
        // ========================================
        if (resultado.sucesso) {
            // Se sucesso: mostra mensagem positiva e limpa o formulário
            mostrarMensagem(resultado.mensagem, 'sucesso');
            form.reset();  // Limpa todos os campos do formulário
        } else {
            // Se erro: mostra mensagem de erro (validação, etc.)
            mostrarMensagem(resultado.mensagem, 'erro');
        }

    } catch (error) {
        // ========================================
        // 3.3 TRATAMENTO DE ERROS DE CONEXÃO
        // ========================================
        // Captura erros de rede, servidor offline, etc.
        console.error('❌ Erro na requisição:', error);
        mostrarMensagem('Erro de conexão com o servidor', 'erro');
    } finally {
        // ========================================
        // 3.4 LIMPEZA FINAL
        // ========================================
        // Sempre reabilita o botão, independente do resultado
        enviarBtn.disabled = false;
    }
}

// ========================================
// 4. FUNÇÃO DE EXIBIÇÃO DE MENSAGENS
// ========================================
/**
 * Cria e exibe mensagens de feedback para o usuário
 * @param {string} texto - Texto da mensagem a ser exibida
 * @param {string} tipo - Tipo da mensagem ('sucesso' ou 'erro')
 */
function mostrarMensagem(texto, tipo) {
    // Cria um novo elemento div para a mensagem
    const mensagemDiv = document.createElement('div');

    // Define as classes CSS para estilização (mensagem + tipo específico)
    mensagemDiv.className = `mensagem ${tipo}`;

    // Define o texto da mensagem
    mensagemDiv.textContent = texto;

    // Adiciona a mensagem na área de mensagens do DOM
    mensagensDiv.appendChild(mensagemDiv);

    // ========================================
    // 4.1 REMOÇÃO AUTOMÁTICA DA MENSAGEM
    // ========================================
    // Remove a mensagem automaticamente após 3 segundos
    setTimeout(() => {
        // Verifica se o elemento ainda existe no DOM antes de remover
        if (mensagemDiv.parentNode) {
            mensagemDiv.remove();
        }
    }, 3000);  // 3000ms = 3 segundos
}

// ========================================
// FIM DO ARQUIVO - SISTEMA PRONTO PARA USO
// ========================================
/**
 * RESUMO DAS FUNCIONALIDADES:
 * 
 * ✅ Captura dados do formulário (nome e email)
 * ✅ Envia requisição POST para /send-welcome
 * ✅ Trata respostas de sucesso e erro
 * ✅ Exibe feedback visual para o usuário
 * ✅ Previne múltiplos envios
 * ✅ Limpa formulário após sucesso
 * ✅ Remove mensagens automaticamente
 * 
 * FLUXO SIMPLIFICADO:
 * Usuário preenche → JavaScript captura → Envia para API → Mostra resultado
 */
