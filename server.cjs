const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");
const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { rateLimit } = require("express-rate-limit");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5173);
const isProduction = process.env.NODE_ENV === "production";
const sessionCookie = "napechatay_session";
const uploadsPath = path.join(__dirname, "uploads");
let cachedChatId = process.env.TELEGRAM_CHAT_ID || "";
let dbAvailable = false;

fs.mkdirSync(uploadsPath, { recursive: true });

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(uploadsPath, { maxAge: isProduction ? "7d" : 0 }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { ok: false, message: "Слишком много попыток. Повторите через 15 минут." },
});

const leadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { ok: false, message: "Слишком много заявок. Повторите позже." },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

const serviceSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, default: "футболки", trim: true },
    image: { type: String, required: true, trim: true },
    hoverImage: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, default: "Не указано", trim: true },
    fileStatus: { type: String, default: "Не указано", trim: true },
    message: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["new", "in_progress", "waiting_layout", "printing", "ready", "issued", "contacted", "done", "canceled"],
      default: "new",
    },
    telegramSent: { type: Boolean, default: false },
    telegramError: { type: String, default: "" },
  },
  { timestamps: true },
);

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, default: "Общее", trim: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    src: { type: String, required: true, trim: true },
    poster: { type: String, default: "", trim: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
    category: { type: String, default: "футболки", trim: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    autoplay: { type: Boolean, default: false },
    muted: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const trackingSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["view", "whatsapp"], required: true },
    path: { type: String, default: "/", trim: true },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
const Service = mongoose.model("Service", serviceSchema);
const Lead = mongoose.model("Lead", leadSchema);
const SiteContent = mongoose.model("SiteContent", siteContentSchema);
const FaqItem = mongoose.model("FaqItem", faqSchema);
const MediaItem = mongoose.model("MediaItem", mediaSchema);
const TrackingEvent = mongoose.model("TrackingEvent", trackingSchema);

const initialServices = [
  ["national", "/assets/ai/ai-national.png", "Национальный стиль", "от 9 000 ₸", "Современная подача орнаментов и национальных мотивов в принте."],
  ["shirts", "/assets/ai/ai-oversize.png", "Футболки", "от 7 000 ₸", "Базовые и oversize модели с аккуратным DTF-принтом."],
  ["hoodies", "/assets/ai/ai-branding.png", "Толстовки", "от 12 000 ₸", "Плотная посадка, мягкая фактура и выразительный принт."],
  ["merch", "/assets/ai/gallery-team.png", "Корпоративный мерч", "от 10 000 ₸", "Футболки, худи и шопперы для команды, студии или мероприятия."],
  ["kids", "/assets/ai/ai-kids.png", "Детские футболки", "от 6 000 ₸", "Мягкие футболки с ярким и безопасным принтом для детей."],
  ["photo", "/assets/ai/ai-photo.png", "Фото-принты и подарки", "от 6 500 ₸", "Памятные фотографии и коллажи на одежде и подарочных изделиях."],
  ["totes", "/assets/ai/ai-tote.png", "Шопперы с принтом", "от 4 500 ₸", "Практичный шоппер с персональным дизайном, фото или логотипом."],
];

const initialFaq = [
  ["Можно заказать одну футболку?", "Да. Можно заказать одну футболку, шоппер или небольшой тираж для команды, подарка или бренда."],
  ["Что входит в стоимость?", "В прайсе указана футболка с нанесением. Цена зависит от модели изделия и размера принта."],
  ["Если нет готового макета?", "Можно прислать фото, текст или идею. Мы подскажем, какой файл подойдет, и поможем подготовить макет."],
  ["Как оформить заказ?", "Напишите в WhatsApp +7 701 950 80 00 или оставьте заявку в форме ниже."],
];

const initialGallery = [
  ["/assets/ai/ai-oversize.png", "Oversize футболка", "футболки"],
  ["/assets/ai/ai-tote.png", "Шоппер с принтом", "streetwear"],
  ["/assets/ai/ai-national.png", "Национальный стиль", "национальный стиль"],
  ["/assets/ai/ai-photo.png", "Фото-принт", "фото-принты"],
  ["/assets/ai/ai-branding.png", "Брендированный мерч", "корпоративный мерч"],
  ["/assets/ai/ai-hero.png", "Студийная подача", "футболки"],
  ["/assets/ai/ai-kids.png", "Детский принт", "детские"],
];

const defaultHeroContent = {
  titleLine1: "Печать,",
  titleLine2: "которая",
  titleLine3: "выглядит дорого",
  subtitle: "DTF-печать для брендов, мерча и личных проектов.",
  image: "/assets/ai/hero-lifestyle.png",
  ctaText: "Смотреть работы",
  ctaLink: "#gallery",
  overlayOpacity: 35,
};

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function publicUser(user) {
  return { id: String(user._id), username: user.username, role: user.role };
}

function signSession(user) {
  return jwt.sign(
    { sub: String(user._id), username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "12h" },
  );
}

function setSessionCookie(res, user) {
  res.cookie(sessionCookie, signSession(user), {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 12 * 60 * 60 * 1000,
    path: "/",
  });
}

async function readSession(req) {
  if (!dbAvailable) return null;
  const token = req.cookies?.[sessionCookie];
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(payload.sub).select("username role").lean();
  } catch {
    return null;
  }
}

