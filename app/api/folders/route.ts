import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// 사용자의 모든 폴더 조회
export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);

    if (!payload) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const folders = await prisma.folder.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ folders });
  } catch (error) {
    console.error('폴더 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 폴더 생성
export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);

    if (!payload) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, parentId } = body;

    if (!name) {
      return NextResponse.json(
        { error: '폴더 이름이 필요합니다' },
        { status: 400 }
      );
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        parentId: parentId || null,
        userId: payload.userId,
      },
    });

    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    console.error('폴더 생성 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

