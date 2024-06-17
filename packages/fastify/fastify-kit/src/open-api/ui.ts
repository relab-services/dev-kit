import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

import type { ReferenceConfiguration } from '@scalar/api-reference'
import { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import http from 'http'

import { area } from './area'
import { OpenApiPluginOptions } from './plugin-options'

const getJavascriptLib = async (): Promise<string | undefined> => {
    const javascriptFilePath = path.resolve(__dirname, 'api-reference.js')
    if (existsSync(javascriptFilePath)) {
        return await fs.readFile(javascriptFilePath, { encoding: 'utf-8' })
    }
}

const appendResources = (description: string | undefined, links: string[]) => {
    const linksContent = links.length > 0 ? `## Resources\n${links.map(link => `- [${link}](${link})`).join('\n')}` : undefined
    return `${description}${description && linksContent ? '\n' : undefined}${linksContent}`
}

export const generateHtml = async (options: { configuration: ReferenceConfiguration }) => {
    const configuration = JSON.stringify(options.configuration ?? {})
        .split('"')
        .join('&quot;')

    const schemaRef = options.configuration?.spec?.content
    const schema = schemaRef ? JSON.stringify(typeof schemaRef === 'function' ? schemaRef() : schemaRef) : ''

    const javascript = await getJavascriptLib()

    return javascript
        ? `<!DOCTYPE html>
<html lang="en">
    <head>
        <title>${
            options.configuration?.metaData?.title || 'API Documentation' // eslint-disable-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
        }</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
        <script id="api-reference" type="application/json" data-configuration="${configuration}">${schema}</script>
        <script type="application/javascript">${javascript}</script>
    </body>
</html>`
        : undefined
}

export const registerUi = <Server extends http.Server>(
    fastify: FastifyInstance<http.Server, RawRequestDefaultExpression<Server>, RawReplyDefaultExpression<Server>, FastifyBaseLogger, ZodTypeProvider>,
    options: OpenApiPluginOptions
) => {
    if (!options.ui) return

    const schemaFilePath = options.jsonSchemaPath ? path.join('/', options.ui.subPath ?? '', '/', options.jsonSchemaPath) : options.jsonSchemaPath

    fastify.log.debug({ area, schema: schemaFilePath }, 'Setting up OpenAPI UI endpoint %s', options.ui.path)

    fastify.get(options.ui.path, async (request, response) => {
        const schemaContent = fastify.swagger()
        const configuration: ReferenceConfiguration = {
            metaData: {
                title: options.info?.title,
                description: options.info?.description,
            },
            layout: 'classic',

            ...options.ui?.configuration,

            spec: {
                content: JSON.stringify({
                    ...schemaContent,
                    info: {
                        ...schemaContent.info,
                        description: appendResources(schemaContent.info.description, schemaFilePath ? [schemaFilePath] : []),
                    },
                }),
            },
        }
        const content = await generateHtml({ configuration })

        if (content) await response.header('Content-Type', 'text/html').send(content)
        else {
            fastify.log.warn({ area }, 'Unable to generate OpenAPI UI (seems something wrong with fastify-kit package)')
            await response.code(404).send()
        }
    })
}
