import { test, expect } from "@playwright/test";

const go = async (page, route = "/") => {
  await page.goto(`/#${route}`);
};
const fillIdentity = async (page) => {
  await page.getByLabel("Nome completo").fill("Pessoa de Teste");
  await page.getByLabel("E-mail", { exact: false }).fill("teste@example.com");
  await page.getByLabel("CPF").fill("00000000000");
};
const fillCard = async (page) => {
  await page.getByLabel("Cartão de crédito", { exact: true }).check();
  await page.getByLabel("Nome no cartão").fill("Pessoa Teste");
  await page.getByLabel("Número do cartão").fill("4242 4242 4242 4242");
  await page.getByLabel("Validade").fill("12/30");
  await page.getByLabel("CVV").fill("123");
};
async function prepareCart(page) {
  await go(page, "/loja/ecobag");
  await page.getByLabel("Cru", { exact: true }).check();
  await page
    .getByRole("button", { name: "Aumentar quantidade", exact: true })
    .click();
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).click();
  await page.getByRole("link", { name: "Ir ao carrinho" }).click();
  await expect(
    page.getByRole("heading", { name: "Seu carrinho de compras" }),
  ).toBeVisible();
  await page.getByLabel("CEP de entrega").fill("01001000");
  await page.getByRole("button", { name: "Calcular", exact: true }).click();
}
async function prepareCheckout(page) {
  await prepareCart(page);
  await page.getByRole("link", { name: "Avançar para checkout" }).click();
  await fillIdentity(page);
  await page.getByRole("textbox", { name: "Número", exact: true }).fill("123");
  await page
    .getByRole("textbox", { name: "Endereço", exact: true })
    .fill("Rua de Teste");
  await page
    .getByRole("textbox", { name: "Cidade", exact: true })
    .fill("São Paulo");
  await page.getByLabel("Estado", { exact: false }).selectOption("SP");
}

