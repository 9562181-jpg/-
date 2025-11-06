const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

// 사용자의 모든 폴더 조회
router.get('/', async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ folders });
  } catch (error) {
    console.error('폴더 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 폴더 생성
router.post('/', async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ error: '폴더 이름이 필요합니다' });
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        parentId: parentId || null,
        userId: req.user.userId,
      },
    });

    res.status(201).json({ folder });
  } catch (error) {
    console.error('폴더 생성 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 폴더 수정
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existingFolder = await prisma.folder.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!existingFolder) {
      return res.status(404).json({ error: '폴더를 찾을 수 없습니다' });
    }

    if (existingFolder.isSpecial) {
      return res.status(400).json({ error: '특수 폴더는 수정할 수 없습니다' });
    }

    const folder = await prisma.folder.update({
      where: { id },
      data: { name },
    });

    res.json({ folder });
  } catch (error) {
    console.error('폴더 수정 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 폴더 삭제
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingFolder = await prisma.folder.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!existingFolder) {
      return res.status(404).json({ error: '폴더를 찾을 수 없습니다' });
    }

    if (existingFolder.isSpecial) {
      return res.status(400).json({ error: '특수 폴더는 삭제할 수 없습니다' });
    }

    // 휴지통 폴더 찾기
    const recentlyDeletedFolder = await prisma.folder.findFirst({
      where: {
        userId: req.user.userId,
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

    res.json({ message: '폴더가 삭제되었습니다' });
  } catch (error) {
    console.error('폴더 삭제 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;
