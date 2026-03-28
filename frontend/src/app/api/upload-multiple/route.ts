import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const files = formData.getAll('files') as File[]

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'Dosya seçilmedi' }, { status: 400 })
        }

        const uploadDir = join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadDir, { recursive: true })

        const results = await Promise.all(files.map(async (file) => {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const randomName = randomBytes(16).toString('hex')
            const ext = extname(file.name)
            const filename = `${randomName}${ext}`
            await writeFile(join(uploadDir, filename), buffer)
            console.log('[NEXT UPLOAD-MULTIPLE] Kaydedildi:', filename)
            return { filename, path: `/uploads/${filename}` }
        }))

        return NextResponse.json(results)
    } catch (error: any) {
        console.error('[NEXT UPLOAD-MULTIPLE ERROR]', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
