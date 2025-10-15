export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing ?url=' });
  }

  try {
    const options = {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined, // remove host header
      },
    };

    // Se for POST, repassa o corpo da requisição
    if (req.method === 'POST') {
      options.body = JSON.stringify(req.body);
      options.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(targetUrl, options);

    // Copia os cabeçalhos originais da resposta
    const headers = {};
    response.headers.forEach((value, key) => (headers[key] = value));

    // Libera CORS
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Headers'] = '*';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';

    const data = await response.arrayBuffer();
    res.writeHead(response.status, headers);
    res.end(Buffer.from(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}