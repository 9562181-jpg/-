import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, displayName } = body;

    console.log('📝 회원가입 요청:', { email, displayName });

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      console.log('❌ 이메일 중복:', email);
      return NextResponse.json(
        { error: '이미 존재하는 이메일입니다' },
        { status: 400 }
      );
    }

    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        displayName,
      },
    });

    console.log('✅ 사용자 생성 완료:', user.id);

    // 기본 폴더 생성
    await prisma.folder.createMany({
      data: [
        {
          id: `all-notes-${user.id}`,
          name: '모든 메모',
          isSpecial: true,
          userId: user.id,
        },
        {
          id: `recently-deleted-${user.id}`,
          name: '최근 삭제된 항목',
          isSpecial: true,
          userId: user.id,
        },
      ],
    });

    console.log('✅ 기본 폴더 생성 완료');

    // JWT 토큰 생성
    const token = generateToken({ userId: user.id, email: user.email });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ 회원가입 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

