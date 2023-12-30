// pages/api/resolve.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'
import fetch from 'node-fetch';

const resolveHandler = async (url: string | null) => {
  if (typeof url !== 'string') {
    return {
        data: [],
        errmsg: '没有发现重定向',
        status: 403
      }
  }

  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'manual' });
    if (response.headers.has('location')) {
      const location = response.headers.get('location');
      return {
        data: location,
        errmsg: 'success',
        status: 200
      };
    }
  } catch (error) {
    return {
      data: [],
      errmsg: '没有发现重定向',
      status: 403
    };
  }
};

export async function GET(req: NextRequest, res: NextApiResponse) {
    const body = await req.nextUrl.searchParams.get('url');
    let rlt = await resolveHandler(body)
    return NextResponse.json(rlt)
}
