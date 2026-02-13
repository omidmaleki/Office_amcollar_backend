# ----------------------------
# Stage 1: Dependencies
# ----------------------------
    FROM node:20-alpine AS deps

    # Compatibility package
    RUN apk add --no-cache libc6-compat
    
    WORKDIR /app
    
    # Copy package files
    COPY package.json package-lock.json* ./
    
    # Use npm mirror to avoid network issues
    RUN npm config set registry https://registry.npmmirror.com
    
    # Install dependencies
    RUN npm ci --cache /tmp/npm-cache
    
    # ----------------------------
    # Stage 2: Build
    # ----------------------------
    FROM node:20-alpine AS builder
    
    WORKDIR /app
    
    # Copy node_modules from deps
    COPY --from=deps /app/node_modules ./node_modules
    
    # Copy all source code
    COPY . .
    
    # Disable Next.js telemetry
    ENV NEXT_TELEMETRY_DISABLED=1
    
    # Build the Next.js app
    RUN npm run build
    
    # ----------------------------
    # Stage 3: Production runtime
    # ----------------------------
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    # Set production environment
    ENV NODE_ENV=production
    ENV NEXT_TELEMETRY_DISABLED=1
    ENV PORT=3000
    ENV HOSTNAME=0.0.0.0
    
    # Create non-root user
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs
    
    # Copy public folder
    COPY --from=builder /app/public ./public
    
    # Copy standalone output - preserve structure
    # The standalone folder contains server.js and minimal node_modules
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
    
    # Copy messages folder for i18n (must be at root for relative imports)
    COPY --from=builder --chown=nextjs:nodejs /app/messages ./messages
    
    # Switch to non-root user
    USER nextjs
    
    # Expose port
    EXPOSE 3000
    
    # Single healthcheck using Node.js (no curl needed)
    HEALTHCHECK --interval=30s --timeout=10s --start-period=40s \
      CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
    
    # Start app - server.js is in the standalone output
    CMD ["node", "server.js"]