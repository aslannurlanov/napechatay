import React from "react";
import {
  ArrowRight,
  X,
  Check,
  Heart,
  PackageCheck,
  Palette,
  Shirt,
  Menu,
  Play,
  Search,
  GripVertical,
  Eye,
  BarChart3,
  Plus,
} from "lucide-react";

const whatsappUrl = "https://wa.me/77019508000";
const instagramUrl = "https://www.instagram.com/napechatay_astana/";

const optimizedAssetMap = {
  "/assets/ai/hero-lifestyle.png": "/assets/optimized/hero-lifestyle.webp",
  "/assets/ai/gallery-gift.png": "/assets/optimized/gallery-gift.webp",
  "/assets/ai/ai-national.png": "/assets/optimized/ai-national.webp",
  "/assets/ai/ai-oversize.png": "/assets/optimized/ai-oversize.webp",
  "/assets/ai/ai-branding.png": "/assets/optimized/ai-branding.webp",
  "/assets/ai/gallery-team.png": "/assets/optimized/gallery-team.webp",
  "/assets/ai/ai-kids.png": "/assets/optimized/ai-kids.webp",
  "/assets/ai/ai-photo.png": "/assets/optimized/ai-photo.webp",
  "/assets/ai/ai-tote.png": "/assets/optimized/ai-tote.webp",
};

function displayAsset(src) {
  return optimizedAssetMap[src] || src;
}

const navItems = [
  ["О нас", "#about"],
  ["Услуги и прайс", "#services"],
  ["Галерея", "#gallery"],
  ["Отзывы", "#reviews"],
  ["FAQ", "#faq"],
];

const fallbackServices = [
  ["national", "/assets/ai/ai-national.png", "Национальный стиль", "от 9 000 ₸", "Современная подача орнаментов и национальных мотивов в принте."],
  ["shirts", "/assets/ai/ai-oversize.png", "Футболки", "от 7 000 ₸", "Базовые и oversize модели с аккуратным DTF-принтом."],
  ["hoodies", "/assets/ai/ai-branding.png", "Толстовки", "от 12 000 ₸", "Плотная посадка, мягкая фактура и выразительный принт."],
  ["merch", "/assets/ai/gallery-team.png", "Корпоративный мерч", "от 10 000 ₸", "Футболки, худи и шопперы для команды, студии или мероприятия."],
  ["kids", "/assets/ai/ai-kids.png", "Детские футболки", "от 6 000 ₸", "Мягкие футболки с ярким и безопасным принтом для детей."],
  ["photo", "/assets/ai/ai-photo.png", "Фото-принты и подарки", "от 6 500 ₸", "Памятные фотографии и коллажи на одежде и подарочных изделиях."],
  ["totes", "/assets/ai/ai-tote.png", "Шопперы с принтом", "от 4 500 ₸", "Практичный шоппер с персональным дизайном, фото или логотипом."],
].map(([key, image, title, price, description], order) => ({
  _id: key,
  key,
  image,
  title,
  price,
  description,
  order,
  active: true,
}));

