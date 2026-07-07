# Esta Página Se Autodestruirá 💣

Un clon del concepto "This page will self destruct", creado con Next.js y React.

Cualquier persona puede entrar y dejar un mensaje. Si la página pasa 24 horas sin que nadie escriba un mensaje nuevo, el temporizador llegará a cero y todos los mensajes se borrarán automáticamente (la página se "autodestruirá").

## Características

- ⏳ **Temporizador de 24 horas:** Se reinicia a 24:00:00 cada vez que alguien publica un mensaje.
- 💬 **Mensajes anónimos:** Muestra los últimos 9 mensajes enviados por los visitantes.
- ☁️ **Almacenamiento en la Nube (Serverless-ready):** Usa `kvdb.io` por defecto como almacenamiento Key-Value gratuito, para que pueda ser desplegado en Vercel u otras plataformas serverless sin perder datos cuando los contenedores se reinician.

## Despliegue en Vercel

Esta aplicación está lista para ser publicada en [Vercel](https://vercel.com) de forma gratuita:

1. Importa este repositorio en Vercel.
2. En la configuración del proyecto (Environment Variables), añade:
   - `KV_REST_API_URL` = `Tu URL de kvdb.io` (Por ejemplo: `https://kvdb.io/TuBucketID`)
3. ¡Despliega y listo!

## Desarrollo Local

Para correr el proyecto en tu máquina:

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

*(Nota: Asegúrate de crear un archivo `.env.local` con tu propia variable `KV_REST_API_URL` si vas a probarlo en local, o de lo contrario no se guardarán los mensajes)*.
