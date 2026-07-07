# Plan de Despliegue: Publicación de la Web

Para que todo el mundo pueda usar tu web, necesitamos publicarla en un servidor de internet. La plataforma más recomendada, rápida y **gratuita** para proyectos de Next.js es **Vercel**.

## ⚠️ Problema con el almacenamiento actual
Actualmente estamos guardando los mensajes y el temporizador en un archivo local llamado `data.json`.
Plataformas gratuitas como Vercel son "Serverless" (sin servidor fijo), lo que significa que apagan y encienden la máquina según el tráfico, **borrando cualquier archivo local que se haya creado**. Si lo subimos tal cual, la cuenta regresiva de 24 horas y los mensajes se borrarían solos cada pocas horas.

## 🛠️ Solución Propuesta (Paso a Paso)

Para solucionar esto y tener un despliegue profesional y gratuito:

1. **Migrar a una Base de Datos en la Nube (Gratis):** 
   - Cambiaremos nuestro archivo `data.json` por una base de datos gratuita en la nube como **Firebase** o **Vercel KV (Redis)**. Esto mantendrá los mensajes y el temporizador intactos 24/7.
2. **Subir el código a GitHub:**
   - Crearemos un repositorio en tu cuenta de GitHub con todo este código.
3. **Desplegar en Vercel:**
   - Conectaremos Vercel a tu GitHub. Vercel publicará la página web automáticamente y te dará un enlace público (ej. `tu-pagina.vercel.app`).

## ❓ Preguntas para ti (Acciones Requeridas)
Para poder hacer esto, necesito que tomes un par de decisiones/acciones:

1. **Base de datos:** ¿Tienes alguna preferencia entre usar **Firebase** o **Vercel KV**? (Ambas son gratis, Vercel KV suele ser más directo si ya vas a usar Vercel para publicar).
2. **Cuentas necesarias:** Necesitarás crearte una cuenta gratuita en [Vercel](https://vercel.com) y en [GitHub](https://github.com) (si no las tienes ya). ¿Me avisas cuando las tengas listas para empezar con la migración?
