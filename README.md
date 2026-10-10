# Libras em Cena

Protótipo navegável da companhia de dança, construído a partir do user flow e dos mockups de PI II. Interface em português, responsiva, com identidade em preto e branco e imagens extraídas dos documentos de referência.

## Compartilhar com um testador

A versão para GitHub Pages está pronta em `docs/index.html`, com todas as imagens e scripts incluídos. O testador acessará um site no navegador, sem instalar nada e sem precisar de uma conta no GitHub, se o Pages público estiver disponível para este repositório.

Para ativar a publicação, o administrador do repositório deve abrir **Settings → Pages**, escolher **Deploy from a branch**, selecionar a branch **prototipo-navegavel** e a pasta **/docs**, e clicar em **Save**. O GitHub exibirá o endereço do site nessa tela quando terminar a publicação. Só compartilhe esse endereço depois de abrir e verificar a página.

O endereço previsto, enquanto não verificado como publicado, é `https://tulioapo.github.io/libras_cena/`. Envie ao testador o link do site, e não o endereço do repositório ou do pull request. Dependendo do plano da conta, um repositório privado pode exigir um plano pago para usar Pages. Não é necessário tornar o repositório público para realizar os testes localmente.

Sugestão de mensagem para o testador:

> Olá! Pode testar a navegação do Libras em Cena por este link? Explore os artistas, inscreva-se em uma oficina, experimente a loja e conclua uma compra simulada. Use dados fictícios; nenhum pagamento ou envio é real. Depois, conte onde ficou em dúvida, encontrou um problema ou esperava outro resultado.

Depois de alterar a interface, atualize a versão publicada com `npm run build:pages` e envie também a atualização de `docs/index.html` à branch usada pelo Pages.

## Executar

Para testar sem instalar nada, abra o arquivo `libras-em-cena.html` gerado em `dist/` diretamente em um navegador moderno. O arquivo inclui a interface e as imagens e funciona sem rede. Ele pode ser enviado aos testadores como um único arquivo; se recebido como download, salve-o e abra-o no navegador.

Para desenvolver o projeto:

Use Node.js 22 ou 24 e npm.

```sh
npm ci
npm run dev
```

No ambiente de nuvem, o checkout está em `/workspace/libras_cena`. Se o cache padrão do npm não for gravável, use `npm ci --cache /workspace/.npm-cache`.

## Jornadas disponíveis

- Início: atalhos para agenda, produtos, apoio e elenco.
- Artistas: filtros por categoria, biografia, galeria ampliável e espaço para redes sociais.
- Espetáculos: repertório, sinopse, ficha técnica, links para o elenco e prévia de fotos.
- Agenda: calendário mensal, seleção de datas, detalhes, formulário de inscrição e confirmação.
- Loja: detalhes, fotos, seleção de cor, quantidade e carrinho persistente no navegador.
- Carrinho: alteração de quantidades, remoção de produtos, validação de CEP, entrega simulada e total.
- Checkout e apoio: dados fictícios, Pix ou cartão, aprovação, recusa, expiração, nova tentativa e comprovante de demonstração.
- Contato: formulário validado, confirmação de teste e espaços para canais oficiais.

As rotas usam fragmentos (`#/agenda`, `#/loja/ecobag`, etc.), permitindo hospedar o build em um servidor estático sem regras de redirecionamento de SPA. O botão Voltar do navegador funciona entre as telas.

## Roteiro para teste de navegabilidade

1. Encontre uma coreógrafa e abra sua biografia. Amplie uma foto e volte ao elenco.
2. Abra um espetáculo e encontre um artista na ficha técnica.
3. Na agenda, selecione 30 de junho, abra a oficina e conclua uma inscrição fictícia.
4. Escolha a EcoBag na cor Cru, adicione duas unidades e abra o carrinho. Teste um CEP incompleto e depois `01001000`.
5. Avance ao checkout, preencha os campos com dados fictícios e escolha Pix. Use “Simular pagamento aprovado” para chegar à confirmação e baixar o comprovante.
6. Faça um apoio com valor livre. Simule um Pix expirado, retorne ao pagamento e escolha cartão. O seletor “Resultado do teste de cartão” permite testar aprovação ou recusa.
7. Envie uma mensagem de teste pelo contato. Repita as jornadas em um celular.

Dados de exemplo: `Pessoa de Teste`, `teste@example.com`, CPF `00000000000`, cartão `4242 4242 4242 4242`, validade `12/30`, CVV `123`. O CPF tem apenas validação de formato nesta demonstração.

## Escopo da demonstração

Compras, pagamentos, entrega, inscrições e mensagens são simulados no próprio navegador. Não existe integração com banco, gateway, e-mail, reCAPTCHA ou banco de dados. O desenho de QR Code e o código Pix não permitem pagamento real. Não use dados pessoais ou cartões reais.

Somente produtos, cores e quantidades do carrinho ficam no `localStorage` (`libras-cart`). Os dados digitados nos formulários não são persistidos. Recarregar a página encerra o estado de pagamento e das confirmações; o carrinho permanece até remover os itens ou concluir a compra simulada. Em uma nova tentativa de pagamento, os campos de identificação devem ser preenchidos novamente.

A agenda usa junho de 2026, seguindo os mockups, e não representa eventos confirmados. Biografias, ficha técnica, vagas e locais são ilustrativos. Os documentos não forneceram vídeos reproduzíveis nem endereços oficiais de redes e contato; esses espaços abrem uma explicação no protótipo. A prévia de espetáculos mostra fotos.

As 16 imagens em `public/images` foram extraídas das regiões fotográficas dos mockups anexados, sem copiar as telas como interface. Confirmar os materiais definitivos e suas autorizações de uso antes de uma publicação institucional.

## Build e compartilhamento

```sh
npm run build
npm run preview
```

O build é gerado em `dist/`. Para disponibilizar a outras pessoas, publique o conteúdo dessa pasta em uma hospedagem estática com HTTPS. Nenhuma publicação ou integração externa é realizada automaticamente. A prévia do Vite serve para inspeção local, não é um servidor de produção.

Para gerar novamente o arquivo independente:

```sh
npm run export:demo
```

## Testes

```sh
npx playwright install chromium
npm test
```

O Playwright gera o build e a demo, inicia seu próprio servidor de prévia na porta 4174 e verifica as jornadas, validações, carrinho, confirmações, falhas de pagamento e apresentação mobile. Também carrega o conteúdo completo do HTML independente em um navegador sem rede e conclui uma compra simulada. O Chromium gerenciado da nuvem bloqueia URLs `file://`, por isso esse teste carrega o documento diretamente na página; a abertura pelo sistema de arquivos não foi verificada neste ambiente. Para usar o Chromium já instalado no ambiente de nuvem:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

## Arquivos principais

- `src/main.jsx`: navegação, telas e estado da demonstração.
- `src/data.js`: artistas, espetáculos, atividades e produtos ilustrativos.
- `src/styles.css`: apresentação e adaptação a desktop e celular.
- `tests/navigation.spec.js`: testes de navegabilidade com Playwright.
