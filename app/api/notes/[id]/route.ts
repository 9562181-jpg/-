import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// 메모 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getUserFromRequest(request);

    if (!payload) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    const existingNote = await prisma.note.findFirst({
      where: { id, userId: payload.userId },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: '메모를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const note = await prisma.note.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error('메모 수정 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 메모 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getUserFromRequest(request);

    if (!payload) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingNote = await prisma.note.findFirst({
      where: { id, userId: payload.userId },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: '메모를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    await prisma.note.delete({ where: { id } });

    return NextResponse.json({ message: '메모가 삭제되었습니다' });
  } catch (error) {
    console.error('메모 삭제 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 메모 이동
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getUserFromRequest(request);

    if (!payload) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { folderId } = body;

    const existingNote = await prisma.note.findFirst({
      where: { id, userId: payload.userId },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: '메모를 찾을 수 없습니다' },
        { status: 404 }
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

    const note = await prisma.note.update({
      where: { id },
      data: { folderId },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error('메모 이동 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

