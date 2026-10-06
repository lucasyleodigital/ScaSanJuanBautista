// Cloudflare Turnstile (captcha). La clave del sitio es PÚBLICA: va en el navegador.
// La clave secreta NUNCA va aquí: vive solo como secreto de la Edge Function
// "crear-pedido" en Supabase.
//
// Mientras esté vacía, el formulario funciona como antes (guarda el pedido
// directamente) y no se muestra el captcha. Al rellenarla, el pedido pasa a
// crearse a través de la función, que comprueba el captcha en el servidor.
export const TURNSTILE_SITE_KEY = "";
