import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const apiKey = request.headers.get('x-sgdb-key')
    if (!apiKey)
        return Response.json({ error: 'Missing API key' }, { status: 401 })

    const { path } = await params
    const search = request.nextUrl.search

    const url = `https://www.steamgriddb.com/api/v2/${path.join('/')}${search}`
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (!res.ok) {
        return Response.json(
            { error: `SGDB error: ${res.status} ${res.statusText}`, url },
            { status: res.status },
        )
    }

    return NextResponse.json(await res.json())
}
