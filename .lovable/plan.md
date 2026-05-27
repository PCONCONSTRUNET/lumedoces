# Financeiro + Dashboard de estatísticas

Vou criar duas novas abas no painel admin: **Financeiro** (controle de caixa, DRE, exportação) e **Dashboard** (estatísticas gerais de vendas e pagamentos). Antes de implementar, preciso confirmar algumas decisões importantes — responda no chat e eu sigo direto para o código.

## Perguntas antes de codar

1. **Origem dos pedidos**: hoje o projeto **não tem tabela de pedidos** (`orders`). Quer que eu crie agora `orders` + `order_items` (com status: pendente, confirmado, entregue, cancelado, valor total, forma de pagamento, cliente etc.) para alimentar o Dashboard? Sem isso, o Dashboard só mostra movimentações manuais.
2. **Formas de pagamento**: quais devo usar como padrão? Sugestão: Dinheiro, Pix, Cartão Débito, Cartão Crédito, iFood/App, Outros.
3. **DRE**: quer DRE simplificado (Receita Bruta → (-) Custos → Lucro Bruto → (-) Despesas → Lucro Líquido) agrupando pelas categorias que eu criar, ou um DRE mais detalhado por categoria customizável?

Se não responder, eu sigo com: **(1) sim, criar `orders`/`order_items`**, **(2) as 6 formas acima**, **(3) DRE simplificado**.

## O que será criado

### Banco (migration)
- `payment_methods` — formas de pagamento (nome, ativo)
- `finance_categories` — categorias de receita/despesa (nome, tipo: `revenue`/`expense`, cor)
- `finance_transactions` — lançamentos (data, tipo receita/despesa, valor, categoria, forma de pagamento, descrição, pedido vinculado opcional, status pago/pendente)
- `orders` + `order_items` — pedidos do site (cliente, total, status, forma de pagamento, data) ligados a `products`
- Trigger: ao marcar pedido como **pago**, gera automaticamente um lançamento de **receita** em `finance_transactions`
- RLS: leitura/escrita só para admin; `service_role` total

### Rotas admin
- `admin.dashboard.financeiro.tsx` — aba Financeiro
  - Cards: Saldo do período, Receitas, Despesas, Lucro
  - Filtros: período (hoje, 7d, 30d, mês, custom), tipo, categoria, forma de pagamento, status
  - Tabela de movimentações com criar/editar/excluir (modal)
  - Gráficos (recharts): linha receita×despesa por dia, pizza por categoria, barras por forma de pagamento
  - Botões: **Exportar CSV**, **Exportar PDF**, **Ver DRE**
- `admin.dashboard.financeiro.dre.tsx` — DRE do período selecionado, com botão exportar PDF
- `admin.dashboard.index.tsx` (Dashboard geral, substitui a home atual do admin)
  - Cards: pedidos do dia, ticket médio, faturamento mês, top produto, % crescimento vs período anterior
  - Filtros de período idênticos ao Financeiro
  - Gráficos: vendas por dia, vendas por categoria, mix de pagamento, status dos pedidos, top 10 produtos
  - Lista de últimos pedidos com link para detalhe

### Server functions (`createServerFn` + `requireSupabaseAuth`)
- `listFinanceTransactions`, `createFinanceTransaction`, `updateFinanceTransaction`, `deleteFinanceTransaction`
- `getFinanceSummary(period)` → totais agregados + séries para gráficos
- `getDREReport(period)` → estrutura DRE
- `getDashboardStats(period)` → métricas e séries do dashboard
- `exportFinanceCSV(filters)` → string CSV

### Exportação
- **CSV**: gerado no client a partir do retorno do server fn (download via `Blob`)
- **PDF**: usando `jspdf` + `jspdf-autotable` (puro JS, roda no client) — tanto para lista de movimentações quanto para o DRE formatado

### Navegação
- Adicionar itens "Dashboard" e "Financeiro" no sidebar do admin
- Sub-item "DRE" dentro de Financeiro

## Detalhes técnicos
- Gráficos: `recharts` (já instalado nos projetos shadcn)
- Datas: filtros usam `date-fns`
- Tudo respeita os tokens `oklch` do design system (sem cores hardcoded)
- Modais usam o mesmo padrão responsivo já aplicado (Produtos/Categorias)
- Aproveita a função `has_role` existente para RLS de admin

Confirma essas 3 perguntas (ou diga "pode seguir com os padrões") e eu já começo pela migration.