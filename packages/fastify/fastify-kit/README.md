# @relab/fastify-kit

Development kit to setup Fastify server with the following features:
- Fastify REST API
- Typed routes (Typescript & Zod)
- Typed error outputs
- Swagger (including schema for request/response as well as error outputs)
- Health check endpoints
- Secure with API Key
- Graceful shutdown

⚠️ _It is for internal usage only. Use it on your own risk._

## Requirements

- Node 18+
- Fastify 4+
- Zod 3+

## Installation

### NPM

```
npm install --save @relab/fastify-kit
```

### PNPM

```
npm add @relab/fastify-kit
```

## Usage

```index.ts```

```typescript
import { CorrelationId } from '@relab/fastify-correlation-id'
import { HealthChecks } from '@relab/fastify-health-check'
import { ApiKey, createFastifyApp, ErrorsHandling, HealthStatus, OpenApi, SecurityGuards } from '@relab/fastify-kit'
import { handleShutdown, onShutdown } from '@relab/graceful-shutdown'
import { logger } from '@relab/pino-logger'

const app = createFastifyApp(FastifyOptions)
    .register(CorrelationId)
    .register(ErrorsHandling, ErrorsHandlingOptions)
    .register(HealthStatus, HealthStatusOptions)
    .register(HealthChecks, HealthCheckOptions)
    .register(ApiKey(securitySchemes), ApiKeyOptions)
    .register(SecurityGuards)
    .register(OpenApi, OpenApiOptions)
    .registerRoutes(Object.values(Routes))

```

```routes.ts```

```typescript
import { Route } from '@relab/fastify-kit'
import { z } from 'zod'

import { MessageActionSchema } from '../dto/message/action'
import { MessageRecipientSchema } from '../dto/message/recipient'
import { MessageSubject } from '../dto/message/subject'
import { authorize } from '../security'

const SendGenericMessageRequestSchema = z
    .object({
        to: z.array(MessageRecipientSchema).min(1).describe('Recipient list'),
        subject: MessageSubject,
        content: z
            .object({
                preview: z.string().optional().describe('Text that displayed in preview section for the message'),
                header: z.string().describe('Header text in message body'),
                text: z.string().describe('Message content'),
                actions: z.array(MessageActionSchema).optional().describe('Actions'),
            })
            .describe('Message content'),
    })
    .describe('Send generic message request')
    .ref('SendGenericMessageRequest')

const SendGenericMessageResponseSchema = z
    .object({
        sent: z.array(z.string()).describe('The list of recipients to whom the message was sent'),
    })
    .ref('SendGenericMessageResponse')

export const SendGenericMessageRoute: Route = async app => {
    app.route({
        method: 'POST',
        url: '/send/generic/:id',
        schema: {
            operationId: 'MyApp.Email.SendGeneric',

            summary: 'Send generic email message to the recipients',
            description: 'Send generic email message to the recipients',

            tags: ['email'],

            body: SendGenericMessageRequestSchema,
            response: {
                200: SendGenericMessageResponseSchema,
            },

            security: authorize('api-key'),
        },
        handler: (req, reply) => {
            for (const recipient of req.body.to) {
                req.log.info(
                    {
                        subject: req.body.subject,
                    },
                    'Sending message to %s (%s)',
                    recipient.name ?? 'n/a',
                    recipient.email
                )
            }

            return {
                sent: req.body.to.map(x => x.email),
            }
        },
    })
}

```

## License

Released under [MIT](/LICENSE) by [Sergey Zwezdin](https://github.com/sergeyzwezdin).