async function requireAuth(req, res, next) {
  try {
    const user = await readSession(req);
    if (!user) return res.status(401).json({ ok: false, message: "Нужно войти в аккаунт." });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

async function requireAdmin(req, res, next) {
  try {
    if (!dbAvailable) return res.status(503).json({ ok: false, message: "MongoDB временно недоступна." });
    const user = await readSession(req);
    if (!user) return res.status(401).json({ ok: false, message: "Нужно войти в аккаунт." });
    if (user.role !== "admin") return res.status(403).json({ ok: false, message: "Доступ только для администратора." });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadsPath),
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 8) || ".webp";
      callback(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
      return callback(new Error("Можно загружать только изображения и видео."));
    }
    callback(null, true);
  },
});

function fileUrl(file) {
  return file ? `/uploads/${file.filename}` : "";
}

async function reorderModel(Model, ids = []) {
  await Promise.all(
    ids
      .filter((id) => mongoose.isValidObjectId(id))
      .map((id, order) => Model.findByIdAndUpdate(id, { order })),
  );
}

async function detectChatId(token) {
  const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  const data = await response.json();
  if (!data.ok) throw new Error(data.description || "Telegram getUpdates failed");

  const chats = (data.result || [])
    .map((update) => update.message?.chat || update.channel_post?.chat)
    .filter(Boolean);
  const groupChat = chats.find((chat) => chat.type === "group" || chat.type === "supergroup");
  const chat = groupChat || chats.at(-1);
  return chat?.id ? String(chat.id) : "";
}

async function sendTelegramLead(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  if (!cachedChatId) cachedChatId = await detectChatId(token);
  if (!cachedChatId) throw new Error("TELEGRAM_CHAT_ID is not configured and could not be detected");

  const message = [
    "<b>Новая заявка с сайта NAPECHATAY</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `<b>Услуга:</b> ${escapeHtml(lead.service || "Не указано")}`,
    `<b>Макет:</b> ${escapeHtml(lead.fileStatus || "Не указано")}`,
    `<b>Комментарий:</b> ${escapeHtml(lead.message || "Не указан")}`,
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: cachedChatId, text: message, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  const data = await response.json();
  if (!data.ok) throw new Error(data.description || "Telegram sendMessage failed");
}

app.post("/api/auth/register", authLimiter, async (req, res, next) => {
  try {
    if (!dbAvailable) return res.status(503).json({ ok: false, message: "MongoDB временно недоступна." });
    const username = cleanText(req.body?.username, 32).toLowerCase();
    const password = String(req.body?.password || "");
    if (!/^[a-z0-9_.-]{3,32}$/i.test(username)) {
      return res.status(400).json({ ok: false, message: "Логин: 3–32 символа, латиница, цифры, точка, дефис или _." });
    }
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ ok: false, message: "Пароль должен содержать от 8 до 128 символов." });
    }
    if (username === String(process.env.ADMIN_USERNAME || "").toLowerCase()) {
      return res.status(409).json({ ok: false, message: "Этот логин недоступен." });
    }

    const user = await User.create({ username, passwordHash: await bcrypt.hash(password, 12), role: "user" });
    setSessionCookie(res, user);
    res.status(201).json({ ok: true, user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ ok: false, message: "Такой логин уже занят." });
    next(error);
  }
});

