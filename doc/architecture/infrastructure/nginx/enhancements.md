[← Back to Nginx Configuration](./nginx.md) | [Back to Overview](../../overview.md)

# Nginx Enhancement Suggestions

Based on the analysis of the current `default.conf`, the following enhancements are recommended to improve security, performance, and maintainability.

## 1. Security Improvements

### Enable HSTS (HTTP Strict Transport Security)
Force browsers to always use HTTPS.
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### Add Security Headers
Protect against clickjacking, MIME sniffing, and XSS.
```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### Hide Nginx Version
Prevent exposing the version number to attackers.
```nginx
server_tokens off;
```

## 2. Performance Optimizations

### Enable Gzip Compression
Compress text-based assets (JSON, CSS, JS) to reduce bandwidth and load times.
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_proxied any;
gzip_min_length 1000;
```

### Browser Caching for Static Assets
Explicitly set long expiry times for static files to leverage client-side caching.
```nginx
location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, no-transform";
}
```

### Rate Limiting
Protect API endpoints from abuse/DDoS.
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    proxy_pass http://gateway_backend/;
    # ...
}
```

## 3. Maintainability

### Split Configuration
The `default.conf` file is currently very large (~600 lines). Split it into smaller files:
- `conf.d/upstreams.conf`: All `upstream` blocks.
- `conf.d/amcollar.com.conf`: Main server block.
- `conf.d/app.amcollar.com.conf`: App subdomain block.

### Structured Logging
Use JSON format for logs to make them easier to parse with tools like Logstash or Splunk.
```nginx
log_format json_combined escape=json
  '{'
    '"time_local":"$time_local",'
    '"remote_addr":"$remote_addr",'
    '"request":"$request",'
    '"status": "$status",'
    '"body_bytes_sent":"$body_bytes_sent",'
    '"http_referer":"$http_referer",'
    '"http_user_agent":"$http_user_agent"'
  '}';
access_log /var/log/nginx/access.log json_combined;
```