test("home, artistas, filtros, perfil, galeria e navegação de volta", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  await go(page);
  await expect(
    page.getByRole("heading", { name: /Surdos dançam/ }),
  ).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Artistas" })
    .click();
  await expect(page.locator(".artist-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Coreógrafos", exact: true }).click();
  await expect(page.locator(".artist-card")).toHaveCount(1);
  await page.getByRole("link", { name: "Ver biografia" }).click();
  await expect(
    page.getByRole("heading", { name: "Mariana Santos", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ampliar foto 1" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("link", { name: "Voltar para artistas" }).click();
  await page.getByRole("button", { name: "Produção", exact: true }).click();
  await expect(page.locator(".artist-card")).toHaveCount(2);
  expect(errors).toEqual([]);
});

test("espetáculo, créditos, prévia e perfil do elenco", async ({ page }) => {
  await go(page, "/espetaculos");
  await page
    .getByRole("link", { name: "Conheça o espetáculo" })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Entre Silêncios", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ver prévia de fotos" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "não um vídeo reproduzível",
  );
  await page.getByRole("button", { name: "Fechar janela" }).click();
  await page.getByRole("link", { name: "Lucas Almeida" }).click();
  await expect(
    page.getByRole("heading", { name: "Lucas Almeida", exact: true }),
  ).toBeVisible();
});

test("agenda, data sem eventos, mês, inscrição e confirmação", async ({
  page,
}) => {
  await go(page, "/agenda");
  await expect(page.locator(".event-card")).toHaveCount(3);
  await page.getByRole("button", { name: "1 de junho", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Nenhuma atividade nesta data." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ver atividades de junho" }).click();
  await page.getByRole("button", { name: "Próximo mês", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "julho de 2026", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".event-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Mês de demonstração" }).click();
  await page.getByRole("button", { name: /30 de junho, Oficina/ }).click();
  await expect(page.locator(".event-card")).toHaveCount(1);
  await page.getByRole("link", { name: "Saiba mais" }).click();
  await page.getByRole("button", { name: "Como chegar" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "não representa um local confirmado",
  );
  await page.getByRole("button", { name: "Continuar navegando" }).click();
  await page.getByRole("link", { name: "Realizar inscrição" }).click();
  await page.getByLabel("Nome completo").fill("Pessoa de Teste");
  await page.getByLabel("E-mail para confirmação").fill("teste@example.com");
  await page.getByLabel("Telefone / WhatsApp").fill("11999999999");
  await page.getByLabel("Li as informações").check();
  await page.getByRole("button", { name: "Confirmar minha inscrição" }).click();
  await expect(
    page.getByRole("heading", { name: "Inscrição confirmada!" }),
  ).toBeVisible();
  await expect(
    page.getByText("Nenhuma vaga real foi reservada", { exact: false }),
  ).toBeVisible();
});

test("carrinho persistente, quantidade, CEP inválido e remoção", async ({
  page,
}) => {
  await prepareCart(page);
  await expect(page.locator(".summary-total")).toContainText("114,80");
  await page.reload();
  await expect(page.locator(".cart-row")).toHaveCount(1);
  await expect(
    page.getByLabel("Quantidade de EcoBag Oficial Cru", { exact: true }),
  ).toHaveValue("2");
  await page
    .getByRole("button", { name: "Diminuir quantidade de ecobag oficial cru" })
    .click();
  await expect(
    page.getByRole("button", { name: "Avançar para checkout" }),
  ).toBeDisabled();
  await page.getByLabel("CEP de entrega").fill("123");
  await page.getByRole("button", { name: "Calcular", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("8 números");
  await page
    .getByRole("button", { name: "Remover EcoBag Oficial Cru" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Seu carrinho está vazio." }),
  ).toBeVisible();
});

test("checkout por Pix, aprovação, total correto e comprovante", async ({
  page,
}) => {
  await prepareCheckout(page);
  await page.getByRole("button", { name: "Continuar com Pix" }).click();
  await expect(
    page.getByRole("heading", { name: "Finalizar pagamento via Pix" }),
  ).toBeVisible();
  await expect(
    page.getByText("Este código não permite realizar um pagamento real."),
  ).toBeVisible();
  await expect(page.locator(".qr-panel .price")).toContainText("114,80");
  await page
    .getByRole("button", { name: "Simular pagamento aprovado" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Pedido confirmado!" }),
  ).toBeVisible();
  await expect(page.locator(".summary-total")).toContainText("114,80");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Baixar comprovante" }).click();
  expect((await downloadPromise).suggestedFilename()).toMatch(
    /^comprovante-DEMO-.*\.txt$/,
  );
  await page.getByRole("link", { name: "Carrinho, 0 itens" }).click();
  await expect(
    page.getByRole("heading", { name: "Seu carrinho está vazio." }),
  ).toBeVisible();
});

test("cartão recusado mantém pedido e permite nova tentativa aprovada", async ({
  page,
}) => {
  await prepareCheckout(page);
  await fillCard(page);
  await page
    .getByLabel("Resultado do teste de cartão")
    .selectOption("recusado");
  await page
    .getByRole("button", { name: "Confirmar pagamento", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Pagamento não concluído" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Carrinho, 2 itens" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Retornar ao pagamento" }).click();
  await fillIdentity(page);
  await page.getByRole("textbox", { name: "Número", exact: true }).fill("123");
  await page
    .getByRole("textbox", { name: "Endereço", exact: true })
    .fill("Rua de Teste");
  await page
    .getByRole("textbox", { name: "Cidade", exact: true })
    .fill("São Paulo");
  await page.getByLabel("Estado").selectOption("SP");
  await fillCard(page);
  await page
    .getByRole("button", { name: "Confirmar pagamento", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Pedido confirmado!" }),
  ).toBeVisible();
});

test("apoio com valor livre, Pix expirado e nova tentativa com cartão", async ({
  page,
}) => {
  await go(page, "/apoio");
  await page.getByRole("button", { name: "R$ 20,00", exact: true }).click();
  await expect(page.getByLabel("Ou digite um valor livre")).toHaveValue("20");
  await page.getByLabel("Ou digite um valor livre").fill("75.50");
  await fillIdentity(page);
  await page.getByRole("button", { name: "Efetuar contribuição" }).click();
  await expect(page.locator(".qr-panel .price")).toContainText("75,50");
  await page.getByRole("button", { name: "Simular Pix expirado" }).click();
  await expect(page.getByText("O Pix expirou na simulação.")).toBeVisible();
  await page.getByRole("link", { name: "Retornar ao pagamento" }).click();
  await expect(page.getByLabel("Ou digite um valor livre")).toHaveValue("75.5");
  await fillIdentity(page);
  await fillCard(page);
  await page.getByRole("button", { name: "Efetuar contribuição" }).click();
  await expect(
    page.getByRole("heading", { name: "Obrigado pelo seu apoio!" }),
  ).toBeVisible();
  await expect(page.locator(".summary-total")).toContainText("75,50");
});

test("contato valida campos e confirma somente envio simulado", async ({
  page,
}) => {
  await go(page, "/contato");
  await page
    .getByRole("button", { name: "Enviar mensagem", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Mensagem registrada no teste!" }),
  ).toHaveCount(0);
  await page.getByLabel("Nome completo").fill("Pessoa Teste");
  await page.getByLabel("E-mail", { exact: false }).fill("teste@example.com");
  await page
    .getByRole("textbox", { name: "Mensagem", exact: false })
    .fill("Olá, esta é uma mensagem de teste de navegabilidade.");
  await page.getByLabel("Confirmo que estou enviando").check();
  await page
    .getByRole("button", { name: "Enviar mensagem", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Mensagem registrada no teste!" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Instagram", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("celular: menu, rotas, fotos carregadas e ausência de overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  await go(page);
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Loja", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Loja oficial", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Abrir menu" }),
  ).toHaveAttribute("aria-expanded", "false");
  for (const route of [
    "/",
    "/artistas",
    "/artistas/mariana",
    "/espetaculos",
    "/agenda",
    "/agenda/oficina-danca",
    "/agenda/oficina-danca/inscricao",
    "/apoio",
    "/loja/ecobag",
    "/contato",
  ]) {
    await go(page, route);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect
      .poll(() =>
        page.evaluate(() =>
          [...document.querySelectorAll("img")].every(
            (img) => img.complete && img.naturalWidth > 0,
          ),
        ),
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `overflow em ${route}`,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("rotas diretas sem estado e página não encontrada", async ({ page }) => {
  await go(page, "/checkout");
  await expect(
    page.getByRole("heading", { name: "Prepare seu pedido" }),
  ).toBeVisible();
  await go(page, "/pagamento/sucesso");
  await expect(
    page.getByRole("heading", { name: "Nenhum pagamento em andamento" }),
  ).toBeVisible();
  await go(page, "/artistas/ausente");
  await expect(
    page.getByRole("heading", { name: "Essa cena ainda não existe." }),
  ).toBeVisible();
});
