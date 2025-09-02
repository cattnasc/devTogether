module.exports = {
    assunto: "Bem-vindo(a) ao DevTogheter",

    texto: `Olá, {{nome}}! 

Seja bem-vindo(a) ao nosso sistema. Estamos felizes em tê-lo(a) conosco.

Esperamos que tenha uma excelente experiência!

Atenciosamente,
Equipe do Sistema`,

    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo(a)!</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #58A6FF;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #58A6FF;
            margin: 0;
        }
        .content {
            font-size: 16px;
            line-height: 1.8;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .highlight {
            color: #58A6FF;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Bem-vindo(a) ao DevTogheter!</h1>
        </div>
        
        <div class="content">
            <p>Olá, <span class="highlight">{{nome}}</span>!</p>
            
            <p>Seja bem-vindo(a) a nosso comunidade de programação. Estamos felizes em tê-lo(a) conosco.</p>
            
            <p>Esperamos que tenha uma excelente experiência!</p>
            
            <p>Atenciosamente,<br>
            <strong>Equipe DevTogheter</strong></p>
        </div>
        
        <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>© 2025 DevTogheter</p>
        </div>
    </div>
</body>
</html>`
};
