import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Check,
  CheckCircle2,
  HeartHandshake,
  Mail,
  Camera,
  Play,
  Copy,
  ChevronLeft,
  ChevronRight,
  Download,
  ShieldCheck,
  Package,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  artists,
  shows,
  events,
  products,
  money,
  dateLabel,
  imageUrl,
} from "./data";
import "./styles.css";

const navItems = [
  ["/", "Início"],
  ["/artistas", "Artistas"],
  ["/espetaculos", "Espetáculos"],
  ["/agenda", "Agenda"],
  ["/apoio", "Apoio"],
  ["/loja", "Loja"],
  ["/contato", "Contato"],
];
const Link = ({ to, children, className = "", ...props }) => (
  <a href={`#${to}`} className={className} {...props}>
    {children}
  </a>
);
const ButtonLink = ({ to, children, secondary = false, ...props }) => (
  <Link to={to} className={`button ${secondary ? "secondary" : ""}`} {...props}>
    {children}
    <ArrowRight size={17} />
  </Link>
);
const Img = ({ name, alt = "", ...props }) => (
  <img src={imageUrl(name)} alt={alt} {...props} />
);
const Brand = () => (
  <span className="brand">
    LIBRAS<span>EM CENA</span>
    <small>C I A D E D A N Ç A</small>
  </span>
);
const Back = ({ to, children }) => (
  <Link to={to} className="back">
    <ArrowLeft size={15} />
    {children}
  </Link>
);
const Field = ({ label, name, required = true, ...props }) => (
  <label className="field">
    <span>
      {label}
      {required && <span aria-hidden="true"> *</span>}
    </span>
    <input name={name} required={required} {...props} />
  </label>
);
const Notice = ({ children }) => (
  <div className="notice">
    <ShieldCheck size={18} />
    <span>{children}</span>
  </div>
);
const PageTitle = ({ eyebrow, title, children }) => (
  <div className="page-title">
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h1>{title}</h1>
    {children && <p className="lead">{children}</p>}
  </div>
);
const Banner = ({ eyebrow, title, children }) => (
  <section className="page-banner">
    <Img name="ensemble" />
    <div className="container">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  </section>
);

function Modal({ modal, close }) {
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      aria-labelledby="modal-title"
    >
      <div className="dialog-inner">
        <button
          className="icon-button dialog-close"
          onClick={close}
          aria-label="Fechar janela"
        >
          <X />
        </button>
        <p className="eyebrow">Libras em Cena</p>
        <h2 id="modal-title">{modal.title}</h2>
        {modal.image && <Img name={modal.image} className="dialog-photo" />}
        <p>{modal.text}</p>
        <button className="button" onClick={close}>
          Continuar navegando
          <ArrowRight size={17} />
        </button>
      </div>
    </dialog>
  );
}

