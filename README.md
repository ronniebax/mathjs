# Math.js API Server

An internal implementation of the math.js API that is compatible with `api.mathjs.org`. This server was developed to eliminate risky external dependencies by running a local version of the math.js webservice.

## Features

- **Fully compatible** with the original mathjs.org API
- **GET and POST endpoints** supported
- **Precision parameter** for significant digits
- **Docker support** for easy deployment
- **Health check endpoint** for monitoring
- **CORS enabled** for cross-origin requests
- **Error handling** with clear error messages

## API Endpoints

### GET /v4/

Evaluate a mathematical expression via query parameters.

**Parameters:**
- `expr` (required): The mathematical expression (URL encoded)
- `precision` (optional): Number of significant digits

**Example:**
```bash
curl "http://localhost:3031/v4/?expr=2*(7-3)"
# Response: 8

curl "http://localhost:3031/v4/?expr=15.4/12.8&precision=2"
# Response: 1.2
```

### POST /v4/

Evaluate a mathematical expression via JSON body.

**Request Body:**
```json
{
  "expr": "mathematical expression",
  "precision": 2
}
```

**Response:**
```json
{
  "result": "8",
  "error": null
}
```

**Examples:**

```bash
# Basic calculation
curl -X POST http://localhost:3031/v4/ \
  -H "Content-Type: application/json" \
  -d '{"expr": "5*4", "precision": 1}'
# Response: {"result": "20", "error": null}

# With precision
curl -X POST http://localhost:3031/v4/ \
  -H "Content-Type: application/json" \
  -d '{"expr": "15.4/12.8", "precision": 2}'
# Response: {"result": "1.2", "error": null}
```

### GET /health

Health check endpoint voor monitoring.

```bash
curl http://localhost:3031/health
# Response: {"status": "OK", "timestamp": "2024-01-15T10:30:00.000Z"}
```

## Installation & Usage

### Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start server:**
   ```bash
   npm start
   ```

3. **Development mode (with auto-reload):**
   ```bash
   npm run dev
   ```

The server runs on port 3031 by default.

### Docker

#### With Docker Compose (recommended)

1. **Start server:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop server:**
   ```bash
   docker-compose down
   ```

#### With Docker only

1. **Build image:**
   ```bash
   docker build -t mathjs-api .
   ```

2. **Start container:**
   ```bash
   docker run -d -p 3031:3031 --name mathjs-api-server mathjs-api
   ```

## Configuration

### Environment Variables

- `PORT`: Port on which the server runs (default: 3031)
- `NODE_ENV`: Environment (development/production)

### Docker Compose customizations

In `docker-compose.yml` you can modify:
- **Port mapping**: Change `"3031:3031"` to desired external port
- **Traefik labels**: For reverse proxy setup
- **Network configuration**: For integration with existing networks

## Precision Parameter

The `precision` parameter determines the number of significant digits in the result:

- `precision: 1` → `15.4/12.8` = `"1"`
- `precision: 2` → `15.4/12.8` = `"1.2"`
- `precision: 3` → `15.4/12.664` = `"1.22"`

Without precision parameter, the full result is returned.

## Supported Expressions

The server supports all math.js expressions, including:

- **Basic operations**: `+`, `-`, `*`, `/`, `^`
- **Functions**: `sin()`, `cos()`, `sqrt()`, `log()`, etc.
- **Constants**: `pi`, `e`
- **Complex expressions**: `(2+3i) * (4-5i)`
- **Matrices**: `[[1,2],[3,4]] * [[5,6],[7,8]]`
- **Units**: `5 cm + 2 inch`

## Monitoring & Health Checks

### Health Check

The server includes a built-in health check at `/health` that:
- Checks server status
- Shows timestamp of last check
- Used by Docker health checks

### Docker Health Check

Docker automatically performs health checks:
- **Interval**: Every 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3 attempts
- **Start period**: 40 seconds

## Security

- **Non-root user**: Container runs as `mathjs` user (not root)
- **CORS enabled**: Configurable for different origins
- **Input validation**: Expressions are validated by math.js
- **Error handling**: No stack traces in production

## Troubleshooting

### Common issues

1. **Container won't start:**
   ```bash
   docker-compose logs mathjs-api
   ```

2. **Port already in use:**
   Change the external port in `docker-compose.yml`:
   ```yaml
   ports:
     - "3031:3031"  # Use port 3031 instead of 3031
   ```

3. **Expression errors:**
   Check if the expression is valid:
   ```bash
   curl -X POST http://localhost:3031/v4/ \
     -H "Content-Type: application/json" \
     -d '{"expr": "invalid expression"}'
   ```

### Logs

```bash
# Docker Compose logs
docker-compose logs -f mathjs-api

# Docker logs
docker logs mathjs-api-server -f
```

## Development

### Project structure

```
.
├── server.js           # Main server file
├── package.json        # NPM dependencies
├── Dockerfile         # Docker image configuration
├── docker-compose.yml # Docker Compose setup
└── README.md         # This documentation
```

### Adding new features

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Create Pull Request

## License

MIT License - see file for details.

## Support

For questions or issues, create an issue in the repository or contact the development team.