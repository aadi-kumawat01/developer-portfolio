# Backend operational note

## Health checks and cold starts

`GET /api/health` is a lightweight public health endpoint. If a hosting provider may sleep inactive services, an external uptime or cron provider can request `https://YOUR-BACKEND/api/health` at an interval permitted by that provider's terms and plan.

The backend never self-pings. To test an external scheduler locally or in a scheduler job, set `BACKEND_HEALTH_URL` and run `npm run ping:health`.
