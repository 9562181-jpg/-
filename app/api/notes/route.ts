import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// 사용자의 모든 메모 조회
export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);

    if (!payload) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const notes = await prisma.note.findMany({
      where: { userId: payload.userId },
      orderBy: { modifiedAt: 'desc' },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('메모 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 메모 생성
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
    const { folderId, content } = body;

    if (!folderId) {
      return NextResponse.json(
        { error: '폴더 ID가 필요합니다' },
        { status: 400 }
      );
    }

    const folder = await prisma.folder.findFirst({
      where: { id: folderId, userId: payload.userId },
    });

    if (!folder) {
      return NextResponse.json(
        { error: '폴더를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const note = await prisma.note.create({
      data: {
        content: content || '',
        folderId,
        userId: payload.userId,
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error('메모 생성 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

