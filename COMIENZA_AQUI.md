# 🚀 COMIENZA AQUÍ — Guía de Lectura Rápida

Bienvenido. Este documento te guía por la web cinematográfica que acabamos de construir.

---

## ⚡ 60 Segundos: ¿Qué Tenemos?

✅ **7 capítulos cinematográficos** (scroll-driven narrativo)  
✅ **Formulario funcional** con validación y precios reales  
✅ **GSAP + ScrollTrigger** (animaciones sincronizadas)  
✅ **Build sin errores** (Next.js 15 compilado)  
✅ **Sistema de diseño centralizado** (tokens, colors, motion)  
✅ **Responsive + Accesible** (mobile-first, WCAG)  

❌ **Imágenes:** Aún no generadas (ver paso 1)  
❌ **Backend formulario:** Aún no conectado (ver paso 2)  

---

## 📖 Lectura en Orden

### **1. Resumen Ejecutivo (5 min)**
📄 **[PROYECTO_RESUMEN.md](./PROYECTO_RESUMEN.md)**
- Qué se hizo exactamente
- Lista de 7 capítulos
- Checklist de pendientes

### **2. Guía de Imágenes (10 min)**
📸 **[ASSETS_GUIDE.md](./ASSETS_GUIDE.md)**
- 10 prompts listos para generar
- Estructura de carpetas
- Resoluciones recomendadas
- **ACCIÓN:** Genera las imágenes aquí

### **3. Instrucciones Técnicas (15 min)**
🔧 **[README_CINEMATICO.md](./README_CINEMATICO.md)**
- Stack tecnológico
- Estructura del proyecto
- Hooks personalizados
- Cómo editar componentes

### **4. Verificar Código**
💻 **Archivos a revisar:**
- `app/page.tsx` — Estructura de los 7 capítulos
- `lib/design-tokens.ts` — Todos los colores y motion tokens
- `components/FormularioContactoV2.tsx` — Formulario con validación

---

## 🎬 Ver el Sitio en Acción

```bash
cd "C:\Users\polch\Desktop\PROYECTOS\SCA San Juan Bautista Peñolite\web-cinematic"

# Desarrollo (hot reload)
npm run dev

# Abre http://localhost:3000
```

**Lo que verás sin imágenes:**
- Estructura completa de 7 secciones
- Animaciones GSAP funcionando
- Formulario validando
- Transiciones cinematográficas
- Scroll smooth con Lenis

---

## 🎯 Próximos 3 Pasos Urgentes

### **PASO 1: Generar Imágenes (1-2 horas)**
1. Lee [ASSETS_GUIDE.md](./ASSETS_GUIDE.md)
2. Copia los 10 prompts
3. Usa Recraft V4.1 o tu herramienta favorita
4. Guarda en `/public/images/` (estructura definida)

### **PASO 2: Conectar Imágenes (30 min)**
Reemplaza los placeholders en:
- `components/HeroV2.tsx` (línea ~50)
- `components/TerroirV2.tsx` (línea ~70)
- `components/CatalogV2.tsx` (línea ~150)
- Etc. (buscar `TODO: ADD IMAGE`)

### **PASO 3: Backend Formulario (1 hora)**
Elige una opción en `components/FormularioContactoV2.tsx`:
- **Opción A:** Vercel Serverless Functions (recomendado)
- **Opción B:** Mailgun / SendGrid API
- **Opción C:** Supabase

---

## 🗂️ Estructura de Carpetas

```
web-cinematic/
├── 📄 COMIENZA_AQUI.md           ← TÚ ESTÁS AQUÍ
├── 📄 PROYECTO_RESUMEN.md        ← Resumen ejecutivo
├── 📄 ASSETS_GUIDE.md            ← Cómo generar imágenes
├── 📄 README_CINEMATICO.md       ← Docs técnicas
│
├── app/
│   ├── page.tsx                  ← Estructura 7 capítulos
│   ├── layout.tsx                ← Root + meta
│   └── globals.css               ← Estilos globales
│
├── components/
│   ├── HeroV2.tsx                ← Cap 1: La Raíz
│   ├── TerroirV2.tsx             ← Cap 2: La Tierra
│   ├── ProcesoV2.tsx             ← Cap 3: Las Manos
│   ├── ProductoV2.tsx            ← Cap 4: La Esencia
│   ├── CatalogV2.tsx             ← Cap 5: La Elección
│   ├── FormularioContactoV2.tsx  ← Cap 6: El Contacto
│   └── CierreV2.tsx              ← Cap 7: La Invitación
│
├── hooks/
│   └── useScrollTrigger.ts       ← Hook GSAP personalizado
│
├── lib/
│   └── design-tokens.ts          ← Tokens: colores, motion, spacing
│
└── public/
    └── images/                    ← Aquí van las 10 imágenes
```

---

## 🎨 Colores a Recordar

```
#060D03  ← Negro (fondo)
#2D4A2B  ← Verde Oliva (dominante)
#C8961E  ← Dorado (acentos + CTA)
#F5F1E8  ← Crema (texto claro)
```

---

## 📱 Testing Rápido

**Desktop:**
```bash
npm run dev
# http://localhost:3000
```

**Mobile:**
```bash
# En DevTools: F12 → Device Toggle (Ctrl+Shift+M)
# O en https://localhost:3000 en tu teléfono (misma red Wi-Fi)
```

---

## ❓ Dudas Frecuentes

**P: ¿Dónde cambio el logo?**  
R: `components/Nav.tsx` (línea ~30, en `nav-logo-name`)

**P: ¿Cómo edito los precios?**  
R: `components/CatalogV2.tsx` (línea ~20, `products` array)

**P: ¿Cómo hago que el formulario envíe emails?**  
R: [README_CINEMATICO.md](./README_CINEMATICO.md) sección "Backend"

**P: ¿Puedo cambiar los colores?**  
R: `lib/design-tokens.ts` (edita el objeto `colors`)

**P: ¿Cómo hago el sitio bilingüe (ES/CA/EN)?**  
R: Usa `next-intl` package. Roadmap futuro.

---

## 📞 Contacto Peñolite

Si necesitas hablar con la cooperativa:
- Email: sanjuanbautista.sca@gmail.com
- Teléfono: +34 953 435 316

---

## ✅ Checklist Visual

**Hoy (ahora):**
- [ ] Lees este archivo
- [ ] Ejecutas `npm run dev`
- [ ] Ves el sitio en acción
- [ ] Abres ASSETS_GUIDE.md

**Mañana (próximas horas):**
- [ ] Generas las 10 imágenes
- [ ] Las copias en `/public/images/`
- [ ] Conectas las rutas
- [ ] Verificas que aparezcan

**Esta semana:**
- [ ] Backend formulario
- [ ] Logo final
- [ ] Vídeos opcionales
- [ ] Deploy en Vercel

---

## 🎬 Visión Final

**"Una web cinematográfica que cuenta la historia de 68 años de tradición, desde los olivares de montaña hasta la gota perfecta en la mesa del cliente."**

El código está listo. Las imágenes son el último paso.

---

**¿Listo?** Abre `ASSETS_GUIDE.md` y empieza a generar imágenes. 🚀

