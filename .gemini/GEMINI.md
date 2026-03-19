# OpenCalc - Hub de Calculadoras

## 1. Visão Geral do Projeto
O **OpenCalc** é uma aplicação frontend desenvolvida em Angular que atua como um hub centralizado de calculadoras. O sistema é modularizado em "contextos" (ex: Tempo, Finanças), permitindo uma fácil navegação e a adição contínua de novas ferramentas matemáticas, lógicas e de conversão.

## 2. Requisitos Técnicos e Stack
- **Framework:** Angular (versão 16 ou superior - priorizando *Standalone Components*).
- **Gerenciamento de Estado/Reatividade:** RxJS (utilizando `Signals` para reatividade local de componentes, se na versão 16+).
- **Estilização:** SCSS com Tailwind CSS (ou Angular Material) para componentização visual rápida e responsiva.
- **Formulários:** *Reactive Forms* para validação e manipulação complexa de entradas de dados.
- **Testes:** Jasmine e Karma (ou Jest) para garantir a precisão dos cálculos.

## 3. Estrutura de Contextos (Features)

### 3.1. Contexto: Calculadoras de Tempo (`/tempo`)
Módulo responsável por cálculos envolvendo datas, horas e períodos.
- **Funcionalidades Implementadas:**
  - **Calculadora de Manipulação de Datas:**
    - **Inputs:** Data de início, Operação (Somar/Subtrair), Quantidade, Unidade (Dias, Semanas, Meses, Anos).
    - **Output:** Data final calculada e formatada.
  - **Calculadora de Diferença entre Datas:**
    - **Inputs:** Data inicial e Data final.
    - **Output:** Diferença expressa em dois formatos simultâneos:
      1. **Detalhado:** X anos, Y meses e Z dias.
      2. **Simples:** Total em dias.
    - **Observação:** O cálculo é sempre absoluto (independente da ordem das datas).
  - **Preparação para o Futuro:** Conversão de fuso horário (com integração a APIs de Timezone), contagem regressiva.

### 3.2. Contexto: Calculadoras de Finanças (`/financas`)
Módulo dedicado a cálculos matemáticos voltados para economia e investimentos.
- **Funcionalidades Iniciais:**
  - **Calculadora de Juros Simples:**
    - **Inputs:** Capital Inicial, Taxa de Juros (%), Período (meses/anos).
    - **Output:** Total de Juros, Montante Final.
  - **Calculadora de Juros Compostos:**
    - **Inputs:** Capital Inicial, Aporte Mensal (opcional), Taxa de Juros (%), Período.
    - **Output:** Montante Final, Total Investido, Total em Juros rendidos.
  - **Preparação para o Futuro:** Integração com APIs de cotação de moedas (ex: HG Brasil, AwesomeAPI) para conversão de moedas, cálculo de ROI, simulação de financiamentos (SAC/Price).

## 4. Arquitetura Proposta
Para garantir o potencial de escala e fácil integração com APIs, a arquitetura deve seguir o padrão *Feature-Driven*:

```text
src/
 ├── app/
 │   ├── core/                  # Serviços Singleton, Interceptors, Guards
 │   │   ├── http/              # Base para integrações com APIs
 │   │   └── layout/            # Navbar, Sidebar, Footer
 │   ├── shared/                # Componentes e pipes reutilizáveis
 │   │   ├── components/        # Cards de calculadora, botões, inputs
 │   │   └── utils/             # Funções utilitárias matemáticas e de data
 │   ├── features/              # Contextos da aplicação (Lazy Loaded)
 │   │   ├── time/
 │   │   │   ├── time.routes.ts
 │   │   │   ├── components/    # Componentes de UI
 │   │   │   └── services/      # Lógica de cálculo isolada (Testável)
 │   │   ├── finance/
 │   │   │   ├── finance.routes.ts
 │   │   │   ├── components/
 │   │   │   └── services/
 │   ├── app.component.ts
 │   └── app.routes.ts          # Roteamento principal
 └── assets/
```

## 5. Padrões de Projeto e Boas Práticas

### 5.1. Separação de Responsabilidades (Services para Cálculos)
Nenhum cálculo matemático deve ser feito diretamente no componente `.ts`. O componente deve apenas gerenciar o formulário (Reactive Forms) e injetar o serviço responsável pelo cálculo.

*Exemplo de fluxo (Juros Compostos):*
`FinanceFormComponent` -> coleta os dados -> envia para `CompoundInterestService.calculate(dados)` -> retorna resultado para exibição.

### 5.2. Facade Pattern para Integração de APIs
Quando as calculadoras começarem a usar APIs externas (como cotação de moedas ou feriados para cálculos de dias úteis), os serviços devem implementar o padrão Facade. O componente não precisa saber se o dado vem de um cálculo local ou de uma requisição HTTP, o serviço abstrai essa complexidade.

### 5.3. Navegação Baseada em Configuração
A página inicial (Hub) deve ser renderizada a partir de um array de configurações para facilitar a adição de novas calculadoras sem alterar o HTML da Home:

```typescript
export const CALCULATORS_CONFIG = [
  {
    category: 'Finanças',
    path: '/financas',
    calculators: [
      { name: 'Juros Simples', route: 'juros-simples', icon: 'money' },
      { name: 'Juros Compostos', route: 'juros-compostos', icon: 'trending-up' }
    ]
  },
  // ...
];
```

## 6. Próximos Passos (Plano de Ação)
1. **Setup Inicial:** Gerar o projeto Angular com roteamento e SCSS configurados.
2. **Configuração Visual:** Instalar e configurar Tailwind CSS para estilização ágil.
3. **Core & Shared:** Criar o layout base (Header, Sidebar de navegação entre contextos) e componentes genéricos de input de formulário.
4. **Desenvolvimento do Contexto de Tempo:** Criar as rotas, Reactive Forms e os serviços de cálculo baseados no objeto `Date` nativo do JavaScript ou usando bibliotecas como `date-fns` para lidar com complexidades de fuso horário e anos bissextos de forma mais segura.
5. **Desenvolvimento do Contexto de Finanças:** Implementar formulários financeiros e a lógica matemática pura nos serviços.
6. **Testes Unitários:** Foco nos `Services` de cada feature para garantir que 100% dos cálculos batem com a realidade.