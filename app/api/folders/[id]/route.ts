import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// 폴더 수정
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
    const { name } = body;

    const existingFolder = await prisma.folder.findFirst({
      where: { id, userId: payload.userId },
    });

    if (!existingFolder) {
      return NextResponse.json(
        { error: '폴더를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    if (existingFolder.isSpecial) {
      return NextResponse.json(
        { error: '특수 폴더는 수정할 수 없습니다' },
        { status: 400 }
      );
    }

    const folder = await prisma.folder.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ folder });
  } catch (error) {
    console.error('폴더 수정 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 폴더 삭제
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

    const existingFolder = await prisma.folder.findFirst({
      where: { id, userId: payload.userId },
    });

    if (!existingFolder) {
      return NextResponse.json(
        { error: '폴더를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    if (existingFolder.isSpecial) {
      return NextResponse.json(
        { error: '특수 폴더는 삭제할 수 없습니다' },
        { status: 400 }
      );
    }

    // 휴지통 폴더 찾기
    const recentlyDeletedFolder = await prisma.folder.findFirst({
      where: {
        userId: payload.userId,
        name: '최근 삭제된 항목',
      },
    });

    if (recentlyDeletedFolder) {
      // 폴더 내 메모를 휴지통으로 이동
      await prisma.note.updateMany({
        where: { folderId: id },
        data: { folderId: recentlyDeletedFolder.id },
      });
    }

    // 폴더 삭제
    await prisma.folder.delete({ where: { id } });

    return NextResponse.json({ message: '폴더가 삭제되었습니다' });
  } catch (error) {
    console.error('폴더 삭제 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

