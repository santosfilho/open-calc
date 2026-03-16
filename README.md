# OpenCalc - Hub de Calculadoras

O **OpenCalc** é uma aplicação frontend moderna desenvolvida em Angular (versão 16+) que atua como um hub centralizado de calculadoras organizadas por contextos (ex: Tempo, Finanças). O sistema utiliza as melhores práticas do ecossistema Angular com *Standalone Components*, *Reactive Forms* e gerenciamento de estado via *Signals*, aliado a uma estilização ágil construída com **Tailwind CSS**.

---

## 🚀 Pré-requisitos

Para rodar o projeto localmente, certifique-se de ter os seguintes itens instalados na sua máquina:

- **Node.js** (versão 18 LTS ou superior recomendada)
- **NPM** (gerenciador de pacotes do Node) ou **Yarn**
- **Angular CLI** instalado globalmente:
  ```bash
  npm install -g @angular/cli
  ```

---

## 🛠️ Instalação e Configuração Inicial

1. **Clone este repositório** para a sua máquina local:
   ```bash
   git clone <url-do-repositorio>
   ```

2. **Acesse a pasta do projeto**:
   ```bash
   cd open-calc
   ```

3. **Instale as dependências** do projeto:
   ```bash
   npm install
   ```
   *Nota: Este comando instalará o core do Angular, as dependências do Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`) e as demais bibliotecas.*

---

## 💻 Como Subir a Aplicação (Desenvolvimento)

Para rodar o servidor de desenvolvimento, execute na raiz do projeto:

```bash
npm start
# Ou diretamente pelo CLI:
# ng serve
```

Acesse a aplicação em `http://localhost:4200/` no seu navegador. O aplicativo possui *hot-reload* ativado, então será recarregado automaticamente sempre que você salvar alterações em qualquer arquivo `.ts`, `.html` ou `.scss`.

---

## 🧪 Como Executar os Testes Unitários

Visando garantir a máxima precisão matemática das calculadoras (especialmente regras de negócio financeiras e manipulação complexa de datas), os cálculos devem ser isolados em classes de Serviço (`.service.ts`). O projeto inclui uma suíte nativa configurada com o framework **Jasmine** e o **Karma** test runner.

Para rodar todas as suítes de teste de uma vez:

```bash
npm run test
# Ou diretamente:
# ng test
```

### Cobertura de Código (Code Coverage)
Para validar quais partes do código não estão devidamente cobertas pelos testes (idealmente 100% dos `Services` devem estar cobertos), execute:

```bash
ng test --code-coverage
```
Isso gerará uma pasta `coverage/` na raiz do projeto com um arquivo `index.html`. Abra-o no navegador para detalhamento visual das linhas/branches não cobertas.

---

## 🏗️ Arquitetura do Projeto

O código-fonte (`src/app/`) segue uma organização **Feature-Driven**, visando escalabilidade:

- `core/`: Configurações essenciais (serviços Singleton, interceptadores HTTP, etc.) e o layout base da aplicação (ex: Header, Sidebar, Footer).
- `shared/`: Componentes visuais genéricos (botões, inputs dinâmicos, cards) e utilitários que não possuem estado ou contexto de negócios fixo.
- `features/`: Módulos de negócio da aplicação (separados por pastas como `/time`, `/finance`). Estes são carregados via **Lazy Loading**, otimizando a performance.

### Princípios Base Adotados
1. **Componentes "Burros" (Dumb Components)**: A UI (arquivos `.ts` atrelados às views) é apenas para binding de tela e envio de *Reactive Forms*.
2. **Serviços Especializados**: Toda a lógica de negócios e cálculos reside nos arquivos `xyz.service.ts`.
3. **Facade para APIs Externas**: Com a possível integração de consulta de moedas (`/finance`) e relógios (`/time`), o Serviço deverá abstrair a origem do dado para o componente, implementando um *Facade Pattern*.
