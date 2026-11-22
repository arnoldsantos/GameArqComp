# BUS-ROUTER 86 — Jogo de Roteamento de Barramento e Arquitetura Computacional

## Visão Geral do Projeto
Aplicação web interativa de estudo sobre **Arquitetura Computacional**, desenvolvida **100% em Front-end estático** (`HTML5`, `CSS3` e `JavaScript` puro — *Vanilla JS*), sem dependência de servidor back-end, APIs externas ou banco de dados.

No jogo, o usuário assume o papel de controlador de sistema em um terminal retrô de hardware e precisa rotear cada instrução, cenário operacional ou descrição técnica para o **componente/barramento correto** da arquitetura do computador.

---

## Especificação Técnica para o Agente de Desenvolvimento

### 1. Arquitetura de Arquivos (Raiz do Projeto)
Criar exatamente a seguinte estrutura na raiz do repositório:
- `index.html` — Estrutura semântica do terminal retrô, área de missão/pacote de dados, painel de componentes clicáveis, placar e controles.
- `style.css` — Estilização completa com estética **Retrô Terminal / BIOS (anos 1980–1990)**, responsividade e animações de feedback de sinal.
- `script.js` — Banco de dados em memória (array de objetos JS), máquina de estados do jogo, lógica de roteamento, pontuação, streak (sequência de acertos) e reinício.
- `README.md` — Documentação do projeto.

### 2. Identidade Visual e Estética (Retrô Terminal / Hardware)
- **Tema:** Tela de diagnóstico POST / BIOS clássica com estética de barramento eletrônico.
- **Paleta de Cores:**
  - Fundo principal: `#0A0E0A` (preto CRT profundo)
  - Fundo dos painéis/cartões: `#111911`
  - Cor primária (texto e bordas ativas): `#33FF33` (verde fósforo CRT)
  - Cor secundária / destaque técnico: `#FFB000` (âmbar de alerta/status)
  - Feedback de acerto: `#00FF66` com brilho suave (`box-shadow`)
  - Feedback de erro: `#FF3333` com efeito de tremor (`shake` animation)
- **Tipografia:** Fonte monoespaçada (`'Courier New', Courier, monospace`), bordas duplas ou sólidas com cantos retos (`border-radius: 0px` ou `2px`), efeito sutil de linhas de varredura (*scanlines* em CSS puro, sem prejudicar a leitura) e cursor piscante no cabeçalho.

### 3. Mecânica do Jogo (Roteamento de Barramento)
1. **Fluxo da Rodada:**
   - O sistema exibe um **"Pacote / Sinal de Operação"** no painel central (uma pista objetiva de no máximo 15 palavras descrevendo uma função, característica ou cenário de hardware, sem revelar o nome ou sigla por extenso).
   - Abaixo ou ao lado, são exibidos os **nós/componentes de destino** disponíveis na placa (botões estilizados como chips/pinos de circuito).
   - O jogador clica (ou pressiona a tecla numérica/atalho correspondente) no componente correto para rotear o sinal.
2. **Feedback Imediato e Educativo:**
   - **Se acertar:** O chip acende em verde, o barramento exibe `SINAL ROTEADO COM SUCESSO`, soma pontos ao placar, incrementa a sequência (*combo/streak*), exibe uma breve confirmação conceitual de 1 linha e avança automaticamente (após 1,2s ou clique em "Próximo") para o próximo pacote.
   - **Se errar:** O chip pisca em vermelho, exibe `FALHA DE ROTEAMENTO` junto com uma dica rápida explicando qual é a função real daquele componente e qual era o destino correto, permitindo aprendizado ativo.
3. **Modos ou Fases de Estudo:**
   - **Rodada Completa (16 Conceitos):** Percorre todos os 16 termos fundamentais em ordem embaralhada a cada nova partida.
   - **Placar e Resumo Final:** Ao concluir os 16 pacotes, exibe uma tela de diagnóstico final com total de acertos (`X de 16`), precisão percentual, lista dos conceitos que o jogador errou (para revisão rápida) e botão **Reiniciar Sistema**.