app.post("/api/auth/login", authLimiter, async (req, res, next) => {
  try {
    if (!dbAvailable) return res.status(503).json({ ok: false, message: "MongoDB временно недоступна." });
    const username = cleanText(req.body?.username, 32).toLowerCase();
    const password = String(req.body?.password || "");
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ ok: false, message: "Неверный логин или пароль." });
    }
    setSessionCookie(res, user);
    res.json({ ok: true, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie(sessionCookie, { httpOnly: true, secure: isProduction, sameSite: "strict", path: "/" });
  res.json({ ok: true });
});

app.get("/api/auth/me", async (req, res, next) => {
  try {
    const user = await readSession(req);
    res.json({ ok: true, user: user ? publicUser(user) : null });
  } catch (error) {
    next(error);
  }
});

app.get("/api/services", async (_req, res, next) => {
  try {
    if (!dbAvailable) {
      return res.json({
        ok: true,
        services: initialServices.map(([key, image, title, price, description], order) => ({ _id: key, key, image, title, price, description, order, active: true })),
      });
    }
    const services = await Service.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.json({ ok: true, services });
  } catch (error) {
    next(error);
  }
});

app.get("/api/site-content", async (_req, res, next) => {
  try {
    if (!dbAvailable) {
      return res.json({
        ok: true,
        hero: defaultHeroContent,
        faq: initialFaq.map(([question, answer], order) => ({ _id: `faq-${order}`, question, answer, order, active: true })),
        gallery: initialGallery.map(([src, title, category], order) => ({ _id: `media-${order}`, src, title, category, order, active: true, type: "image" })),
      });
    }
    const [hero, faq, gallery] = await Promise.all([
      SiteContent.findOne({ key: "hero" }).lean(),
      FaqItem.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean(),
      MediaItem.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean(),
    ]);
    res.json({ ok: true, hero: hero?.value || defaultHeroContent, faq, gallery });
  } catch (error) {
    next(error);
  }
});

