# 📱 WhatsApp Manager

**WhatsApp Manager** é uma aplicação web poderosa que facilita o envio de mensagens via WhatsApp de maneira automática. Com funcionalidades avançadas como **envio em massa**, **agendamento de mensagens** e **otimização de conteúdo com IA**, esta ferramenta permite que você gerencie suas comunicações de forma eficiente e escalável.

---

## 🚀 Funcionalidades

### 1. 🔐 Iniciar Sessão
- **Rota:** `/`
- Digite o nome da sessão no campo de input.
- Clique em **Obter QR Code** para vincular sua conta de WhatsApp.
- Escaneie o QR Code com seu WhatsApp para iniciar a sessão.
- **Encerrar Sessões:** Há um botão que permite fechar todas as sessões ativas com um clique.

### 2. 💬 Disparar Mensagens
- **Rota:** `/message`
- Selecione a sessão desejada no **Select de Sessões**.
- Carregue uma **lista de contatos CSV** para enviar as mensagens em massa.
- Escreva a mensagem no campo de input.
- Escolha entre **Texto Original** ou **Melhorar com IA** (utilizando ChatGPT).
- Clique em **Enviar Mensagem para Todos**.
- **Envio de Imagens:** Use os botões **Selecionar Imagem** e **Enviar Imagem para Todos**.

### 3. ⏰ Agendar Mensagens
- **Rota:** `/reminder`
- Selecione a sessão de WhatsApp desejada.
- Carregue uma lista de contatos via **CSV**.
- Escreva a mensagem no campo de input.
- Use o **toggle** para escolher entre **Texto Original** ou **Melhorar com IA**.
- Selecione a data e hora para o envio da mensagem.
- Finalize clicando em **Agendar Mensagem** para programar o envio automático.

---

## 🛠️ Tecnologias Utilizadas

- **⚛️ React.js**: Biblioteca moderna para construção de interfaces dinâmicas e reativas.
- **💨 Vite**: Ferramenta de build ultrarrápida.
- **🛠️ Material UI**: Componentes prontos e estilizados seguindo o Material Design.
- **📄 PapaParse**: Leitura eficiente de arquivos CSV.
- **💬 Axios**: Cliente HTTP para realizar requisições ao servidor.
- **🌍 React Router**: Navegação entre as páginas da aplicação.

---

## 📂 Estrutura do Projeto

A aplicação é organizada em três componentes principais:

1. **Iniciar Sessão:** Conecta seu WhatsApp à aplicação.
2. **Disparar Mensagens:** Permite o envio em massa de mensagens personalizadas.
3. **Agendar Mensagens:** Agenda o envio automático de mensagens em datas futuras.

---

## ⚙️ Instalação e Execução

### Pré-requisitos

- **Node.js** e **NPM** ou **Yarn**

### Passos para Rodar a Aplicação

1. Clone o repositório:
   ```bash
   git clone https://github.com/allangts/whatsapp-manager.git

2. Acesse o diretório do projeto:
    ```bash
    cd whatsapp-manager

3. Instale as dependências:
    ```bash
    npm install

4. Execute o servidor:
    ```bash
    npm run dev

5. Abra o navegador e acesse:
    ```bash
    http://localhost:3000
