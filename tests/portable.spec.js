import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

test("HTML independente carrega sem rede e permite comprar no celular", async ({
  page,
  context,
}) => {
  const errors = [];
  const remoteRequests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (req) => {
    if (/^https?:/.test(req.url())) remoteRequests.push(req.url());
  });
  await context.setOffline(true);
  await page.setViewportSize({ width: 390, height: 844 });
  // Managed cloud Chromium blocks file:// navigation. Load the exact exported
  // document into an offline browser context, without serving its assets.
  await page.setContent(
    await readFile(resolve("dist/libras-em-cena.html"), "utf8"),
  );
  await expect(
    page.getByRole("heading", { name: /Surdos dançam/ }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() =>
        [...document.images].every(
          (img) => img.complete && img.naturalWidth > 0,
        ),
      ),
    )
    .toBe(true);
  await page.getByRole("link", { name: "Ver produto" }).first().click();
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).click();
  await page.getByRole("link", { name: "Ir ao carrinho" }).click();
  await page.getByLabel("CEP de entrega").fill("01001000");
  await page.getByRole("button", { name: "Calcular", exact: true }).click();
  await page.getByRole("link", { name: "Avançar para checkout" }).click();
  await page.getByLabel("Nome completo").fill("Pessoa de Teste");
  await page.getByLabel("E-mail").fill("teste@example.com");
  await page.getByLabel("CPF").fill("00000000000");
  await page.getByRole("textbox", { name: "Número", exact: true }).fill("123");
  await page
    .getByRole("textbox", { name: "Endereço", exact: true })
    .fill("Rua Teste");
  await page
    .getByRole("textbox", { name: "Cidade", exact: true })
    .fill("São Paulo");
  await page.getByLabel("Estado").selectOption("SP");
  await page.getByRole("button", { name: "Continuar com Pix" }).click();
  await expect(page.locator(".qr-panel .price")).toContainText("64,90");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Simular pagamento aprovado" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Pedido confirmado!" }),
  ).toBeVisible();
  expect(remoteRequests).toEqual([]);
  expect(errors).toEqual([]);
});