function useServices() {
  const [services, setServices] = React.useState(fallbackServices);

  React.useEffect(() => {
    let active = true;
    fetch("/api/services")
      .then((response) => response.json())
      .then((data) => {
        if (active && data.ok && Array.isArray(data.services) && data.services.length) setServices(data.services);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return services;
}

const fallbackHero = {
  titleLine1: "Печать,",
  titleLine2: "которая",
  titleLine3: "выглядит дорого",
  subtitle: "DTF-печать для брендов, мерча и личных проектов.",
  image: "/assets/ai/hero-lifestyle.png",
  ctaText: "Смотреть работы",
  ctaLink: "#gallery",
  overlayOpacity: 35,
};

function useSiteContent() {
  const [content, setContent] = React.useState({ hero: fallbackHero, faq: [], gallery: [] });

  React.useEffect(() => {
    let active = true;
    fetch("/api/site-content")
      .then((response) => response.json())
      .then((data) => {
        if (!active || !data.ok) return;
        setContent({
          hero: data.hero || fallbackHero,
          faq: Array.isArray(data.faq) ? data.faq : [],
          gallery: Array.isArray(data.gallery) ? data.gallery : [],
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return content;
}

const priceRows = [
  ["A6", "до 10×14 см", "7 000 ₸", "9 000 ₸"],
  ["A5", "до 14×21 см", "8 500 ₸", "10 500 ₸"],
  ["A4", "до 21×28 см", "10 000 ₸", "12 000 ₸"],
  ["A3", "до 28×38 см", "12 000 ₸", "14 000 ₸"],
];

const galleryPhotos = [
  ["/assets/ai/ai-national.png", "Национальный стиль"],
  ["/assets/ai/ai-tote.png", "Шопперы с принтом"],
  ["/assets/ai/ai-branding.png", "Мерч для брендов"],
  ["/assets/ai/ai-kids.png", "Детские принты"],
];

const galleryVideos = [
  ["/assets/videos/national-style.mp4", "Национальный принт", "/assets/gallery/poster-national.jpg"],
  ["/assets/videos/shopper.mp4", "Шопперы с печатью", "/assets/gallery/poster-shopper.jpg"],
  ["/assets/videos/look.mp4", "Процесс печати", "/assets/gallery/poster-look.jpg"],
];

const reviewProof = [
  ["/assets/reviews/review-story-1.png", "Отзыв Astana Massage", "@astana_massage_kz"],
  ["/assets/reviews/review-story-2.png", "Отзыв о футболках", "@_danamuratovna_"],
  ["/assets/reviews/review-whatsapp.png", "Отзыв в WhatsApp", "WhatsApp"],
];

const faq = [
  ["Можно заказать одну футболку?", "Да. Можно заказать одну футболку, шоппер или небольшой тираж для команды, подарка или бренда."],
  ["Что входит в стоимость?", "В прайсе указана футболка с нанесением. Цена зависит от модели изделия и размера принта."],
  ["Если нет готового макета?", "Можно прислать фото, текст или идею. Мы подскажем, какой файл подойдет, и поможем подготовить макет."],
  ["Как оформить заказ?", "Напишите в WhatsApp +7 701 950 80 00 или оставьте заявку в форме ниже."],
];

function SectionTitle({ eyebrow, title, dark = false }) {
  return (
    <div className="section-title-row flex items-center gap-5">
      <h2 className={`section-heading display-title uppercase leading-none ${dark ? "text-white" : "text-ink"}`}>
        {eyebrow || title}
      </h2>
      <span className={`section-title-rule h-px flex-1 ${dark ? "bg-white/25" : "bg-ink/25"}`} />
    </div>
  );
}

function InstagramMark({ className = "size-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="instagramGradient" x1="4" x2="20" y1="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#feda75" />
          <stop offset="0.35" stopColor="#fa7e1e" />
          <stop offset="0.62" stopColor="#d62976" />
          <stop offset="1" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect width="20" height="20" x="2" y="2" rx="5.5" fill="url(#instagramGradient)" />
      <circle cx="12" cy="12" r="4.2" stroke="white" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="white" />
    </svg>
  );
}

function WhatsAppMark({ className = "size-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#25D366" />
      <path
        fill="white"
        d="M12 5.25a6.32 6.32 0 0 0-5.43 9.56l-.73 2.66 2.73-.72A6.31 6.31 0 1 0 12 5.25Zm0 1.22a5.09 5.09 0 0 1 4.28 7.84 5.08 5.08 0 0 1-6.2 1.83l-.23-.1-1.62.43.43-1.58-.13-.25A5.09 5.09 0 0 1 12 6.47Zm2.87 6.28c-.16-.08-.95-.47-1.1-.52-.15-.05-.25-.08-.36.08-.11.16-.42.52-.52.63-.1.11-.19.12-.35.04-.16-.08-.68-.25-1.29-.8-.48-.43-.8-.95-.89-1.11-.09-.16-.01-.25.07-.33.07-.07.16-.19.24-.28.08-.09.11-.16.16-.27.05-.11.03-.2-.01-.28-.04-.08-.36-.87-.5-1.19-.13-.31-.27-.27-.36-.27h-.31c-.11 0-.28.04-.43.2-.15.16-.56.55-.56 1.34s.58 1.55.66 1.66c.08.11 1.13 1.72 2.74 2.42.38.16.68.26.92.33.39.12.74.1 1.01.06.31-.05.95-.39 1.09-.76.13-.37.13-.7.09-.76-.04-.07-.15-.11-.31-.19Z"
      />
    </svg>
  );
}

function trackWhatsAppClick() {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "whatsapp", path: window.location.pathname }),
    keepalive: true,
  }).catch(() => {});
}

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header fixed left-0 right-0 top-0 z-50">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a href="#top" className="site-header-brand" aria-label="NAPECHATAY — на главную">
          <span>NAPECHATAY</span>
          <small>PRINT · DESIGN</small>
        </a>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Навигация">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="site-header-nav-link body-modern rounded-full px-3 py-2 text-sm font-semibold uppercase"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="site-header-actions flex items-center gap-2">
          <button
            className="site-header-menu-toggle xl:hidden"
            type="button"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <a className="site-header-order px-4 sm:px-5" href="#contacts">
            <span>Заказать</span>
          </a>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" className="site-header-mobile-nav xl:hidden" aria-label="Мобильная навигация">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero({ hero }) {
  const overlayOpacity = Math.max(0, Math.min(80, Number(hero.overlayOpacity ?? 35))) / 100;
  const overlayLeft = Math.min(0.62, overlayOpacity + 0.18);
  const overlayMiddle = Math.max(0.16, overlayOpacity * 0.62);
  return (
    <section id="top" className="hero-section relative overflow-hidden bg-ink text-white">
      <img
        className="hero-bg-image hero-bg-animate absolute left-0 w-full object-cover"
        src={displayAsset(hero.image || fallbackHero.image)}
        alt="Одежда с DTF-принтом в живой lifestyle-съемке"
        width="1893"
        height="831"
        decoding="async"
        fetchPriority="high"
      />
      <div className="hero-contrast-overlay absolute inset-0" style={{ background: `linear-gradient(90deg, rgba(28,21,17,${overlayLeft}) 0%, rgba(28,21,17,${overlayMiddle}) 46%, rgba(28,21,17,0.05) 78%, rgba(28,21,17,0.02) 100%)` }} />
      <div className="hero-depth-overlay absolute inset-0" />
      <div className="hero-stage container-page relative flex items-center justify-start">
        <div className="hero-copy-panel w-full max-w-3xl text-left">
          <h1 className="hero-title max-w-3xl">
            <span>{hero.titleLine1 || fallbackHero.titleLine1}</span>
            <span>{hero.titleLine2 || fallbackHero.titleLine2}</span>
            <span className="hero-title-last">{hero.titleLine3 || fallbackHero.titleLine3}</span>
          </h1>
          <p className="hero-subtitle mt-7 max-w-2xl text-base leading-8 sm:text-xl">
            {hero.subtitle || fallbackHero.subtitle}
          </p>
        </div>
        <div className="hero-cta-wrap hero-actions mt-9 flex justify-start">
          <a className="hero-cta hero-cta-primary" href="#contacts">
            Заказать печать <ArrowRight size={18} />
          </a>
          <a className="hero-cta hero-cta-secondary" href={hero.ctaLink || fallbackHero.ctaLink}>
            {hero.ctaText || fallbackHero.ctaText} <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section-pad bg-paper">
      <div className="container-page">
        <div className="about-layout grid gap-9 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="about-copy">
            <SectionTitle eyebrow="О нас" />
            <h2 className="about-main-title display-title mt-9 text-ink">
              Печать начинается не со станка, а со вкуса.
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-ink/62">
              Мы собираем вокруг принта весь образ: ткань, размер, композицию и подачу. Поэтому готовая вещь выглядит цельно.
            </p>
            <div className="about-note mt-10 max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">designed for your brand</p>
              <p className="mt-4 text-sm leading-7 text-ink/62">
                Каждый заказ собирается как часть образа: от идеи и макета до аккуратной подачи готовой вещи.
              </p>
            </div>
          </div>
          <div className="about-content-grid grid gap-5">
            <div className="about-info-panel rounded-lg border border-ink/8 bg-white p-7 shadow-soft">
              <p className="about-lead text-ink/72">
                NAPECHATAY — студия DTF-печати и дизайна в Астане.
                Работаем с одеждой, мерчем и небольшими брендовыми партиями. Проверяем макеты, подбираем формат и доводим результат до аккуратной подачи.
              </p>
              <div className="about-format-line mt-7">
                <span>DTF печать</span>
                <span>Форматы A6–A3</span>
                <span>От 1 изделия</span>
              </div>
            </div>
            <div className="about-image-frame overflow-hidden rounded-lg p-2">
              <img className="about-image h-full min-h-[320px] w-full rounded-lg object-cover" src="/assets/optimized/gallery-gift.webp" alt="Оформление заказа NAPECHATAY" loading="lazy" decoding="async" width="1600" height="1067" />
            </div>
            <div className="about-steps-grid grid gap-5 sm:grid-cols-3 lg:col-span-2">
              {[
                ["01", "Проверяем макет", "Смотрим качество файла, размер, фон и читаемость."],
                ["02", "Подбираем формат", "A6, A5, A4 или A3 — под изделие и задачу."],
                ["03", "Делаем подачу", "Печать, контроль качества и аккуратная выдача заказа."],
              ].map(([num, title, text]) => (
                <article key={num} className="about-step-card rounded-lg bg-milk p-5">
                  <p className="text-sm font-black text-clay">{num}</p>
                  <h3 className="mt-4 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/60">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesPrice({ services, onChooseService }) {
  const carouselRef = React.useRef(null);

  function scrollServices(direction) {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector(".service-card");
    const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 0;
    const step = (firstCard?.getBoundingClientRect().width || 420) + gap;

    carousel.scrollBy({
      left: direction * step,
      behavior: "smooth",
    });
  }

  return (
    <section id="services" className="section-pad overflow-hidden bg-[#f2f2f0]">
      <div className="container-page">
        <div className="services-header flex flex-col gap-6 lg:flex-row lg:items-end">
          <div className="services-intro max-w-3xl">
            <SectionTitle eyebrow="Услуги и прайс" />
            <p className="mt-6 text-base leading-8 text-ink/62">
              Витрина популярных форматов: от одной футболки до небольшого мерча для команды. Листайте карточки и выбирайте основу, а точную стоимость рассчитаем по макету и тиражу.
            </p>
          </div>
          <div className="service-nav flex gap-3">
            <button className="service-nav-button" type="button" onClick={() => scrollServices(-1)} aria-label="Предыдущие услуги">←</button>
            <button className="service-nav-button" type="button" onClick={() => scrollServices(1)} aria-label="Следующие услуги">→</button>
          </div>
        </div>

        <div className="services-carousel-shell mt-10">
          <div
            ref={carouselRef}
            className="services-carousel -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
          >
            {services.map(({ _id, image: src, title, price, description: text }) => (
              <article
                key={_id}
                className="service-card group snap-start overflow-hidden rounded-lg bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="service-card-media relative overflow-hidden bg-milk">
                  <img className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${title === "Детские футболки" ? "service-image-soft" : ""}`} src={displayAsset(src)} alt={title} loading="lazy" decoding="async" width="1200" height="900" />
                </div>
                <div className="service-card-body grid gap-4 p-5">
                  <div>
                    <h3 className="display-title text-2xl font-bold text-ink">{title}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-ink/58">{text}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="service-card-price">{price}</p>
                    <a className="service-card-cta" href="#contacts" aria-label={`Рассчитать стоимость: ${title}`} onClick={() => onChooseService(title)}>Рассчитать <span>→</span></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="price-panel mt-8 rounded-lg border border-ink/8 bg-white p-5 shadow-soft lg:p-7">
          <div className="price-panel-heading mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="display-title text-4xl font-bold text-ink">Базовый расчет</h3>
              <p className="mt-2 text-sm leading-7 text-ink/55">Размер принта подбирается под изделие и композицию. Финальную стоимость подтвердим после просмотра макета.</p>
            </div>
          </div>
          <div className="price-grid price-matrix -mx-5 flex snap-x overflow-x-auto px-5 pb-3 lg:mx-0 lg:grid lg:grid-cols-4 lg:px-0">
            {priceRows.map(([size, format, standard, oversize]) => (
              <article key={size} className="price-card min-w-[270px] snap-start p-5 sm:min-w-[300px] lg:min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="display-title text-4xl font-bold">{size}</p>
                    <p className="mt-1 text-sm text-ink/52">{format}</p>
                  </div>
                  <span className="price-method">DTF</span>
                </div>
                <div className="mt-6 grid gap-3">
                  <div className="price-tier p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/42">Стандарт</p>
                    <p className="mt-2 text-2xl font-black text-ink">{standard}</p>
                  </div>
                  <div className="price-tier p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/42">Oversize</p>
                    <p className="mt-2 text-2xl font-black text-ink">{oversize}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="price-note mt-5 rounded-lg bg-paper px-5 py-4 text-sm leading-7 text-ink/58">
            Финальная стоимость зависит от изделия, цвета и подготовки макета.
          </p>
        </div>

      </div>
    </section>
  );
}

function Gallery({ gallery }) {
  const [lightbox, setLightbox] = React.useState(null);
  const closeButtonRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const managedImages = gallery.filter((item) => item.type !== "video").map((item) => [item.src, item.title]);
  const managedVideos = gallery.filter((item) => item.type === "video").map((item) => [item.src, item.title, item.poster, item.autoplay, item.muted]);
  const customManagedImages = managedImages.filter(([src]) => !src.startsWith("/assets/ai/"));
  const curatedManagedVideos = managedVideos.filter(([src]) => !src.includes("nike"));
  const photoItems = [...customManagedImages, ...galleryPhotos].slice(0, 4);
  const videoItems = [
    ...curatedManagedVideos,
    ...galleryVideos.filter(([src]) => !curatedManagedVideos.some(([managedSrc]) => managedSrc === src)),
  ].slice(0, 3);

  React.useEffect(() => {
    if (!lightbox) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleEscape);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [lightbox]);

  function openLightbox(item, event) {
    triggerRef.current = event.currentTarget;
    setLightbox(item);
  }

  function closeLightbox() {
    setLightbox(null);
  }

  return (
    <section id="gallery" className="gallery-section section-pad bg-paper">
      <div className="container-page">
        <div className="gallery-heading gallery-heading-row">
          <SectionTitle eyebrow="Фотогалерея" />
          <p>Визуальные направления для одежды, подарков и брендового мерча.</p>
        </div>

        <div className="gallery-grid proof-gallery">
          {photoItems.slice(0, 6).map(([src, alt], index) => (
            <article key={src} className={`proof-item proof-item-${index + 1}`}>
              <button type="button" aria-label={`Открыть фото: ${alt}`} onClick={(event) => openLightbox({ type: "image", src, title: alt }, event)}>
                <img src={displayAsset(src)} alt={alt} loading="lazy" decoding="async" width="900" height="1200" />
                <span>{alt}</span>
              </button>
            </article>
          ))}
        </div>

        <div className="gallery-video-section">
          <SectionTitle eyebrow="Реальные работы" />
          <p>Короткие фрагменты с готовыми изделиями и процессом подготовки.</p>
          <div className="gallery-video-grid mt-7 grid gap-4 md:grid-cols-3">
            {videoItems.map(([src, title, poster, autoplay, muted]) => (
              <article key={src} className="gallery-video-card overflow-hidden rounded-lg bg-ink text-white shadow-soft">
                <button className="gallery-video-trigger block w-full text-left" type="button" aria-label={`Открыть видео: ${title}`} onClick={(event) => openLightbox({ type: "video", src, title, poster }, event)}>
                  <video className="gallery-video aspect-[9/13] w-full object-cover" muted={muted !== false} autoPlay={autoplay === true} playsInline preload={autoplay === true ? "metadata" : "none"} poster={poster || undefined} src={src} />
                  <span className="gallery-play" aria-hidden="true"><Play size={18} fill="currentColor" /></span>
                </button>
                <div className="p-5">
                  <h3>{title}</h3>
                </div>
              </article>
            ))}
          </div>
          <div className="gallery-cta">
            <p>Есть идея или референс?</p>
            <a href="#contacts">Рассчитать мой принт <ArrowRight size={17} /></a>
          </div>
        </div>
      </div>
      {lightbox && (
        <div className="gallery-lightbox fixed inset-0 z-[80] grid place-items-center bg-ink/78 p-4" role="dialog" aria-modal="true" aria-label={lightbox.title} onMouseDown={(event) => { if (event.target === event.currentTarget) closeLightbox(); }}>
          <button ref={closeButtonRef} className="gallery-lightbox-close absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-ink text-white shadow-lift" type="button" onClick={closeLightbox} aria-label="Закрыть">
            <X size={22} />
          </button>
          <div className="w-full max-w-5xl">
            {lightbox.type === "image" ? (
              <img className="max-h-[82vh] w-full rounded-lg object-contain shadow-soft" src={displayAsset(lightbox.src)} alt={lightbox.title} decoding="async" />
            ) : (
              <video className="mx-auto max-h-[82vh] rounded-lg shadow-soft" src={lightbox.src} poster={lightbox.poster} controls autoPlay playsInline />
            )}
            <p className="gallery-lightbox-caption mt-3 text-center text-base font-semibold text-white/90">{lightbox.title}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function OrderSteps() {
  return (
    <section className="order-section bg-white">
      <div className="container-page">
        <div className="order-layout grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div className="order-copy">
            <SectionTitle eyebrow="Как заказать" />
            <h2 className="order-title display-title mt-8 text-ink">
              <span>От идеи</span>
              <span>до готовой вещи.</span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-ink/58">Без лишней суеты и сложностей.</p>
          </div>
          <div className="order-cards-grid grid gap-4 md:grid-cols-3">
            {[
              ["01", "Идея", "Вы отправляете фото, текст, референс или готовый PNG."],
              ["02", "Макет", "Мы проверяем качество, размер принта и подсказываем лучший формат."],
              ["03", "Печать", "Согласуем стоимость, печатаем и готовим заказ к выдаче."],
            ].map(([num, title, text]) => (
              <article key={num} className="order-card rounded-lg border border-ink/8 bg-milk p-6 shadow-sm">
                <p className="order-number display-title text-clay">{num}</p>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/62">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="reviews-section section-pad overflow-hidden bg-[#f3eee7]">
      <div className="container-page">
        <div className="reviews-heading-row">
          <SectionTitle eyebrow="Отзывы" />
          <p>Живые отметки клиентов после получения заказов.</p>
        </div>
        <div className="review-proof-grid">
          {reviewProof.map(([src, alt, source], index) => (
            <figure key={src} className={`review-proof-card review-proof-card-${index + 1}`}>
              <div className="review-proof-media">
                <img src={src} alt={alt} loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <span>{index === 2 ? "Сообщение клиента" : "Отметка клиента"}</span>
                <strong>{source}</strong>
              </figcaption>
            </figure>
          ))}
          </div>
      </div>
    </section>
  );
}

function FAQ({ managedFaq }) {
  const faqItems = managedFaq.length ? managedFaq.map((item) => [item.question, item.answer]) : faq;
  return (
    <section id="faq" className="faq-section bg-paper">
      <div className="container-page">
        <div className="faq-shell grid overflow-hidden rounded-lg border border-ink/8 bg-white shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
          <div className="faq-copy-panel relative bg-ink p-8 text-white sm:p-12">
            <div className="faq-corner absolute right-0 top-0 rounded-bl-[70px] bg-clay" />
            <SectionTitle eyebrow="FAQ" dark />
            <h2 className="faq-title display-title mt-10 text-4xl font-bold leading-[1.18] sm:text-5xl">
              Перед заказом хочется понимать детали.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/62">
              Собрали короткие ответы на вопросы о макете, стоимости и оформлении заказа.
            </p>
            <p className="faq-meta-line">От 1 изделия <span /> Форматы A6–A3</p>
          </div>
          <div className="faq-list flex flex-col justify-center gap-3 p-5 sm:p-8">
            {faqItems.map(([question, answer], index) => (
              <details key={question} className="faq-item group rounded-lg border border-ink/8 bg-milk/70 p-5 open:bg-white open:shadow-sm" open={index === 0}>
                <summary className="cursor-pointer list-none text-lg font-semibold">
                  <span className="flex items-center justify-between gap-4">
                    {question}
                    <span className="grid size-8 place-items-center rounded-full bg-ink text-sm text-white transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <div className="faq-answer">
                  <p className="pt-4 text-sm leading-7 text-ink/62">{answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contacts({ services, selectedService }) {
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    service: "Футболки",
        message: "",
        fileStatus: "Макет есть",
    website: "",
  });
  const [status, setStatus] = React.useState("idle");
  const [notice, setNotice] = React.useState("");

  React.useEffect(() => {
    if (selectedService) setForm((current) => ({ ...current, service: selectedService }));
  }, [selectedService]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitLead(event) {
    event.preventDefault();
    setStatus("loading");
    setNotice("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) throw new Error(data.message || "Request failed");

      setStatus("success");
      setNotice("Заявка отправлена. Мы скоро свяжемся с вами.");
      setForm({ name: "", phone: "", service: "Футболки", message: "", fileStatus: "Макет есть", website: "" });
    } catch (error) {
      setStatus("error");
      setNotice(error.message === "Заявка сохранена, но Telegram временно недоступен."
        ? error.message
        : "Не получилось отправить заявку. Напишите нам в WhatsApp.");
    }
  }

  return (
    <section id="contacts" className="section-pad bg-white">
      <div className="container-page">
        <div className="contacts-shell grid overflow-hidden rounded-lg border border-ink/8 bg-milk shadow-soft lg:grid-cols-[0.86fr_1.14fr]">
          <div className="contacts-copy-panel relative overflow-hidden p-6 sm:p-10 lg:p-12">
            <div className="contacts-decoration absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-clay/15" />
            <SectionTitle eyebrow="Контакты" />
            <h2 className="contacts-title display-title mt-9 max-w-xl text-ink">Готовы сделать свою одежду уникальной?</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink/64">
              Расскажите об изделии, количестве, размере принта и деталях заказа. Мы уточним стоимость и подходящий формат.
            </p>
            <div className="relative mt-8 grid gap-3">
              {[
                "Ответим по стоимости и срокам",
                "Подскажем формат A6, A5, A4 или A3",
                "Можно прийти с идеей без готового макета",
              ].map((item) => (
                <p key={item} className="contacts-check flex items-center gap-3 rounded-lg bg-white/70 p-4 text-sm font-semibold text-ink/72">
                  <Check className="text-clay" size={18} />
                  {item}
                </p>
              ))}
            </div>
            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={trackWhatsAppClick}>WhatsApp <WhatsAppMark className="size-5" /></a>
              <a className="btn-secondary btn-instagram bg-white" href={instagramUrl} target="_blank" rel="noreferrer">Instagram <InstagramMark className="size-5" /></a>
            </div>
          </div>
          <form className="contact-form-panel p-6 text-white sm:p-9 lg:p-11" onSubmit={submitLead}>
            <div className="mb-8">
              <p className="display-title text-4xl font-bold text-white sm:text-5xl">Заявка на печать</p>
              <p className="mt-3 text-sm leading-7 text-white/58">Оставьте контакты и коротко опишите задачу.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Имя
                <input className="form-field min-h-12 rounded-lg px-4 text-white outline-none placeholder:text-white/35" name="name" value={form.name} onChange={updateField} placeholder="Алина" required />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Телефон
                <input className="form-field min-h-12 rounded-lg px-4 text-white outline-none placeholder:text-white/35" name="phone" value={form.phone} onChange={updateField} placeholder="+7 701 000 00 00" required />
              </label>
              <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
                Услуга
                <select className="form-field form-select min-h-12 rounded-lg px-4 text-white outline-none" name="service" value={form.service} onChange={updateField}>
                  {services.map((service) => <option className="text-ink" key={service._id} value={service.title}>{service.title}</option>)}
                  <option className="text-ink">Другое</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
                Макет
                <select className="form-field form-select min-h-12 rounded-lg px-4 text-white outline-none" name="fileStatus" value={form.fileStatus} onChange={updateField}>
                  <option className="text-ink">Макет есть</option>
                  <option className="text-ink">Нужно помочь с макетом</option>
                  <option className="text-ink">Отправлю файл в WhatsApp</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
                Комментарий
                <textarea className="form-field min-h-24 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/35" name="message" value={form.message} onChange={updateField} placeholder="Например: 10 футболок, A4 принт спереди, черный цвет" />
              </label>
              <input className="hidden" name="website" tabIndex="-1" autoComplete="off" value={form.website} onChange={updateField} />
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-clay px-6 text-sm font-semibold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-cocoa disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Отправляем..." : "Отправить заявку"}
                <ArrowRight size={18} />
              </button>
              {notice && <p aria-live="polite" className={`rounded-lg px-4 py-3 text-sm sm:col-span-2 ${status === "success" ? "bg-sage/20 text-white" : "bg-red-500/15 text-red-100"}`}>{notice}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function AuthPage() {
  const [mode, setMode] = React.useState("login");
  const [form, setForm] = React.useState({ username: "", password: "" });
  const [user, setUser] = React.useState(null);
  const [status, setStatus] = React.useState("loading");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user || null);
        setStatus("idle");
      })
      .catch(() => setStatus("idle"));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Не удалось выполнить запрос.");
      if (data.user.role === "admin") {
        window.location.href = "/admin";
        return;
      }
      setUser(data.user);
      setStatus("idle");
      setMessage(mode === "register" ? "Аккаунт создан." : "Вы вошли в аккаунт.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMessage("Вы вышли из аккаунта.");
  }

  return (
    <main className="auth-page">
      <a className="auth-brand brand-script" href="/">Napechatay</a>
      <section className="auth-card">
        {status === "loading" && !user ? (
          <p>Проверяем сессию...</p>
        ) : user ? (
          <div className="auth-account">
            <p className="auth-eyebrow">Аккаунт</p>
            <h1 className="display-title">{user.username}</h1>
            <p>Роль: {user.role === "admin" ? "администратор" : "пользователь"}</p>
            <div className="auth-actions">
              {user.role === "admin" && <a className="admin-primary-button" href="/admin">Открыть админ-панель</a>}
              <button className="admin-secondary-button" type="button" onClick={logout}>Выйти</button>
              <a className="admin-text-link" href="/">Вернуться на сайт</a>
            </div>
            {message && <p className="auth-message">{message}</p>}
          </div>
        ) : (
          <>
            <p className="auth-eyebrow">NAPECHATAY STUDIO</p>
            <h1 className="display-title">{mode === "login" ? "Вход" : "Регистрация"}</h1>
            <p className="auth-description">
              {mode === "login" ? "Введите логин и пароль." : "Создайте аккаунт для работы с сайтом."}
            </p>
            <form className="auth-form" onSubmit={submit}>
              <label>
                Логин
                <input name="username" autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
              </label>
              <label>
                Пароль
                <input type="password" name="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={8} required />
              </label>
              <button className="admin-primary-button" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Подождите..." : mode === "login" ? "Войти" : "Создать аккаунт"}
              </button>
            </form>
            {message && <p className={`auth-message ${status === "error" ? "is-error" : ""}`}>{message}</p>}
            <button className="auth-switch" type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}>
              {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
            </button>
            <a className="admin-text-link" href="/">Вернуться на сайт</a>
          </>
        )}
      </section>
    </main>
  );
}

const leadStatusLabels = {
  new: "Новая",
  in_progress: "В работе",
  waiting_layout: "Ожидает макет",
  printing: "Печать",
  ready: "Готово",
  issued: "Выдано",
  contacted: "Связались",
  done: "Готово",
  canceled: "Отменена",
};

const adminTabs = [
  ["dashboard", "Dashboard"],
  ["leads", "Заявки"],
  ["services", "Услуги"],
  ["hero", "Hero"],
  ["gallery", "Галерея"],
  ["faq", "FAQ"],
];

const contentCategories = ["футболки", "худи", "корпоративный мерч", "национальный стиль", "детские", "фото-принты", "streetwear"];

function AdminPage() {
  const [user, setUser] = React.useState(null);
  const [services, setServices] = React.useState([]);
  const [leads, setLeads] = React.useState([]);
  const [dashboard, setDashboard] = React.useState(null);
  const [hero, setHero] = React.useState(fallbackHero);
  const [adminFaq, setAdminFaq] = React.useState([]);
  const [media, setMedia] = React.useState([]);
  const [status, setStatus] = React.useState("loading");
  const [message, setMessage] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [leadQuery, setLeadQuery] = React.useState("");
  const [leadFilter, setLeadFilter] = React.useState("all");
  const [leadSort, setLeadSort] = React.useState("newest");
  const [selectedLead, setSelectedLead] = React.useState(null);
  const [dragServiceId, setDragServiceId] = React.useState(null);
  const [dragMediaId, setDragMediaId] = React.useState(null);
  const [dragFaqId, setDragFaqId] = React.useState(null);

  async function loadAdmin() {
    try {
      const meResponse = await fetch("/api/auth/me");
      const me = await meResponse.json();
      if (!me.user || me.user.role !== "admin") {
        setUser(me.user || null);
        setStatus("denied");
        return;
      }
      setUser(me.user);
      const [dashboardResponse, servicesResponse, leadsResponse, contentResponse] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/services"),
        fetch("/api/admin/leads"),
        fetch("/api/admin/content"),
      ]);
      const [dashboardData, servicesData, leadsData, contentData] = await Promise.all([
        dashboardResponse.json(),
        servicesResponse.json(),
        leadsResponse.json(),
        contentResponse.json(),
      ]);
      if (!dashboardResponse.ok || !servicesResponse.ok || !leadsResponse.ok || !contentResponse.ok) {
        throw new Error("Не удалось загрузить данные админ-панели.");
      }
      setDashboard(dashboardData.stats || null);
      setServices(servicesData.services || []);
      setLeads(leadsData.leads || []);
      setHero(contentData.hero || fallbackHero);
      setAdminFaq(contentData.faq || []);
      setMedia(contentData.gallery || []);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  React.useEffect(() => {
    loadAdmin();
  }, []);

  async function saveService(event, id) {
    event.preventDefault();
    setMessage("");
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    formData.set("active", formElement.elements.active.checked ? "true" : "false");
    try {
      const response = await fetch(`/api/admin/services/${id}`, { method: "PUT", body: formData });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Не удалось сохранить услугу.");
      setServices((current) => current.map((service) => service._id === id ? data.service : service));
      formElement.elements.image.value = "";
      if (formElement.elements.hoverImage) formElement.elements.hoverImage.value = "";
      setMessage(`Сохранено: ${data.service.title}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function createService(event) {
    event.preventDefault();
    setMessage("");
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    formData.set("active", formElement.elements.active.checked ? "true" : "false");
    try {
      const response = await fetch("/api/admin/services", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Не удалось создать услугу.");
      setServices((current) => [...current, data.service]);
      formElement.reset();
      formElement.elements.active.checked = true;
      setMessage(`Создана карточка: ${data.service.title}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function reorderServices(nextServices) {
    setServices(nextServices);
    await fetch("/api/admin/services/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: nextServices.map((service) => service._id) }),
    }).catch(() => {});
  }

  function moveItem(list, fromId, toId) {
    if (!fromId || fromId === toId) return list;
    const next = [...list];
    const fromIndex = next.findIndex((item) => item._id === fromId);
    const toIndex = next.findIndex((item) => item._id === toId);
    if (fromIndex < 0 || toIndex < 0) return list;
    const [item] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, item);
    return next;
  }

  async function changeLeadStatus(id, nextStatus) {
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const data = await response.json();
    if (response.ok && data.ok) {
      setLeads((current) => current.map((lead) => lead._id === id ? data.lead : lead));
    } else {
      setMessage(data.message || "Не удалось обновить заявку.");
    }
  }

  async function saveHero(event) {
    event.preventDefault();
    setMessage("");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/hero", { method: "PUT", body: formData });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Не удалось сохранить hero.");
      setHero(data.hero);
      event.currentTarget.elements.image.value = "";
      setMessage("Hero сохранен.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function createFaq(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.active = form.elements.active.checked;
    const response = await fetch("/api/admin/faq", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (response.ok && data.ok) {
      setAdminFaq((current) => [...current, data.item]);
      form.reset();
      form.elements.active.checked = true;
    } else {
      setMessage(data.message || "Не удалось создать FAQ.");
    }
  }

  async function saveFaq(event, id) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.active = form.elements.active.checked;
    const response = await fetch(`/api/admin/faq/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (response.ok && data.ok) setAdminFaq((current) => current.map((item) => item._id === id ? data.item : item));
    else setMessage(data.message || "Не удалось сохранить FAQ.");
  }

  async function deleteFaq(id) {
    const response = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    if (response.ok) setAdminFaq((current) => current.filter((item) => item._id !== id));
  }

  async function reorderFaq(nextFaq) {
    setAdminFaq(nextFaq);
    await fetch("/api/admin/faq/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: nextFaq.map((item) => item._id) }),
    }).catch(() => {});
  }

  async function createMedia(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("active", form.elements.active.checked ? "true" : "false");
    formData.set("autoplay", form.elements.autoplay.checked ? "true" : "false");
    formData.set("muted", form.elements.muted.checked ? "true" : "false");
    const response = await fetch("/api/admin/gallery", { method: "POST", body: formData });
    const data = await response.json();
    if (response.ok && data.ok) {
      setMedia((current) => [...current, data.item]);
      form.reset();
      form.elements.active.checked = true;
      form.elements.muted.checked = true;
    } else {
      setMessage(data.message || "Не удалось загрузить медиа.");
    }
  }

  async function deleteMedia(id) {
    const response = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    if (response.ok) setMedia((current) => current.filter((item) => item._id !== id));
  }

  async function reorderMedia(nextMedia) {
    setMedia(nextMedia);
    await fetch("/api/admin/gallery/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: nextMedia.map((item) => item._id) }),
    }).catch(() => {});
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth";
  }

  if (status === "loading") return <main className="admin-state"><p>Загружаем админ-панель...</p></main>;
  if (status === "denied") {
    return (
      <main className="admin-state">
        <h1 className="display-title">Доступ закрыт</h1>
        <p>{user ? "У вашего аккаунта нет роли администратора." : "Войдите под аккаунтом администратора."}</p>
        <a className="admin-primary-button" href="/auth">Перейти ко входу</a>
      </main>
    );
  }

  const filteredLeads = leads
    .filter((lead) => leadFilter === "all" || lead.status === leadFilter)
    .filter((lead) => {
      const haystack = `${lead.name} ${lead.phone} ${lead.service} ${lead.fileStatus} ${lead.message}`.toLowerCase();
      return haystack.includes(leadQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (leadSort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (leadSort === "service") return String(a.service).localeCompare(String(b.service), "ru");
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const stats = [
    ["Новые заявки", dashboard?.newLeads ?? 0],
    ["Заявки за сегодня", dashboard?.todayLeads ?? 0],
    ["Просмотры сайта", dashboard?.views ?? 0],
    ["Популярная услуга", dashboard?.popularService ?? "—"],
    ["Последний заказ", dashboard?.lastOrder ?? "—"],
    ["CTR WhatsApp кнопки", dashboard?.whatsappCtr ?? "0%"],
  ];

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <a className="admin-brand brand-script" href="/">Napechatay</a>
        <p>Content admin panel</p>
        <nav>
          {adminTabs.map(([id, label]) => (
            <button className={activeTab === id ? "is-active" : ""} key={id} type="button" onClick={() => setActiveTab(id)}>{label}</button>
          ))}
        </nav>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <p className="auth-eyebrow">Studio CMS</p>
            <h1>{adminTabs.find(([id]) => id === activeTab)?.[1]}</h1>
          </div>
          <div className="admin-header-actions">
            <span>{user?.username}</span>
            <a className="admin-secondary-button" href="/">Открыть сайт</a>
            <button className="admin-secondary-button" type="button" onClick={logout}>Выйти</button>
          </div>
        </header>

        {message && <p className="admin-notice">{message}</p>}

        {activeTab === "dashboard" && (
          <section className="admin-section">
            <div className="admin-dashboard-grid">
              {stats.map(([label, value]) => (
                <article className="admin-stat-card" key={label}>
                  <div className="admin-stat-icon"><BarChart3 size={18} /></div>
                  <p>{label}</p>
                  <strong>{value}</strong>
                  <span className="admin-mini-chart" />
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "leads" && (
          <section className="admin-section">
            <div className="admin-toolbar">
              <label className="admin-search"><Search size={16} /><input value={leadQuery} onChange={(event) => setLeadQuery(event.target.value)} placeholder="Поиск по имени, телефону, услуге" /></label>
              <select value={leadFilter} onChange={(event) => setLeadFilter(event.target.value)}>
                <option value="all">Все статусы</option>
                {Object.entries(leadStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <select value={leadSort} onChange={(event) => setLeadSort(event.target.value)}>
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
                <option value="service">По услуге</option>
              </select>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Имя</th><th>Телефон</th><th>WhatsApp</th><th>Услуга</th><th>Размер</th><th>Количество</th><th>Статус</th><th>Дата</th><th /></tr></thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead.name}</td>
                      <td><a href={`tel:${lead.phone}`}>{lead.phone}</a></td>
                      <td><a href={`https://wa.me/${String(lead.phone).replace(/\D/g, "")}`} target="_blank" rel="noreferrer">Открыть</a></td>
                      <td>{lead.service}</td>
                      <td>{lead.fileStatus || "—"}</td>
                      <td>—</td>
                      <td>
                        <select value={lead.status} onChange={(event) => changeLeadStatus(lead._id, event.target.value)}>
                          {Object.entries(leadStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      </td>
                      <td>{new Date(lead.createdAt).toLocaleString("ru-RU")}</td>
                      <td><button className="admin-icon-button" type="button" onClick={() => setSelectedLead(lead)}><Eye size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLeads.length === 0 && <p className="admin-empty">Заявок пока нет.</p>}
            </div>
          </section>
        )}

        {activeTab === "services" && (
          <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p className="auth-eyebrow">Каталог</p>
              <h1 className="display-title">Услуги и цены</h1>
            </div>
            <p>Создавайте карточки услуг, меняйте изображения, цены и порядок drag & drop.</p>
          </div>
          <form className="admin-create-card" onSubmit={createService}>
            <h3><Plus size={18} /> Создать карточку услуги</h3>
            <input name="title" placeholder="Название" required />
            <input name="price" placeholder="Цена" required />
            <select name="category" defaultValue="футболки">{contentCategories.map((item) => <option key={item}>{item}</option>)}</select>
            <textarea name="description" placeholder="Описание" required />
            <input name="image" type="file" accept="image/*" required />
            <input name="hoverImage" type="file" accept="image/*" />
            <label className="admin-checkbox"><input name="active" type="checkbox" defaultChecked /> Активна</label>
            <button className="admin-primary-button" type="submit">Создать карточку</button>
          </form>
          <div className="admin-services-grid">
            {services.map((service) => (
              <form className="admin-service-card" key={service._id} draggable onDragStart={() => setDragServiceId(service._id)} onDragOver={(event) => event.preventDefault()} onDrop={() => reorderServices(moveItem(services, dragServiceId, service._id))} onSubmit={(event) => saveService(event, service._id)}>
                <div className="admin-drag-handle"><GripVertical size={16} /> #{service.order + 1}</div>
                <img src={service.image} alt={service.title} />
                <label>Название<input name="title" defaultValue={service.title} required /></label>
                <label>Цена<input name="price" defaultValue={service.price} required /></label>
                <label>Категория<select name="category" defaultValue={service.category || "футболки"}>{contentCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>Порядок<input name="order" type="number" defaultValue={service.order || 0} /></label>
                <label>Описание<textarea name="description" defaultValue={service.description} required /></label>
                <label className="admin-file-field">Новое изображение<input name="image" type="file" accept="image/*" /></label>
                <label className="admin-file-field">Hover image<input name="hoverImage" type="file" accept="image/*" /></label>
                <label className="admin-checkbox"><input name="active" type="checkbox" defaultChecked={service.active} /> Показывать на сайте</label>
                <button className="admin-primary-button" type="submit">Сохранить</button>
              </form>
            ))}
          </div>
          </section>
        )}

        {activeTab === "hero" && (
          <section className="admin-section admin-editor-grid">
            <form className="admin-edit-panel" onSubmit={saveHero}>
              <label>Hero title line 1<input name="titleLine1" defaultValue={hero.titleLine1} /></label>
              <label>Hero title line 2<input name="titleLine2" defaultValue={hero.titleLine2} /></label>
              <label>Hero title line 3<input name="titleLine3" defaultValue={hero.titleLine3} /></label>
              <label>Subtitle<textarea name="subtitle" defaultValue={hero.subtitle} /></label>
              <label>CTA text<input name="ctaText" defaultValue={hero.ctaText} /></label>
              <label>CTA link<input name="ctaLink" defaultValue={hero.ctaLink} /></label>
              <label>Overlay opacity<input name="overlayOpacity" type="range" min="0" max="80" defaultValue={hero.overlayOpacity || 35} /></label>
              <label>Background image<input name="image" type="file" accept="image/*" /></label>
              <button className="admin-primary-button" type="submit">Сохранить hero</button>
            </form>
            <div className="admin-live-preview">
              <img src={hero.image} alt="" />
              <div><strong>{hero.titleLine1} {hero.titleLine2} {hero.titleLine3}</strong><p>{hero.subtitle}</p><span>{hero.ctaText}</span></div>
            </div>
          </section>
        )}

        {activeTab === "gallery" && (
          <section className="admin-section">
            <form className="admin-create-card" onSubmit={createMedia}>
              <h3><Plus size={18} /> Добавить медиа</h3>
              <input name="title" placeholder="Название" required />
              <select name="category" defaultValue="футболки">{contentCategories.map((item) => <option key={item}>{item}</option>)}</select>
              <input name="media" type="file" accept="image/*,video/*" required />
              <input name="poster" type="file" accept="image/*" />
              <label className="admin-checkbox"><input name="active" type="checkbox" defaultChecked /> Показывать</label>
              <label className="admin-checkbox"><input name="autoplay" type="checkbox" /> Autoplay</label>
              <label className="admin-checkbox"><input name="muted" type="checkbox" defaultChecked /> Mute</label>
              <button className="admin-primary-button" type="submit">Загрузить</button>
            </form>
            <div className="admin-media-grid">
              {media.map((item) => (
                <article key={item._id} draggable onDragStart={() => setDragMediaId(item._id)} onDragOver={(event) => event.preventDefault()} onDrop={() => reorderMedia(moveItem(media, dragMediaId, item._id))}>
                  {item.type === "video" ? <video src={item.src} poster={item.poster || undefined} /> : <img src={item.src} alt={item.title} />}
                  <div><GripVertical size={16} /><strong>{item.title}</strong><span>{item.category}</span></div>
                  <button className="admin-secondary-button" type="button" onClick={() => deleteMedia(item._id)}>Удалить</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "faq" && (
          <section className="admin-section">
            <form className="admin-create-card" onSubmit={createFaq}>
              <h3><Plus size={18} /> Добавить FAQ</h3>
              <input name="question" placeholder="Вопрос" required />
              <input name="category" placeholder="Категория" defaultValue="Общее" />
              <textarea name="answer" placeholder="Ответ" required />
              <label className="admin-checkbox"><input name="active" type="checkbox" defaultChecked /> Показывать</label>
              <button className="admin-primary-button" type="submit">Добавить</button>
            </form>
            <div className="admin-faq-list">
              {adminFaq.map((item) => (
                <form key={item._id} draggable onDragStart={() => setDragFaqId(item._id)} onDragOver={(event) => event.preventDefault()} onDrop={() => reorderFaq(moveItem(adminFaq, dragFaqId, item._id))} onSubmit={(event) => saveFaq(event, item._id)}>
                  <div className="admin-drag-handle"><GripVertical size={16} /> FAQ</div>
                  <input name="question" defaultValue={item.question} required />
                  <input name="category" defaultValue={item.category} />
                  <textarea name="answer" defaultValue={item.answer} required />
                  <label className="admin-checkbox"><input name="active" type="checkbox" defaultChecked={item.active} /> Показывать</label>
                  <div className="admin-row-actions"><button className="admin-primary-button" type="submit">Сохранить</button><button className="admin-secondary-button" type="button" onClick={() => deleteFaq(item._id)}>Удалить</button></div>
                </form>
              ))}
            </div>
          </section>
        )}

        {selectedLead && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div>
              <button className="admin-modal-close" type="button" onClick={() => setSelectedLead(null)}>×</button>
              <h2>{selectedLead.name}</h2>
              <p><b>Телефон:</b> {selectedLead.phone}</p>
              <p><b>WhatsApp:</b> <a href={`https://wa.me/${String(selectedLead.phone).replace(/\D/g, "")}`} target="_blank" rel="noreferrer">Открыть чат</a></p>
              <p><b>Услуга:</b> {selectedLead.service}</p>
              <p><b>Макет:</b> {selectedLead.fileStatus}</p>
              <p><b>Комментарий:</b> {selectedLead.message || "—"}</p>
              <p><b>Файлы:</b> нет прикрепленных файлов</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function App() {
  const route = window.location.pathname.replace(/\/+$/, "") || "/";
  React.useEffect(() => {
    if (route === "/admin") return;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "view", path: window.location.pathname }),
    }).catch(() => {});
  }, [route]);
  if (route === "/auth") return <AuthPage />;
  if (route === "/admin") return <AdminPage />;

  return <PublicSite />;
}

function PublicSite() {
  const { hero, faq: managedFaq, gallery } = useSiteContent();
  const services = useServices();
  const [selectedService, setSelectedService] = React.useState("");

  return (
    <>
      <Header />
      <main>
        <Hero hero={hero} />
        <About />
        <ServicesPrice services={services} onChooseService={setSelectedService} />
        <Gallery gallery={gallery} />
        <OrderSteps />
        <Reviews />
        <FAQ managedFaq={managedFaq} />
        <Contacts services={services} selectedService={selectedService} />
      </main>
      <footer className="site-footer bg-paper">
        <div className="footer-inner container-page flex flex-col gap-6 text-sm text-ink/58 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="footer-brand">NAPECHATAY</p>
            <p className="mt-2 text-base text-ink/70">Печать, которую хочется носить.</p>
          </div>
          <div className="md:text-right">
            <p>Astana, Kazakhstan</p>
            <p className="mt-1">© 2026 Napechatay Studio</p>
          </div>
        </div>
      </footer>
    </>
  );
}
