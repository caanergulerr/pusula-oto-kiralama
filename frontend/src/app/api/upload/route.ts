import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'Dosya seçilmedi' }, { status: 400 })
        }

        if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return NextResponse.json({ error: 'Sadece resim dosyaları kabul edilir' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const randomName = randomBytes(16).toString('hex')
        const ext = extname(file.name)
        const filename = `${randomName}${ext}`

        // process.cwd() = /var/www/pusula-oto/frontend — her zaman doğru
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadDir, { recursive: true })
        await writeFile(join(uploadDir, filename), buffer)

        console.log('[NEXT UPLOAD] Kaydedildi:', join(uploadDir, filename))

        return NextResponse.json({
            filename,
            path: `/uploads/${filename}`
        })
    } catch (error: any) {
        console.error('[NEXT UPLOAD ERROR]', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