### 4. Base de Conceitos e Pistas (16 Termos Obrigatórios)
Armazenar no `script.js` como uma constante `CONCEPTS` contendo os 16 itens abaixo. Todas as pistas respeitam a regra de **no máximo 15 palavras**, **sem conter a resposta** e **sem expandir siglas**:

| ID | Componente | Pista / Sinal de Operação (Máx. 15 palavras) |
| :--- | :--- | :--- |
| 1 | `CPU` | Cérebro do computador que busca, decodifica e executa instruções de programas. |
| 2 | `ULA` | Circuito interno do processador que realiza cálculos matemáticos e comparações lógicas. |
| 3 | `UC` | Coordena o fluxo de dados e gera sinais que orquestram o processador. |
| 4 | `REGISTRADORES` | Memórias ultrarrápidas dentro do processador que guardam dados e instruções em execução. |
| 5 | `RAM` | Memória principal volátil usada para armazenar programas e dados ativos temporariamente. |
| 6 | `ROM` | Memória somente de leitura que mantém instruções permanentes mesmo sem energia. |
| 7 | `EEPROM` | Memória não volátil que pode ser apagada e regravada por sinais elétricos. |
| 8 | `FLASH` | Armazenamento não volátil rápido usado em pendrives, cartões e SSDs modernos. |
| 9 | `CACHE` | Memória intermediária veloz que guarda dados frequentes para acelerar o acesso do processador. |
| 10 | `MEMORIADEMASSA` | Armazenamento secundário de alta capacidade para guardar arquivos de forma permanente. |
| 11 | `DMA` | Permite que periféricos transfiram dados direto com a memória sem ocupar o processador. |
| 12 | `ADDRESSBUS` | Via unidirecional que transporta a localização exata da memória a ser acessada. |
| 13 | `DATABUS` | Via bidirecional responsável por transportar informações entre processador, memória e periféricos. |
| 14 | `MICROCONTROLADOR` | Chip único que integra processador, memória e periféricos para sistemas embarcados. |
| 15 | `DUALCORE` | Arquitetura de processador equipada com dois núcleos físicos independentes de execução. |
| 16 | `QUADCORE` | Arquitetura de processador equipada com quatro núcleos físicos independentes de execução. |

### 5. Requisitos Funcionais da Interface (`index.html` + `script.js`)
- **Cabeçalho estilo BIOS:** Título `BUS-ROUTER 86 // DIAGNÓSTICO DE ARQUITETURA`, indicador de progresso (`PACOTE 01/16`), contador de acertos (`ACERTOS: 0`) e sequência (`STREAK: 0`).
- **Painel de Sinal (Terminal Central):** Mostra a pista atual em destaque e o status do barramento.
- **Matriz de Componentes (Chips):** Grade responsiva com os botões dos componentes (exibindo código/pino e nome do componente). Deve suportar embaralhamento dos conceitos a cada reinício.
- **Controles:** Botão **Reiniciar** (zera placar, embaralha novamente os pacotes e reinicia do pacote 1) e botão opcional de **Modo Revisão / Glossário** (um modal simples exibindo os 16 termos e suas funções para consulta antes ou depois do jogo).
- **Responsividade:** Deve funcionar perfeitamente em telas desktop e mobile sem rolagem horizontal.

---

## Como Executar Localmente
1. Clone ou baixe este repositório.
2. Abra o arquivo `index.html` diretamente em qualquer navegador moderno (Chrome, Edge, Firefox).
3. Nenhuma instalação de pacotes (`npm`), servidor local ou banco de dados é necessária.

## Como Jogar
1. Leia a descrição técnica exibida no visor central do **Sinal de Operação**.
2. Analise qual componente ou barramento da arquitetura computacional executa aquela função.
3. Clique no chip correspondente na placa para rotear o sinal.
4. Acompanhe o feedback imediato, tente manter a maior sequência de acertos possível e revise os conceitos ao final da rodada.

## Publicação (GitHub Pages)
1. Suba os arquivos (`index.html`, `style.css`, `script.js`, `README.md`) para a branch `main` de um repositório público no GitHub.
2. Acesse **Settings → Pages** no repositório.
3. Em **Source**, selecione **Deploy from a branch**, escolha `main` e a pasta `/ (root)`, depois clique em **Save**.