function App() {
  const readRoute = () => (window.location.hash.slice(1) || "/").split("?")[0];
  const [route, setRoute] = useState(readRoute);
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("libras-cart") || "[]");
      return Array.isArray(saved)
        ? saved.filter(
            (x) =>
              products.some(
                (p) => p.id === x.id && p.colors.includes(x.color),
              ) &&
              Number.isInteger(x.qty) &&
              x.qty > 0 &&
              x.qty <= 20,
          )
        : [];
    } catch {
      return [];
    }
  });
  const [shipping, setShipping] = useState(null);
  const [order, setOrder] = useState(null);
  useEffect(() => {
    const handler = () => {
      setRoute(readRoute());
      setMenu(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("libras-cart", JSON.stringify(cart));
    } catch {
      /* Keep navigation working when browser storage is unavailable. */
    }
  }, [cart]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    const label =
      navItems.find(([p]) => p !== "/" && route.startsWith(p))?.[1] ||
      "Arte em movimento";
    document.title = `${label} — Libras em Cena`;
    document.querySelector("main")?.focus({ preventScroll: true });
  }, [route]);
  const navigate = (path) => {
    window.location.hash = path;
  };
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + products.find((p) => p.id === item.id).price * item.qty,
    0,
  );
  const total = subtotal + (shipping?.price || 0);
  const updateCart = (next) => {
    setCart(next);
    setShipping(null);
  };
  const addCart = (id, color, qty) => {
    const existing = cart.find((i) => i.id === id && i.color === color);
    if ((existing?.qty || 0) + qty > 20) {
      setToast("Você pode adicionar até 20 unidades por variação.");
      return;
    }
    updateCart(
      existing
        ? cart.map((i) => (i === existing ? { ...i, qty: i.qty + qty } : i))
        : [...cart, { id, color, qty }],
    );
    setToast("Produto adicionado ao carrinho.");
  };
  const preview = (title, text, image) => setModal({ title, text, image });
  const submitPayment = (payload, method, outcome) => {
    const next = {
      ...payload,
      method,
      status:
        outcome === "recusado"
          ? "failed"
          : method === "pix"
            ? "pending"
            : "approved",
      reference: `DEMO-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    setOrder(next);
    if (next.status === "approved" && next.kind === "shop") updateCart([]);
    navigate(
      next.status === "failed"
        ? "/pagamento/erro"
        : next.status === "approved"
          ? "/pagamento/sucesso"
          : "/pagamento/pix",
    );
  };
  const approvePix = () => {
    setOrder({ ...order, status: "approved" });
    if (order.kind === "shop") updateCart([]);
    navigate("/pagamento/sucesso");
  };
  let content;
  const [section, id, action] = route.split("/").filter(Boolean);
  if (!section) content = <Home preview={preview} />;
  else if (section === "artistas")
    content = id ? <Artist id={id} preview={preview} /> : <Artists />;
  else if (section === "espetaculos")
    content = id ? <Show id={id} preview={preview} /> : <Shows />;
  else if (section === "agenda")
    content = id ? (
      action === "inscricao" ? (
        <Registration id={id} />
      ) : (
        <Event id={id} preview={preview} />
      )
    ) : (
      <Agenda />
    );
  else if (section === "loja")
    content = id ? <Product key={id} id={id} addCart={addCart} /> : <Store />;
  else if (section === "carrinho")
    content = (
      <Cart
        cart={cart}
        updateCart={updateCart}
        shipping={shipping}
        setShipping={setShipping}
        subtotal={subtotal}
        total={total}
      />
    );
  else if (section === "checkout")
    content = (
      <Checkout
        cart={cart}
        shipping={shipping}
        total={total}
        order={order}
        submitPayment={submitPayment}
      />
    );
  else if (section === "apoio")
    content = (
      <Support order={order} submitPayment={submitPayment} preview={preview} />
    );
  else if (section === "contato") content = <Contact preview={preview} />;
  else if (section === "pagamento")
    content = (
      <Payment
        step={id}
        order={order}
        approvePix={approvePix}
        failPix={() => {
          setOrder({ ...order, status: "failed" });
          navigate("/pagamento/erro");
        }}
        notify={setToast}
      />
    );
  else content = <NotFound />;
  return (
    <>
      <a
        className="skip-link"
        href="#conteudo"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector("main")?.focus();
        }}
      >
        Pular para o conteúdo
      </a>
      <div className="prototype-bar">
        <span className="status-dot" />
        Protótipo navegável
        <span className="prototype-detail">
          {" "}
          · Dados ilustrativos. Compras, inscrições e mensagens são simuladas.
        </span>
      </div>
      <header>
        <div className="header-inner container">
          <Link to="/" aria-label="Libras em Cena — Início">
            <Brand />
          </Link>
          <nav aria-label="Navegação principal" className={menu ? "open" : ""}>
            {navItems.map(([path, label]) => (
              <Link
                key={path}
                to={path}
                aria-current={
                  (path === "/" ? route === "/" : route.startsWith(path))
                    ? "page"
                    : undefined
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link
              to="/carrinho"
              className="cart-link"
              aria-label={`Carrinho, ${count} itens`}
            >
              <ShoppingCart size={22} />
              <span>{count}</span>
            </Link>
            <button
              className="icon-button menu-toggle"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label={menu ? "Fechar menu" : "Abrir menu"}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1}>
        {content}
      </main>
      <footer>
        <div className="container footer-inner">
          <Link to="/" aria-label="Libras em Cena — Início">
            <Brand />
          </Link>
          <div>
            <p>Arte que se vê. Movimento que se sente.</p>
            <small>© 2026 Libras em Cena · Versão de demonstração</small>
          </div>
          <div className="footer-links">
            <Link to="/contato">
              Fale com a gente
              <ArrowUpRight />
            </Link>
            <button
              className="social"
              aria-label="Instagram da companhia"
              onClick={() =>
                preview(
                  "Nossas redes",
                  "Os perfis oficiais serão conectados na versão final. Este protótipo não possui links de redes sociais reais.",
                )
              }
            >
              <Camera size={19} />
            </button>
          </div>
        </div>
      </footer>
      {modal && <Modal modal={modal} close={() => setModal(null)} />}
      <div className={`toast ${toast ? "visible" : ""}`} role="status">
        {toast && (
          <>
            <CheckCircle2 size={20} />
            {toast}
            {toast.startsWith("Produto adicionado") && (
              <Link to="/carrinho">Ver carrinho</Link>
            )}
          </>
        )}
      </div>
    </>
  );
}
function ArrowUpRight() {
  return <ArrowRight size={16} className="diagonal-arrow" />;
}

function Home({ preview }) {
  return (
    <>
      <section className="hero">
        <Img name="hero" alt="Artistas dançando juntos em um palco" />
        <div className="container hero-inner">
          <p className="eyebrow">Cultura surda. Arte viva.</p>
          <h1>
            Surdos dançam.
            <br />
            Nós fazemos
            <br />
            <span>isso.</span>
          </h1>
          <p>
            A arte do movimento como expressão
            <br className="desktop-break" /> cultural da comunidade surda.
          </p>
          <ButtonLink to="/agenda" secondary>
            Explore nossa agenda
          </ButtonLink>
          <div className="hero-caption">
            <span>01 /</span>Corpos que contam histórias.
          </div>
        </div>
      </section>
      <section className="container home-products">
        <div className="section-intro">
          <p className="eyebrow">Leve essa ideia</p>
          <h2>
            Arte para
            <br />o seu dia a dia.
          </h2>
          <Link to="/loja" className="text-link">
            Conheça a loja
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="product-strip">
          {products.map((p) => (
            <article className="mini-product" key={p.id}>
              <Link to={`/loja/${p.id}`}>
                <Img name={p.image} alt={p.name} />
              </Link>
              <div>
                <p className="eyebrow">Coleção da companhia</p>
                <h3>{p.name}</h3>
                <p>{money(p.price)}</p>
                <Link to={`/loja/${p.id}`} className="text-link">
                  Ver produto
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="support-strip">
        <div className="container">
          <HeartHandshake size={46} strokeWidth={1} />
          <div>
            <h2>Seu apoio faz a dança continuar.</h2>
            <p>Ajude a manter nossos ensaios, figurinos e oficinas.</p>
          </div>
          <ButtonLink to="/apoio">Apoiar a companhia</ButtonLink>
        </div>
      </section>
      <section className="container section home-events">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Nos encontramos em cena</p>
            <h2>Próximos passos & novidades</h2>
          </div>
          <Link to="/agenda" className="text-link">
            Toda a agenda
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid three">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
      <section className="about-strip container">
        <p className="eyebrow">Muito além do palco</p>
        <h2>
          A nossa língua também
          <br />é <span>movimento.</span>
        </h2>
        <div>
          <p>
            Somos uma companhia de dança que celebra a cultura surda e
            transforma histórias em arte. Conheça quem faz tudo isso acontecer.
          </p>
          <ButtonLink to="/artistas" secondary>
            Conheça nosso elenco
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
function Artists() {
  const [filter, setFilter] = useState("Todos");
  const visible = artists.filter(
    (a) => filter === "Todos" || a.category === filter,
  );
  return (
    <>
      <Banner eyebrow="Quem faz a cena" title="Nosso elenco / artistas">
        Arte, expressão e acessibilidade em cada movimento.
      </Banner>
      <section className="container section">
        <div className="filters" aria-label="Filtrar artistas">
          {["Todos", "Bailarinos", "Coreógrafos", "Produção"].map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={filter === f ? "selected" : ""}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="result-count" aria-live="polite">
          {visible.length} artistas · {filter}
        </p>
        <div className="grid three artist-grid">
          {visible.map((a) => (
            <article className="artist-card" key={a.id}>
              <Link to={`/artistas/${a.id}`} tabIndex={-1} aria-hidden="true">
                <Img name={a.id} alt="" />
              </Link>
              <div>
                <p className="eyebrow">{a.role}</p>
                <h2>{a.name}</h2>
                <Link to={`/artistas/${a.id}`} className="text-link">
                  Ver biografia
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
function Artist({ id, preview }) {
  const a = artists.find((a) => a.id === id);
  if (!a) return <NotFound />;
  return (
    <section className="container section">
      <Back to="/artistas">Voltar para artistas</Back>
      <div className="artist-detail">
        <Img name={a.id} alt={`Retrato de ${a.name}`} />
        <div>
          <p className="eyebrow">{a.role} · Nosso elenco</p>
          <h1>{a.name}</h1>
          <p className="lead">{a.bio}</p>
          <p>
            Acredita em uma arte que se constrói em conjunto e abre espaço para
            novas perspectivas. Na Libras em Cena, participa de um trabalho que
            aproxima cultura, acessibilidade e criação.
          </p>
          <Notice>Biografia ilustrativa, baseada no perfil dos mockups.</Notice>
          <button
            className="button secondary"
            onClick={() =>
              preview(
                `Redes de ${a.name}`,
                "O perfil deste artista é demonstrativo. Os links oficiais serão adicionados quando forem fornecidos.",
              )
            }
          >
            <Camera size={18} />
            Redes do artista
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Em movimento</p>
          <h2>Galeria de fotos</h2>
        </div>
      </div>
      <div className="grid three gallery">
        {["ensemble", "stage", "rehearsal"].map((img, i) => (
          <button
            key={img}
            onClick={() =>
              preview(
                "Um olhar sobre a companhia",
                "Imagem de referência extraída dos mockups enviados para este projeto.",
                img,
              )
            }
            aria-label={`Ampliar foto ${i + 1}`}
          >
            <Img name={img} alt={`Cena da companhia ${i + 1}`} />
            <Plus size={22} />
          </button>
        ))}
      </div>
    </section>
  );
}
function Shows() {
  return (
    <>
      <Banner eyebrow="Nossa trajetória" title="Espetáculos realizados">
        Histórias que já ganharam o palco. E seguem em movimento.
      </Banner>
      <section className="container section">
        {shows.map((s) => (
          <article className="show-row" key={s.id}>
            <Link to={`/espetaculos/${s.id}`}>
              <Img name={s.image} alt={`Cena de ${s.name}`} />
            </Link>
            <div>
              <p className="eyebrow">Repertório · {s.year}</p>
              <h2>{s.name}</h2>
              <p>{s.description}</p>
              <ButtonLink to={`/espetaculos/${s.id}`} secondary>
                Conheça o espetáculo
              </ButtonLink>
            </div>
            <div className="show-facts">
              <h3>Ficha técnica</h3>
              <p>Criação coletiva</p>
              <p>Elenco Libras em Cena</p>
              <p>Dança contemporânea</p>
              <p>Classificação livre · 60 min</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
function Show({ id, preview }) {
  const s = shows.find((s) => s.id === id);
  if (!s) return <NotFound />;
  return (
    <section className="container section">
      <Back to="/espetaculos">Voltar para espetáculos</Back>
      <Img name={s.image} alt={`Cena de ${s.name}`} className="show-cover" />
      <PageTitle eyebrow={`Repertório / ${s.year}`} title={s.name}>
        {s.description}
      </PageTitle>
      <div className="grid two">
        <article className="panel">
          <h2>Conceito e sinopse</h2>
          <p>{s.synopsis}</p>
          <p>
            Uma experiência visual que aproxima o público da cultura surda e da
            potência da criação coletiva.
          </p>
        </article>
        <article className="panel">
          <h2>Ficha técnica e créditos</h2>
          <dl className="facts">
            <div>
              <dt>Criação</dt>
              <dd>Libras em Cena</dd>
            </div>
            <div>
              <dt>Elenco</dt>
              <dd>
                <Link to="/artistas/lucas">Lucas Almeida</Link>,{" "}
                <Link to="/artistas/beatriz">Beatriz Lima</Link> e companhia
              </dd>
            </div>
            <div>
              <dt>Estreia</dt>
              <dd>{s.year}</dd>
            </div>
            <div>
              <dt>Duração</dt>
              <dd>60 minutos · Livre</dd>
            </div>
          </dl>
          <p className="muted">Ficha demonstrativa para teste de navegação.</p>
        </article>
      </div>
      <div className="section-heading">
        <h2>Registro do espetáculo</h2>
        <span className="muted">Prévia visual</span>
      </div>
      <button
        className="media-preview"
        onClick={() =>
          preview(
            s.name,
            "Os documentos incluem imagens do espetáculo, mas não um vídeo reproduzível. Esta é uma prévia de fotos; o vídeo oficial poderá ser conectado depois.",
            s.image,
          )
        }
      >
        <Img name={s.image} />
        <span>
          <Camera size={23} />
          Ver prévia de fotos
        </span>
      </button>
    </section>
  );
}
function EventCard({ event }) {
  return (
    <article className="event-card">
      <Link
        to={`/agenda/${event.id}`}
        className="event-image"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Img name={event.image} />
        <span className="date-badge">
          <strong>{Number(event.date.slice(-2))}</strong>JUN
        </span>
      </Link>
      <div className="event-body">
        <p className="eyebrow">
          {event.type} · {event.time}
        </p>
        <h3>{event.title}</h3>
        <p>
          <MapPin size={14} />
          {event.venue}
        </p>
        <Link className="text-link" to={`/agenda/${event.id}`}>
          Saiba mais
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}
function Agenda() {
  const [month, setMonth] = useState(new Date(2026, 5, 1));
  const [selected, setSelected] = useState("");
  const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
  const monthEvents = events.filter((e) => e.date.startsWith(key));
  const visible = monthEvents.filter((e) => !selected || e.date === selected);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const changeMonth = (delta) => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
    setSelected("");
  };
  return (
    <>
      <Banner eyebrow="Participe" title="Calendário de atividades">
        Um espaço para encontrar, aprender e dançar.
      </Banner>
      <section className="container section">
        <div className="calendar-top">
          <button
            className="icon-button"
            aria-label="Mês anterior"
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeft />
          </button>
          <h2>
            {month.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            className="icon-button"
            aria-label="Próximo mês"
            onClick={() => changeMonth(1)}
          >
            <ChevronRight />
          </button>
          <button
            className="text-link"
            onClick={() => {
              setMonth(new Date(2026, 5, 1));
              setSelected("");
            }}
          >
            Mês de demonstração
          </button>
        </div>
        <div className="calendar" aria-label="Calendário de atividades">
          <div className="calendar-week">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="calendar-days">
            {Array.from({ length: month.getDay() }, (_, i) => (
              <span className="blank-day" key={`blank${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const date = `${key}-${String(i + 1).padStart(2, "0")}`;
              const event = events.find((e) => e.date === date);
              return (
                <button
                  key={date}
                  className={`${event ? "has-event" : ""} ${selected === date ? "selected-day" : ""}`}
                  aria-pressed={selected === date}
                  aria-label={`${i + 1} de ${month.toLocaleDateString("pt-BR", { month: "long" })}${event ? `, ${event.title}` : ""}`}
                  onClick={() => setSelected(selected === date ? "" : date)}
                >
                  <span>{i + 1}</span>
                  {event && (
                    <>
                      <span className="calendar-event desktop">
                        {event.title}
                      </span>
                      <span className="event-dot" />
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="calendar-note">
          <span className="status-dot" />
          Datas com atividades
          <span className="muted">
            Agenda ilustrativa de junho de 2026, conforme os mockups.
          </span>
        </div>
        <div className="section-heading">
          <h2>
            {selected
              ? `Atividades em ${dateLabel(selected)}`
              : "Cronograma do mês"}
          </h2>
          {selected && (
            <button className="text-link" onClick={() => setSelected("")}>
              Ver todo o mês
              <X size={15} />
            </button>
          )}
        </div>
        {visible.length ? (
          <div className="grid three">
            {visible.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <CalendarDays size={36} />
            <h3>Nenhuma atividade nesta data.</h3>
            <p>Escolha outra data ou volte ao mês de demonstração.</p>
            <button
              className="button secondary"
              onClick={() => {
                setMonth(new Date(2026, 5, 1));
                setSelected("");
              }}
            >
              Ver atividades de junho
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>
    </>
  );
}
function Event({ id, preview }) {
  const e = events.find((e) => e.id === id);
  if (!e) return <NotFound />;
  return (
    <section className="container section">
      <Back to="/agenda">Voltar para agenda</Back>
      <PageTitle eyebrow={e.type} title={e.title} />
      <div className="grid two">
        <article className="panel">
          <h2>Informações da atividade</h2>
          <div className="event-facts">
            {[
              [CalendarDays, "Data", dateLabel(e.date)],
              [Clock, "Horário", e.time],
              [MapPin, "Local", e.venue],
              [Users, "Público", "Surdos e ouvintes · A partir de 16 anos"],
            ].map(([Icon, label, value]) => (
              <div key={label}>
                <Icon size={22} />
                <div>
                  <strong>{label}</strong>
                  <p>{value}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="free">Participação gratuita</p>
          <ButtonLink to={`/agenda/${e.id}/inscricao`}>
            Realizar inscrição
          </ButtonLink>
        </article>
        <article className="panel">
          <h2>Sobre a atividade</h2>
          <p>{e.description}</p>
          <h3>Prepare-se para participar</h3>
          <p>
            Venha com roupas confortáveis e uma garrafinha de água. A atividade
            é planejada para favorecer a comunicação visual.
          </p>
          <Notice>{e.slots} vagas demonstrativas disponíveis.</Notice>
          <button
            className="button secondary full"
            onClick={() =>
              preview(
                "Como chegar",
                `${e.venue} · Rua da Dança, 123 — Centro, São Paulo — SP. Endereço ilustrativo dos mockups; não representa um local confirmado.`,
              )
            }
          >
            <MapPin size={18} />
            Como chegar
          </button>
        </article>
      </div>
    </section>
  );
}
function Registration({ id }) {
  const e = events.find((e) => e.id === id);
  const [done, setDone] = useState(false);
  if (!e) return <NotFound />;
  if (done)
    return (
      <section className="container section narrow">
        <div className="success-icon">
          <CheckCircle2 size={45} />
        </div>
        <PageTitle eyebrow="Participação" title="Inscrição confirmada!">
          Você concluiu o fluxo de inscrição de demonstração.
        </PageTitle>
        <div className="panel">
          <h2>{e.title}</h2>
          <p>
            {dateLabel(e.date)} · {e.time}
          </p>
          <p>{e.venue}</p>
          <Notice>
            Nenhuma vaga real foi reservada e nenhum e-mail foi enviado.
          </Notice>
          <ButtonLink to="/agenda">Voltar para a agenda</ButtonLink>
        </div>
      </section>
    );
  return (
    <section className="container section narrow">
      <Back to={`/agenda/${id}`}>Voltar para a atividade</Back>
      <PageTitle eyebrow="Vamos dançar juntos" title="Inscrição na atividade">
        {e.title} · {dateLabel(e.date)}
      </PageTitle>
      <form
        className="panel"
        onSubmit={(event) => {
          event.preventDefault();
          setDone(true);
          window.scrollTo(0, 0);
        }}
      >
        <Notice>
          Use dados fictícios para testar. A inscrição é simulada.
        </Notice>
        <Field
          label="Nome completo"
          name="name"
          autoComplete="off"
          minLength={3}
          placeholder="Seu nome de teste"
        />
        <Field
          label="E-mail para confirmação"
          name="email"
          type="email"
          placeholder="voce@exemplo.com"
        />
        <Field
          label="Telefone / WhatsApp"
          name="phone"
          type="tel"
          pattern="[0-9 ()+\-]{10,18}"
          placeholder="(11) 99999-9999"
        />
        <fieldset>
          <legend>Como você se identifica?</legend>
          {["Pessoa surda", "Pessoa ouvinte", "Prefiro não informar"].map(
            (p, i) => (
              <label className="choice" key={p}>
                <input
                  type="radio"
                  name="profile"
                  value={p}
                  defaultChecked={i === 0}
                />
                {p}
              </label>
            ),
          )}
        </fieldset>
        <label className="field">
          <span>Necessidade de acessibilidade (opcional)</span>
          <textarea
            name="accessibility"
            rows={3}
            placeholder="Conte como podemos acolher você."
          />
        </label>
        <label className="choice check-choice">
          <input type="checkbox" required />
          Li as informações da atividade e entendo que esta inscrição é
          demonstrativa.
        </label>
        <button className="button full">
          Confirmar minha inscrição
          <ArrowRight size={17} />
        </button>
      </form>
    </section>
  );
}
function Store() {
  return (
    <>
      <Banner eyebrow="Vista essa ideia" title="Loja oficial">
        Cada escolha leva um pouco da nossa arte com você.
      </Banner>
      <section className="container section">
        <div className="section-heading">
          <h2>Produtos em destaque</h2>
          <span className="muted">Coleção da companhia · 2 produtos</span>
        </div>
        <div className="grid two store-grid">
          {products.map((p) => (
            <article className="store-card" key={p.id}>
              <Link to={`/loja/${p.id}`}>
                <Img name={p.image} alt={p.name} />
              </Link>
              <div>
                <p className="eyebrow">Libras em Cena</p>
                <h2>{p.name}</h2>
                <p className="price">{money(p.price)}</p>
                <ButtonLink to={`/loja/${p.id}`} secondary>
                  Ver detalhes
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
function Product({ id, addCart }) {
  const p = products.find((p) => p.id === id);
  const [color, setColor] = useState(p?.colors[0]);
  const [qty, setQty] = useState(1);
  const [photo, setPhoto] = useState(p?.detailImage);
  const [added, setAdded] = useState(false);
  if (!p) return <NotFound />;
  const selectColor = (c) => {
    setColor(c);
    if (p.id === "ecobag") setPhoto(c === "Cru" ? "bag-natural" : "bag");
    setAdded(false);
  };
  return (
    <section className="container section">
      <Back to="/loja">Voltar para loja</Back>
      <div className="product-detail">
        <div>
          <Img
            name={photo}
            alt={`${p.name} — ${color}`}
            className="product-photo"
          />
          <div className="thumbnails">
            {[
              p.detailImage,
              ...(p.id === "ecobag" ? ["bag-natural", "bag-lifestyle"] : []),
            ].map((img, i) => (
              <button
                key={img}
                onClick={() => setPhoto(img)}
                aria-label={`Ver foto ${i + 1}`}
                aria-pressed={photo === img}
              >
                <Img name={img} />
              </button>
            ))}
          </div>
        </div>
        <div className="product-info">
          <p className="eyebrow">Coleção Libras em Cena</p>
          <h1>{p.name}</h1>
          <p className="price">{money(p.price)}</p>
          <p>{p.description}</p>
          <ul className="specs">
            {p.specs.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <fieldset>
            <legend>Selecione a cor</legend>
            <div className="color-options">
              {p.colors.map((c) => (
                <label className={color === c ? "active" : ""} key={c}>
                  <input
                    type="radio"
                    name="color"
                    checked={color === c}
                    onChange={() => selectColor(c)}
                  />
                  <span className={`swatch ${c.toLowerCase()}`} />
                  {c}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="qty-label" htmlFor="product-qty">
            Quantidade
          </label>
          <Quantity value={qty} onChange={setQty} id="product-qty" />
          <button
            className="button full"
            onClick={() => {
              addCart(p.id, color, qty);
              setAdded(true);
            }}
          >
            <ShoppingCart size={19} />
            Adicionar ao carrinho
            <ArrowRight size={17} />
          </button>
          {added && (
            <div className="added-actions" role="status">
              <Check size={18} />
              Confira seu carrinho para continuar.
              <Link to="/carrinho" className="text-link">
                Ir ao carrinho
                <ArrowRight size={17} />
              </Link>
              <Link to="/loja">Continuar comprando</Link>
            </div>
          )}
          <Notice>Produto demonstrativo. Nenhuma compra será cobrada.</Notice>
        </div>
      </div>
    </section>
  );
}
function Quantity({ value, onChange, id, label = "Quantidade" }) {
  return (
    <div className="quantity">
      <button
        type="button"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label={`Diminuir ${label.toLowerCase()}`}
      >
        <Minus size={16} />
      </button>
      <input
        id={id}
        aria-label={label}
        type="number"
        min={1}
        max={20}
        value={value}
        onChange={(e) =>
          onChange(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))
        }
      />
      <button
        type="button"
        disabled={value >= 20}
        onClick={() => onChange(Math.min(20, value + 1))}
        aria-label={`Aumentar ${label.toLowerCase()}`}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
function Cart({ cart, updateCart, shipping, setShipping, subtotal, total }) {
  const [cep, setCep] = useState("");
  const [error, setError] = useState("");
  const calculate = (e) => {
    e.preventDefault();
    if (!/^\d{8}$/.test(cep.replace(/\D/g, ""))) {
      setError("Digite um CEP com 8 números.");
      setShipping(null);
      return;
    }
    setError("");
    setShipping({
      name: "Entrega padrão",
      price: 15,
      cep: cep.replace(/\D/g, ""),
      days: "5 a 8 dias úteis",
    });
  };
  return (
    <section className="container section">
      <Back to="/loja">Continuar comprando</Back>
      <PageTitle eyebrow="Sua seleção" title="Seu carrinho de compras" />
      {!cart.length ? (
        <div className="empty-state">
          <ShoppingCart size={42} />
          <h2>Seu carrinho está vazio.</h2>
          <p>Que tal levar um pouco da nossa arte com você?</p>
          <ButtonLink to="/loja">Explorar a loja</ButtonLink>
        </div>
      ) : (
        <>
          <div className="cart-table">
            <div className="cart-table-head">
              <span>Produto</span>
              <span>Quantidade</span>
              <span>Subtotal</span>
              <span />
            </div>
            {cart.map((item, i) => {
              const p = products.find((p) => p.id === item.id);
              return (
                <div className="cart-row" key={`${item.id}${item.color}`}>
                  <div className="cart-product">
                    <Link to={`/loja/${p.id}`}>
                      <Img
                        name={
                          item.color === "Cru" ? "bag-natural" : p.detailImage
                        }
                        alt={p.name}
                      />
                    </Link>
                    <div>
                      <Link to={`/loja/${p.id}`}>
                        <strong>{p.name}</strong>
                      </Link>
                      <p className="muted">
                        Cor: {item.color} · {money(p.price)}
                      </p>
                    </div>
                  </div>
                  <Quantity
                    value={item.qty}
                    label={`Quantidade de ${p.name} ${item.color}`}
                    onChange={(qty) =>
                      updateCart(
                        cart.map((v, j) => (i === j ? { ...v, qty } : v)),
                      )
                    }
                  />
                  <strong>{money(p.price * item.qty)}</strong>
                  <button
                    className="icon-button"
                    aria-label={`Remover ${p.name} ${item.color}`}
                    onClick={() => updateCart(cart.filter((_, j) => i !== j))}
                  >
                    <Trash2 size={19} />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="grid two cart-bottom">
            <article className="panel">
              <h2>Calcular entrega</h2>
              <form onSubmit={calculate}>
                <div className="inline-form">
                  <Field
                    label="CEP de entrega"
                    name="cep"
                    required={false}
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => {
                      setCep(e.target.value);
                      setShipping(null);
                      setError("");
                    }}
                  />
                  <button className="button" type="submit">
                    Calcular
                  </button>
                </div>
                {error && (
                  <p className="error" role="alert">
                    {error}
                  </p>
                )}
              </form>
              {shipping && (
                <div className="shipping-result">
                  <Package size={22} />
                  <div>
                    <strong>
                      {shipping.name} · {money(shipping.price)}
                    </strong>
                    <p>{shipping.days}</p>
                  </div>
                  <CheckCircle2 size={20} />
                </div>
              )}
              <p className="muted">
                Valor e prazo de frete simulados para o teste.
              </p>
            </article>
            <article className="panel order-summary">
              <h2>Resumo do pedido</h2>
              <div>
                <span>Produtos</span>
                <span>{money(subtotal)}</span>
              </div>
              <div>
                <span>Entrega</span>
                <span>
                  {shipping ? money(shipping.price) : "Calcule seu CEP"}
                </span>
              </div>
              <div className="summary-total">
                <strong>Total</strong>
                <strong>{money(total)}</strong>
              </div>
              {shipping ? (
                <ButtonLink to="/checkout">Avançar para checkout</ButtonLink>
              ) : (
                <>
                  <button className="button full" disabled>
                    Avançar para checkout
                    <ArrowRight size={17} />
                  </button>
                  <p className="muted">Calcule a entrega para continuar.</p>
                </>
              )}
              <Notice>Pagamento simulado, sem cobrança.</Notice>
            </article>
          </div>
        </>
      )}
    </section>
  );
}

function PaymentOptions({ method, setMethod, outcome, setOutcome }) {
  return (
    <>
      <fieldset>
        <legend>Forma de pagamento</legend>
        <div className="payment-choices">
          {[
            ["pix", "Pix"],
            ["card", "Cartão de crédito"],
          ].map(([value, label]) => (
            <label key={value} className={method === value ? "active" : ""}>
              <input
                type="radio"
                name="payment"
                value={value}
                checked={method === value}
                onChange={() => setMethod(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      {method === "card" && (
        <div className="card-fields">
          <Notice>
            Use apenas dados fictícios. Exemplo: 4242 4242 4242 4242.
          </Notice>
          <Field
            label="Nome no cartão"
            name="cardName"
            placeholder="Nome de teste"
            autoComplete="off"
          />
          <Field
            label="Número do cartão"
            name="cardNumber"
            inputMode="numeric"
            pattern="[0-9 ]{16,23}"
            minLength={16}
            maxLength={23}
            placeholder="4242 4242 4242 4242"
            autoComplete="off"
          />
          <div className="grid two compact">
            <Field
              label="Validade"
              name="expiry"
              pattern="(0[1-9]|1[0-2])/[0-9]{2}"
              placeholder="12/30"
              maxLength={5}
              autoComplete="off"
            />
            <Field
              label="CVV"
              name="cvv"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{3,4}"
              maxLength={4}
              placeholder="123"
              autoComplete="off"
            />
          </div>
          <label className="field">
            <span>Resultado do teste de cartão</span>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              aria-label="Resultado do teste de cartão"
            >
              <option value="aprovado">Pagamento aprovado</option>
              <option value="recusado">Pagamento recusado</option>
            </select>
          </label>
        </div>
      )}
    </>
  );
}
function Checkout({ cart, shipping, total, order, submitPayment }) {
  const [method, setMethod] = useState(
    order?.kind === "shop" ? order.method : "pix",
  );
  const [outcome, setOutcome] = useState("aprovado");
  if (!cart.length || !shipping)
    return (
      <section className="container section narrow">
        <PageTitle title="Prepare seu pedido" />
        <div className="empty-state">
          <ShoppingCart size={38} />
          <p>Adicione produtos e calcule a entrega antes de finalizar.</p>
          <ButtonLink to="/carrinho">Voltar para o carrinho</ButtonLink>
        </div>
      </section>
    );
  return (
    <section className="container section">
      <Back to="/carrinho">Voltar para carrinho</Back>
      <PageTitle eyebrow="Último passo" title="Finalizar compra">
        Preencha com dados fictícios para experimentar o checkout.
      </PageTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitPayment(
            {
              kind: "shop",
              total,
              items: cart.map((i) => ({
                ...i,
                name: products.find((p) => p.id === i.id).name,
                price: products.find((p) => p.id === i.id).price,
              })),
              shipping: shipping.price,
            },
            method,
            outcome,
          );
        }}
      >
        <div className="grid two checkout-grid">
          <div className="panel">
            <h2>01 / Dados de entrega</h2>
            <Field
              label="Nome completo"
              name="name"
              minLength={3}
              autoComplete="off"
              placeholder="Seu nome de teste"
            />
            <Field
              label="E-mail"
              name="email"
              type="email"
              placeholder="voce@exemplo.com"
            />
            <Field
              label="CPF (fictício, 11 números)"
              name="cpf"
              pattern="[0-9]{11}"
              inputMode="numeric"
              maxLength={11}
              placeholder="00000000000"
            />
            <div className="grid two compact">
              <Field
                label="CEP"
                name="cep"
                defaultValue={shipping.cep}
                readOnly
              />
              <Field label="Número" name="number" placeholder="123" />
            </div>
            <Field
              label="Endereço"
              name="address"
              placeholder="Rua de exemplo"
            />
            <Field
              label="Complemento"
              name="complement"
              required={false}
              placeholder="Apartamento, bloco…"
            />
            <div className="grid two compact">
              <Field label="Cidade" name="city" placeholder="São Paulo" />
              <label className="field">
                <span>Estado *</span>
                <select name="state" required defaultValue="">
                  <option value="" disabled>
                    Selecione
                  </option>
                  {[
                    "AC",
                    "AL",
                    "AP",
                    "AM",
                    "BA",
                    "CE",
                    "DF",
                    "ES",
                    "GO",
                    "MA",
                    "MT",
                    "MS",
                    "MG",
                    "PA",
                    "PB",
                    "PR",
                    "PE",
                    "PI",
                    "RJ",
                    "RN",
                    "RS",
                    "RO",
                    "RR",
                    "SC",
                    "SP",
                    "SE",
                    "TO",
                  ].map((uf) => (
                    <option key={uf}>{uf}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div>
            <div className="panel">
              <h2>02 / Pagamento</h2>
              <PaymentOptions {...{ method, setMethod, outcome, setOutcome }} />
              <div className="checkout-items">
                {cart.map((item) => {
                  const p = products.find((p) => p.id === item.id);
                  return (
                    <div key={`${item.id}${item.color}`}>
                      <Img name={p.detailImage} />
                      <div>
                        <strong>{p.name}</strong>
                        <p>
                          {item.qty} × {money(p.price)} · {item.color}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="summary-total">
                <strong>Total com entrega</strong>
                <strong>{money(total)}</strong>
              </div>
              <Notice>
                Esta experiência não realiza cobranças nem envia dados a
                serviços de pagamento.
              </Notice>
              <button className="button full" type="submit">
                {method === "pix" ? "Continuar com Pix" : "Confirmar pagamento"}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
function Support({ order, submitPayment, preview }) {
  const [amount, setAmount] = useState(
    order?.kind === "support" ? order.total : 50,
  );
  const [method, setMethod] = useState(
    order?.kind === "support" ? order.method : "pix",
  );
  const [outcome, setOutcome] = useState("aprovado");
  return (
    <>
      <Banner
        eyebrow="Faça parte dessa história"
        title="A dança continua com você."
      >
        Seu apoio abre espaço para a arte e a cultura surda.
      </Banner>
      <section className="container section support-page">
        <div className="support-story">
          <button
            className="media-preview"
            onClick={() =>
              preview(
                "Por que seu apoio importa",
                "Sua contribuição ajuda a manter ensaios, criar figurinos e realizar oficinas. Esta é uma apresentação visual de demonstração; não há campanha de arrecadação ativa.",
                "ensemble",
              )
            }
          >
            <Img name="ensemble" />
            <span>
              <Camera size={22} />
              Conheça a companhia
            </span>
          </button>
          <div>
            <p className="eyebrow">Um gesto, muitas possibilidades</p>
            <h2>Por que seu apoio importa?</h2>
            <p>
              Criamos e compartilhamos arte em Libras, ocupando espaços com
              nossos corpos e nossas histórias.
            </p>
            <p>
              O apoio à companhia ajuda a manter os ensaios, produzir
              espetáculos e oferecer oficinas. Juntos, seguimos dançando.
            </p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitPayment(
              {
                kind: "support",
                total: Number(amount),
                items: [
                  { name: "Apoio à companhia", qty: 1, price: Number(amount) },
                ],
                shipping: 0,
              },
              method,
              outcome,
            );
          }}
        >
          <div className="grid two">
            <div className="panel">
              <h2>01 / Escolha o valor do apoio</h2>
              <p>Um pequeno gesto também faz a diferença.</p>
              <div className="amounts">
                {[20, 50, 100].map((v) => (
                  <button
                    type="button"
                    key={v}
                    aria-pressed={Number(amount) === v}
                    className={Number(amount) === v ? "selected" : ""}
                    onClick={() => setAmount(v)}
                  >
                    {money(v)}
                  </button>
                ))}
              </div>
              <Field
                label="Ou digite um valor livre (R$)"
                name="amount"
                type="number"
                min={1}
                max={10000}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="support-impact">
                <HeartHandshake size={32} />
                <h3>Seu gesto transforma.</h3>
                <p>Mais encontros. Mais acesso. Mais arte.</p>
              </div>
              <Notice>
                Contribuição demonstrativa. Nenhum valor será arrecadado.
              </Notice>
            </div>
            <div className="panel">
              <h2>02 / Identificação e pagamento</h2>
              <Field
                label="Nome completo"
                name="name"
                minLength={3}
                placeholder="Seu nome de teste"
              />
              <Field
                label="E-mail"
                name="email"
                type="email"
                placeholder="voce@exemplo.com"
              />
              <Field
                label="CPF (fictício, 11 números)"
                name="cpf"
                pattern="[0-9]{11}"
                maxLength={11}
                inputMode="numeric"
                placeholder="00000000000"
              />
              <PaymentOptions {...{ method, setMethod, outcome, setOutcome }} />
              <div className="summary-total">
                <strong>Seu apoio</strong>
                <strong>{money(Number(amount) || 0)}</strong>
              </div>
              <button className="button full">
                Efetuar contribuição
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

function Payment({ step, order, approvePix, failPix, notify }) {
  const [remaining, setRemaining] = useState(600);
  const [copyError, setCopyError] = useState("");
  useEffect(() => {
    if (step !== "pix" || order?.status !== "pending") return;
    const deadline = new Date(order.createdAt).getTime() + 600000;
    const tick = () =>
      setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [step, order]);
  useEffect(() => {
    if (step === "pix" && remaining === 0 && order?.status === "pending")
      failPix();
  }, [remaining, step]);
  if (!order)
    return (
      <section className="container section narrow">
        <PageTitle title="Nenhum pagamento em andamento" />
        <p>Comece pela loja ou escolha um valor para apoiar a companhia.</p>
        <ButtonLink to="/">Voltar ao início</ButtonLink>
      </section>
    );
  const back = order.kind === "support" ? "/apoio" : "/checkout";
  const approved = order.status === "approved";
  if (step === "sucesso" && approved)
    return (
      <section className="container section narrow payment-success">
        <div className="success-icon">
          <CheckCircle2 size={50} />
        </div>
        <PageTitle
          eyebrow="Jornada concluída"
          title={
            order.kind === "support"
              ? "Obrigado pelo seu apoio!"
              : "Pedido confirmado!"
          }
        >
          Você concluiu o pagamento de demonstração.
        </PageTitle>
        <article className="panel">
          <div className="success-message">
            <CheckCircle2 size={23} />
            <span>Pagamento aprovado na simulação.</span>
          </div>
          <h2>Resumo da transação</h2>
          <dl className="facts">
            <div>
              <dt>Referência</dt>
              <dd>{order.reference}</dd>
            </div>
            <div>
              <dt>Forma de pagamento</dt>
              <dd>{order.method === "pix" ? "Pix" : "Cartão de crédito"}</dd>
            </div>
            {order.items.map((item, i) => (
              <div key={i}>
                <dt>
                  {item.qty} × {item.name}
                </dt>
                <dd>{money(item.price * item.qty)}</dd>
              </div>
            ))}
            {order.shipping > 0 && (
              <div>
                <dt>Entrega simulada</dt>
                <dd>{money(order.shipping)}</dd>
              </div>
            )}
            <div className="summary-total">
              <dt>Total</dt>
              <dd>{money(order.total)}</dd>
            </div>
          </dl>
          <Notice>
            Nenhuma cobrança, entrega, arrecadação ou confirmação por e-mail foi
            realizada.
          </Notice>
          <div className="success-actions">
            <ButtonLink to="/">Voltar ao início</ButtonLink>
            <button
              className="button secondary"
              onClick={() => {
                const text = `COMPROVANTE DE DEMONSTRAÇÃO — SEM VALOR FISCAL\nLibras em Cena\nReferência: ${order.reference}\nPagamento simulado: ${order.method === "pix" ? "Pix" : "Cartão"}\n${order.items.map((i) => `${i.qty} x ${i.name}: ${money(i.qty * i.price)}`).join("\n")}\nEntrega: ${money(order.shipping)}\nTotal: ${money(order.total)}\nNenhuma cobrança real foi realizada.`;
                const blob = new Blob([text], {
                  type: "text/plain;charset=utf-8",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `comprovante-${order.reference}.txt`;
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              }}
            >
              <Download size={16} />
              Baixar comprovante
            </button>
          </div>
        </article>
      </section>
    );
  if (step === "erro" && order.status === "failed")
    return (
      <section className="container section narrow">
        <div className="failure-icon">
          <AlertCircle size={48} />
        </div>
        <PageTitle title="Pagamento não concluído">
          {order.method === "pix"
            ? "O Pix expirou na simulação."
            : "O cartão foi recusado na simulação."}
        </PageTitle>
        <div className="panel">
          <p>
            Nenhum valor foi cobrado. Volte para alterar a forma de pagamento ou
            tentar novamente.
          </p>
          <ButtonLink to={back}>Retornar ao pagamento</ButtonLink>
          <Link to="/" className="text-link">
            Voltar ao início
          </Link>
        </div>
      </section>
    );
  if (step !== "pix" || order.status !== "pending")
    return (
      <section className="container section narrow">
        <PageTitle
          title={
            approved
              ? "Este pagamento já foi concluído"
              : "Este pagamento não está pendente"
          }
        />
        <ButtonLink to={approved ? "/pagamento/sucesso" : back}>
          {approved ? "Ver confirmação" : "Retornar ao pagamento"}
        </ButtonLink>
      </section>
    );
  const code = `DEMONSTRACAO-SEM-VALOR-${order.reference}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyError("");
      notify("Código de demonstração copiado.");
    } catch {
      setCopyError("Copie manualmente o código exibido acima.");
    }
  };
  return (
    <section className="container section">
      <Back to={back}>Alterar forma de pagamento</Back>
      <PageTitle
        eyebrow="Pagamento de demonstração"
        title="Finalizar pagamento via Pix"
      />
      <div className="pix-status">
        <Clock size={24} />
        <div>
          <strong>Aguardando pagamento simulado</strong>
          <p>Este código não permite realizar um pagamento real.</p>
        </div>
        <strong className="timer" aria-label="Tempo restante">
          {String(Math.floor(remaining / 60)).padStart(2, "0")}:
          {String(remaining % 60).padStart(2, "0")}
        </strong>
      </div>
      <div className="grid two">
        <article className="panel qr-panel">
          <h2>01 / Prévia do QR Code</h2>
          <div
            className="demo-qr"
            aria-label="Ilustração demonstrativa, não é um QR Code de pagamento"
          >
            <div className="qr-corner" />
            <div className="qr-corner" />
            <div className="qr-corner" />
            <strong>DEMO</strong>
          </div>
          <p>Ilustração sem valor de pagamento</p>
          <p className="price">{money(order.total)}</p>
        </article>
        <article className="panel">
          <h2>02 / Código de demonstração</h2>
          <p>
            Experimente copiar o código e use os controles abaixo para testar os
            resultados do fluxo.
          </p>
          <label className="field">
            <span>Código sem valor de pagamento</span>
            <input readOnly value={code} onFocus={(e) => e.target.select()} />
          </label>
          <button className="button secondary full" onClick={copy}>
            <Copy size={17} />
            Copiar código
          </button>
          {copyError && <p role="status">{copyError}</p>}
          <Notice>
            Não abra seu banco nem tente pagar. Este é um teste de navegação.
          </Notice>
          <button className="button full" onClick={approvePix}>
            Simular pagamento aprovado
            <CheckCircle2 size={18} />
          </button>
          <button className="text-link simulate-error" onClick={failPix}>
            Simular Pix expirado
            <ArrowRight size={15} />
          </button>
        </article>
      </div>
    </section>
  );
}
function Contact({ preview }) {
  const [done, setDone] = useState(false);
  return (
    <section className="container section">
      <PageTitle eyebrow="Vamos conversar" title="Fale conosco">
        Dúvidas, sugestões ou uma ideia de parceria? Queremos ouvir você.
      </PageTitle>
      <div className="grid two">
        <div className="panel">
          {done ? (
            <div className="contact-success" role="status">
              <CheckCircle2 size={42} />
              <h2>Mensagem registrada no teste!</h2>
              <p>
                Você concluiu o formulário. Nenhuma mensagem foi enviada à
                companhia.
              </p>
              <button
                className="button secondary"
                onClick={() => setDone(false)}
              >
                Enviar outra mensagem
                <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
            >
              <h2>Deixe sua mensagem</h2>
              <Field
                label="Nome completo"
                name="name"
                minLength={3}
                placeholder="Seu nome de teste"
              />
              <Field
                label="E-mail"
                name="email"
                type="email"
                placeholder="voce@exemplo.com"
              />
              <label className="field">
                <span>Mensagem *</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  minLength={10}
                  placeholder="Escreva sua mensagem aqui…"
                />
              </label>
              <label className="choice check-choice">
                <input type="checkbox" required />
                Confirmo que estou enviando uma mensagem de teste.
              </label>
              <button className="button full">
                Enviar mensagem
                <ArrowRight size={17} />
              </button>
              <p className="muted">
                Envio e verificação simulados, sem serviço de e-mail ou
                reCAPTCHA.
              </p>
            </form>
          )}
        </div>
        <article className="panel contact-info">
          <h2>Encontre a companhia</h2>
          <p>
            Os canais abaixo representam os espaços previstos nos mockups. Os
            contatos oficiais serão conectados na versão final.
          </p>
          {[
            [Mail, "E-mail", "Contato por e-mail"],
            [Users, "WhatsApp", "Conversa com a equipe"],
            [MapPin, "Nossa sede", "São Paulo — SP"],
          ].map(([Icon, title, label]) => (
            <button
              className="contact-channel"
              key={title}
              onClick={() =>
                preview(
                  title,
                  "Este canal é ilustrativo. O endereço, telefone ou link oficial ainda não foi fornecido para o protótipo.",
                )
              }
            >
              <Icon size={24} />
              <div>
                <strong>{title}</strong>
                <span>{label}</span>
              </div>
              <ArrowRight size={17} />
            </button>
          ))}
          <h3>Nossas redes</h3>
          <div className="social-row">
            {["Instagram", "YouTube", "Facebook"].map((name, i) => (
              <button
                key={name}
                className="social"
                aria-label={name}
                onClick={() =>
                  preview(
                    name,
                    "O perfil oficial será conectado quando o endereço for fornecido. Você pode continuar explorando o protótipo.",
                  )
                }
              >
                {i === 0 ? (
                  <Camera size={18} />
                ) : i === 1 ? (
                  <Play size={18} />
                ) : (
                  <span>f</span>
                )}
              </button>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
function NotFound() {
  return (
    <section className="container section narrow">
      <PageTitle eyebrow="404" title="Essa cena ainda não existe." />
      <p>O endereço não foi encontrado. Continue pela página inicial.</p>
      <ButtonLink to="/">Voltar ao início</ButtonLink>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
