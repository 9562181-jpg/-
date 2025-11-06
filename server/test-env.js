require('dotenv').config();

console.log('=== Environment Variables Test ===');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'OK' : 'MISSING');
console.log('DIRECT_URL:', process.env.DIRECT_URL ? 'OK' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'OK' : 'MISSING');
console.log('PORT:', process.env.PORT || 'MISSING');
console.log('=================================');

// Prisma 연결 테스트
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Supabase 연결 성공!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Supabase 연결 실패:', error.message);
  }
}

testConnection();

