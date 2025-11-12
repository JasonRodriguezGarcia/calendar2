export function configureTrustProxy(app) {
    let rawValue = process.env.TRUST_PROXY
    let trustProxyValue

    if (rawValue === undefined) {
        console.warn("⚠️señal  Variable TRUST_PROXY no definida. Usando 'false' por defecto (sin confiar en proxies).")
        trustProxyValue = false
    } else if (rawValue === 'true') {
        trustProxyValue = true
    } else if (rawValue === 'false') {
        trustProxyValue = false
    } else {
        // trustProxyValue = parseInt(rawValue, 10)
        trustProxyValue = Number(rawValue)
        if (isNaN(trustProxyValue)) {
            console.warn(`⚠️  Valor inválido para TRUST_PROXY (${rawValue}). Usando 'false' por defecto.`)
            trustProxyValue = false
        }
    }

    app.set('trust proxy', trustProxyValue)
    console.log(`🔧 Trust proxy configurado en: ${trustProxyValue}`)

  // Middleware para analizar X-Forwarded-For, SOLO FUNCIONA en modo producción porque es cuando hay X-Forwarded-For
  // porque nuestras peticiones fetch en frontend van directamente a express y no hay proxie en medio
    app.use((req, res, next) => {
        const forwardedFor = req.headers['x-forwarded-for']
        if (forwardedFor) {
            const chain = forwardedFor.split(',').map(ip => ip.trim())
            const clientIP = chain[0]; // IP original del cliente
            const numProxies = chain.length - 1 // cliente real + proxies
            
            // Calcula la IP que Express considera
            const expressIP = req.ip;
            const expressIPs = req.ips; // array de IPs según trust proxy

            console.log(`🧩 Cadena de proxies detectada (${chain.length}):`, chain);
            console.log(`➡️ IP original del cliente: ${clientIP}`);
            console.log(`➡️ IP considerada por Express (req.ip): ${expressIP}`);
            console.log(`➡️ IPs confiables según trust proxy (req.ips):`, expressIPs);

            // Detecta posible desajuste
            if (typeof trustProxyValue === 'number' && numProxies > trustProxyValue) {
                // Muestra información de diagnóstico
                console.warn(`⚠️  Parece haber ${numProxies} proxies delante, pero 'trust proxy' está en ${trustProxyValue}.`)
                console.warn("👉  Considera aumentar TRUST_PROXY en tu .env para reflejar la cadena real.")
            }
        }
        next()
    })
}