# Use the official Golang image
FROM golang:1.25-alpine3.23 AS builder

# Set working directory
WORKDIR /build

# 1. Install dependencies first (better caching)
COPY go.mod go.sum ./
RUN go mod download

# 2. Copy the rest of the source code
COPY . .

# 3. Build the binary 
# Removed hardcoded GOARCH to let it adapt to your system
RUN CGO_ENABLED=0 go build -o /app .

# Final stage
FROM alpine:3.23 AS final

# Add security: run as non-root user
RUN adduser -D appuser
USER appuser

COPY --from=builder /app /bin/app

EXPOSE 8000

CMD ["/bin/app"]