app.post("/api/track", async (req, res, next) => {
  try {
    if (!dbAvailable) return res.json({ ok: true });
    const type = cleanText(req.body?.type, 20);
    if (!["view", "whatsapp"].includes(type)) return res.json({ ok: true });
    await TrackingEvent.create({ type, path: cleanText(req.body?.path, 160) || "/" });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/services", requireAdmin, async (_req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ ok: true, services });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/dashboard", requireAdmin, async (_req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [newLeads, todayLeads, views, whatsappClicks, popularAgg, lastLead] = await Promise.all([
      Lead.countDocuments({ status: "new" }),
      Lead.countDocuments({ createdAt: { $gte: today } }),
      TrackingEvent.countDocuments({ type: "view" }),
      TrackingEvent.countDocuments({ type: "whatsapp" }),
      Lead.aggregate([{ $group: { _id: "$service", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 1 }]),
      Lead.findOne().sort({ createdAt: -1 }).lean(),
    ]);
    const ctr = views ? `${Math.round((whatsappClicks / views) * 100)}%` : "0%";
    res.json({
      ok: true,
      stats: {
        newLeads,
        todayLeads,
        views,
        popularService: popularAgg[0]?._id || "—",
        lastOrder: lastLead ? `${lastLead.name} · ${lastLead.service}` : "—",
        whatsappCtr: ctr,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/services", requireAdmin, upload.fields([{ name: "image", maxCount: 1 }, { name: "hoverImage", maxCount: 1 }]), async (req, res, next) => {
  try {
    const title = cleanText(req.body.title, 80);
    const price = cleanText(req.body.price, 40);
    const description = cleanText(req.body.description, 300);
    const image = fileUrl(req.files?.image?.[0]) || cleanText(req.body.image, 240);
    if (!title || !price || !description || !image) return res.status(400).json({ ok: false, message: "Заполните название, цену, описание и изображение." });
    const order = await Service.countDocuments();
    const service = await Service.create({
      key: `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
      title,
      price,
      description,
      category: cleanText(req.body.category, 80) || "футболки",
      image,
      hoverImage: fileUrl(req.files?.hoverImage?.[0]) || "",
      order,
      active: req.body.active !== "false",
    });
    res.status(201).json({ ok: true, service });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/services/:id", requireAdmin, upload.fields([{ name: "image", maxCount: 1 }, { name: "hoverImage", maxCount: 1 }]), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ ok: false, message: "Некорректный ID услуги." });
    const update = {
      title: cleanText(req.body.title, 80),
      price: cleanText(req.body.price, 40),
      description: cleanText(req.body.description, 300),
      category: cleanText(req.body.category, 80) || "футболки",
      order: Number(req.body.order || 0),
      active: req.body.active !== "false",
    };
    if (!update.title || !update.price || !update.description) {
      return res.status(400).json({ ok: false, message: "Заполните название, цену и описание." });
    }
    if (req.files?.image?.[0]) update.image = fileUrl(req.files.image[0]);
    if (req.files?.hoverImage?.[0]) update.hoverImage = fileUrl(req.files.hoverImage[0]);

    const previous = await Service.findById(req.params.id);
    if (!previous) return res.status(404).json({ ok: false, message: "Услуга не найдена." });
    const service = await Service.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });

    if (req.files?.image?.[0] && previous.image.startsWith("/uploads/")) {
      fs.rm(path.join(uploadsPath, path.basename(previous.image)), { force: true }, () => {});
    }
    if (req.files?.hoverImage?.[0] && previous.hoverImage?.startsWith("/uploads/")) {
      fs.rm(path.join(uploadsPath, path.basename(previous.hoverImage)), { force: true }, () => {});
    }
    res.json({ ok: true, service });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/services/reorder", requireAdmin, async (req, res, next) => {
  try {
    await reorderModel(Service, Array.isArray(req.body?.ids) ? req.body.ids : []);
    const services = await Service.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ ok: true, services });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/leads", requireAdmin, async (_req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(300).lean();
    res.json({ ok: true, leads });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/leads/:id", requireAdmin, async (req, res, next) => {
  try {
    const allowed = ["new", "in_progress", "waiting_layout", "printing", "ready", "issued", "contacted", "done", "canceled"];
    if (!mongoose.isValidObjectId(req.params.id) || !allowed.includes(req.body?.status)) {
      return res.status(400).json({ ok: false, message: "Некорректный статус." });
    }
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!lead) return res.status(404).json({ ok: false, message: "Заявка не найдена." });
    res.json({ ok: true, lead });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/content", requireAdmin, async (_req, res, next) => {
  try {
    const [hero, faq, gallery] = await Promise.all([
      SiteContent.findOne({ key: "hero" }).lean(),
      FaqItem.find().sort({ order: 1, createdAt: 1 }).lean(),
      MediaItem.find().sort({ order: 1, createdAt: 1 }).lean(),
    ]);
    res.json({ ok: true, hero: hero?.value || defaultHeroContent, faq, gallery });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/hero", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    const current = await SiteContent.findOne({ key: "hero" }).lean();
    const previous = current?.value || defaultHeroContent;
    const value = {
      ...previous,
      titleLine1: cleanText(req.body.titleLine1, 80) || previous.titleLine1,
      titleLine2: cleanText(req.body.titleLine2, 80) || previous.titleLine2,
      titleLine3: cleanText(req.body.titleLine3, 80) || previous.titleLine3,
      subtitle: cleanText(req.body.subtitle, 180) || previous.subtitle,
      ctaText: cleanText(req.body.ctaText, 60) || previous.ctaText,
      ctaLink: cleanText(req.body.ctaLink, 120) || previous.ctaLink,
      overlayOpacity: Math.max(0, Math.min(80, Number(req.body.overlayOpacity ?? previous.overlayOpacity ?? 35))),
    };
    if (req.file) value.image = fileUrl(req.file);
    const doc = await SiteContent.findOneAndUpdate({ key: "hero" }, { key: "hero", value }, { new: true, upsert: true });
    res.json({ ok: true, hero: doc.value });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/faq", requireAdmin, async (req, res, next) => {
  try {
    const question = cleanText(req.body.question, 180);
    const answer = cleanText(req.body.answer, 900);
    if (!question || !answer) return res.status(400).json({ ok: false, message: "Заполните вопрос и ответ." });
    const item = await FaqItem.create({
      question,
      answer,
      category: cleanText(req.body.category, 80) || "Общее",
      order: await FaqItem.countDocuments(),
      active: req.body.active !== false,
    });
    res.status(201).json({ ok: true, item });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/faq/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ ok: false, message: "Некорректный ID FAQ." });
    const item = await FaqItem.findByIdAndUpdate(req.params.id, {
      question: cleanText(req.body.question, 180),
      answer: cleanText(req.body.answer, 900),
      category: cleanText(req.body.category, 80) || "Общее",
      active: req.body.active !== false,
    }, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ ok: false, message: "FAQ не найден." });
    res.json({ ok: true, item });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/faq/reorder", requireAdmin, async (req, res, next) => {
  try {
    await reorderModel(FaqItem, Array.isArray(req.body?.ids) ? req.body.ids : []);
    const faq = await FaqItem.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ ok: true, faq });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/faq/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ ok: false, message: "Некорректный ID FAQ." });
    await FaqItem.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/gallery", requireAdmin, upload.fields([{ name: "media", maxCount: 1 }, { name: "poster", maxCount: 1 }]), async (req, res, next) => {
  try {
    const mediaFile = req.files?.media?.[0];
    const title = cleanText(req.body.title, 120);
    if (!mediaFile || !title) return res.status(400).json({ ok: false, message: "Загрузите файл и укажите название." });
    const item = await MediaItem.create({
      title,
      src: fileUrl(mediaFile),
      poster: fileUrl(req.files?.poster?.[0]),
      type: mediaFile.mimetype.startsWith("video/") ? "video" : "image",
      category: cleanText(req.body.category, 80) || "футболки",
      order: await MediaItem.countDocuments(),
      active: req.body.active !== "false",
      autoplay: req.body.autoplay === "true",
      muted: req.body.muted !== "false",
    });
    res.status(201).json({ ok: true, item });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/gallery/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ ok: false, message: "Некорректный ID медиа." });
    const item = await MediaItem.findByIdAndUpdate(req.params.id, {
      title: cleanText(req.body.title, 120),
      category: cleanText(req.body.category, 80) || "футболки",
      active: req.body.active !== false,
      autoplay: req.body.autoplay === true,
      muted: req.body.muted !== false,
    }, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ ok: false, message: "Медиа не найдено." });
    res.json({ ok: true, item });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/gallery/reorder", requireAdmin, async (req, res, next) => {
  try {
    await reorderModel(MediaItem, Array.isArray(req.body?.ids) ? req.body.ids : []);
    const gallery = await MediaItem.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ ok: true, gallery });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/gallery/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ ok: false, message: "Некорректный ID медиа." });
    const item = await MediaItem.findByIdAndDelete(req.params.id);
    if (item?.src?.startsWith("/uploads/")) fs.rm(path.join(uploadsPath, path.basename(item.src)), { force: true }, () => {});
    if (item?.poster?.startsWith("/uploads/")) fs.rm(path.join(uploadsPath, path.basename(item.poster)), { force: true }, () => {});
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/lead", leadLimiter, async (req, res, next) => {
  try {
    if (!dbAvailable) return res.status(503).json({ ok: false, message: "MongoDB временно недоступна. Напишите нам в WhatsApp." });
    const website = cleanText(req.body?.website, 100);
    if (website) return res.json({ ok: true });

    const leadData = {
      name: cleanText(req.body?.name, 80),
      phone: cleanText(req.body?.phone, 40),
      service: cleanText(req.body?.service, 120) || "Не указано",
      fileStatus: cleanText(req.body?.fileStatus, 120) || "Не указано",
      message: cleanText(req.body?.message, 1000),
    };
    if (!leadData.name || !leadData.phone) {
      return res.status(400).json({ ok: false, message: "Укажите имя и телефон." });
    }

    const lead = await Lead.create(leadData);
    try {
      await sendTelegramLead(leadData);
      lead.telegramSent = true;
      await lead.save();
      res.status(201).json({ ok: true, leadId: String(lead._id) });
    } catch (telegramError) {
      lead.telegramError = cleanText(telegramError.message, 300);
      await lead.save();
      console.error("Telegram delivery failed:", telegramError.message);
      res.status(502).json({ ok: false, saved: true, message: "Заявка сохранена, но Telegram временно недоступен." });
    }
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ ok: false, message: error.code === "LIMIT_FILE_SIZE" ? "Файл больше 8 МБ." : "Ошибка загрузки файла." });
  }
  if (error?.message === "Можно загружать только изображения и видео.") {
    return res.status(400).json({ ok: false, message: error.message });
  }
  res.status(500).json({ ok: false, message: "Внутренняя ошибка сервера." });
});

async function ensureAdmin() {
  const username = cleanText(process.env.ADMIN_USERNAME, 32).toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");
  if (!username || password.length < 8) throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be configured");

  await User.updateMany({ username: { $ne: username }, role: "admin" }, { $set: { role: "user" } });
  let admin = await User.findOne({ username });
  if (!admin) {
    admin = await User.create({ username, passwordHash: await bcrypt.hash(password, 12), role: "admin" });
    console.log(`Admin user created: ${username}`);
    return;
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) admin.passwordHash = await bcrypt.hash(password, 12);
  admin.role = "admin";
  await admin.save();
}

async function migrateLegacyIndexes() {
  const collection = mongoose.connection.db.collection("users");
  const indexes = await collection.indexes();
  const legacyEmailIndex = indexes.find((index) => index.name === "email_1");
  if (legacyEmailIndex) {
    await collection.dropIndex("email_1");
    console.log("Legacy users.email index removed");
  }
}

async function ensureServices() {
  if (await Service.exists({})) return;
  await Service.insertMany(
    initialServices.map(([key, image, title, price, description], order) => ({ key, image, title, price, description, order, category: key })),
  );
  console.log("Default services created");
}

async function ensureContent() {
  await SiteContent.updateOne({ key: "hero" }, { $setOnInsert: { key: "hero", value: defaultHeroContent } }, { upsert: true });
  if (!(await FaqItem.exists({}))) {
    await FaqItem.insertMany(initialFaq.map(([question, answer], order) => ({ question, answer, order })));
    console.log("Default FAQ created");
  }
  if (!(await MediaItem.exists({}))) {
    await MediaItem.insertMany(initialGallery.map(([src, title, category], order) => ({ src, title, category, order, type: "image" })));
    console.log("Default gallery created");
  }
}

async function start() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must contain at least 32 characters");

  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    dbAvailable = true;
    console.log("MongoDB connected");
    await migrateLegacyIndexes();
    await ensureAdmin();
    await ensureServices();
    await ensureContent();
  } catch (error) {
    dbAvailable = false;
    console.warn(`MongoDB unavailable, starting local preview mode: ${error.message}`);
  }

  if (isProduction) {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.use((req, res, next) => {
      if (req.method !== "GET" || req.path.startsWith("/api/") || req.path.startsWith("/uploads/")) return next();
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  }

  app.listen(port, "0.0.0.0", () => console.log(`NAPECHATAY site running at http://localhost:${port}`));
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
