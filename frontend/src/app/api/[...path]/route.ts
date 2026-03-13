import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    return handleProxy(request, params.path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
    return handleProxy(request, params.path);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
    return handleProxy(request, params.path);
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
    return handleProxy(request, params.path);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
    return handleProxy(request, params.path);
}

async function handleProxy(request: NextRequest, pathArray: string[]) {
    const isProduction = process.env.NODE_ENV === 'production';
    const backendBaseUrl = isProduction
        ? 'https://pusula-oto-kiralama-production.up.railway.app'
        : 'http://localhost:3000';

    const pathStr = Array.isArray(pathArray) ? pathArray.join('/') : '';

    // send-email rotası bu proxy'den geçmemeli - doğrudan Vercel'in kendi handler'ına gider
    // Eğer bu yolu proxy yakalasaydı, Railway -> Vercel -> Railway döngüsüne girerdi
    if (pathStr === 'send-email') {
        return NextResponse.json({ message: 'Bu rota proxy\'den geçemez.' }, { status: 404 });
    }
    const query = request.nextUrl.search; // Includes '?'

    const targetUrl = `${backendBaseUrl}/${pathStr}${query}`;

    try {
        const headers = new Headers();
        request.headers.forEach((value, key) => {
            // Exclude host and connection headers
            if (!['host', 'connection', 'accept-encoding'].includes(key.toLowerCase())) {
                headers.set(key, value);
            }
        });

        const body = request.method !== 'GET' && request.method !== 'HEAD'
            ? await request.arrayBuffer()
            : undefined;

        const res = await fetch(targetUrl, {
            method: request.method,
            headers,
            body,
            redirect: 'manual'
        });

        // Handle response headers
        const responseHeaders = new Headers();
        res.headers.forEach((value, key) => {
            responseHeaders.set(key, value);
        });

        return new NextResponse(res.body, {
            status: res.status,
            statusText: res.statusText,
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ message: 'Internal Server Proxy Error', error: error.message }, { status: 500 });
    }
}
