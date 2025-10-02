export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Leer el body manualmente si req.body está vacío
  let body = req.body;
  if (!body || typeof body !== 'object') {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      body = JSON.parse(Buffer.concat(buffers).toString());
    } catch (err) {
      console.error('❌ Error al leer el body:', err);
      return res.status(400).json({ error: 'Body inválido' });
    }
  }

  try {
    const response = await fetch('https://xfzt4cg93k.execute-api.us-east-2.amazonaws.com/dev/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Solo reenviar cabeceras necesarias
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: 'Error al conectar con el backend' });
  }
}