import fs from 'fs'
import path from 'path'

import process from 'process'
import { z, ZodType } from 'zod'

export const manifest = <ManifestSchema extends ZodType>(
    schema: ManifestSchema,
    manifestFileName: string = 'manifest.json'
): (() => z.infer<ManifestSchema>) => {
    const packagePath = path.join(process.cwd(), 'package.json')
    const manifestPath = path.join(process.cwd(), manifestFileName)

    const packageContent = fs.readFileSync(packagePath, { encoding: 'utf8' })
    const manifestContent = fs.readFileSync(manifestPath, { encoding: 'utf8' })
    let manifest: z.infer<ManifestSchema> | undefined = undefined

    return () => manifest ?? (manifest = schema.parse({ ...JSON.parse(manifestContent), package: JSON.parse(packageContent) }))
}

export * from './schema'
