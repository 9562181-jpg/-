const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 사용자의 모든 메모 조회
router.get('/', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: req.user.userId
      },
      orderBy: {
        modifiedAt: 'desc'
      }
    });

    res.json({ notes });
  } catch (error) {
    console.error('메모 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 메모 생성
router.post('/', async (req, res) => {
  try {
    const { folderId, content } = req.body;

    if (!folderId) {
      return res.status(400).json({ error: '폴더 ID가 필요합니다' });
    }

    // 폴더 소유권 확인
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId: req.user.userId
      }
    });

    if (!folder) {
      return res.status(404).json({ error: '폴더를 찾을 수 없습니다' });
    }

    const note = await prisma.note.create({
      data: {
        content: content || '',
        folderId,
        userId: req.user.userId
      }
    });

    res.status(201).json({ note });
  } catch (error) {
    console.error('메모 생성 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 메모 수정
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // 메모 소유권 확인
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });

    if (!existingNote) {
      return res.status(404).json({ error: '메모를 찾을 수 없습니다' });
    }

    const note = await prisma.note.update({
      where: { id },
      data: { content }
    });

    res.json({ note });
  } catch (error) {
    console.error('메모 수정 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 메모 삭제
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 메모 소유권 확인
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });

    if (!existingNote) {
      return res.status(404).json({ error: '메모를 찾을 수 없습니다' });
    }

    await prisma.note.delete({
      where: { id }
    });

    res.json({ message: '메모가 삭제되었습니다' });
  } catch (error) {
    console.error('메모 삭제 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 메모를 다른 폴더로 이동
router.patch('/:id/move', async (req, res) => {
  try {
    const { id } = req.params;
    const { folderId } = req.body;

    // 메모 소유권 확인
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });

    if (!existingNote) {
      return res.status(404).json({ error: '메모를 찾을 수 없습니다' });
    }

    // 폴더 소유권 확인
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId: req.user.userId
      }
    });

    if (!folder) {
      return res.status(404).json({ error: '폴더를 찾을 수 없습니다' });
    }

    const note = await prisma.note.update({
      where: { id },
      data: { folderId }
    });

    res.json({ note });
  } catch (error) {
    console.error('메모 이동 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;

