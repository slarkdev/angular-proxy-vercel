export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  let body = req.body;

  if (!body || typeof body !== 'object') {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      body = JSON.parse(Buffer.concat(buffers).toString());
    } catch {
      return res.status(400).json({ error: 'Body inválido' });
    }
  }

  try {
    const response = await fetch('https://xfzt4cg93k.execute-api.us-east-2.amazonaws.com/dev/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con el backend' });
  }
}