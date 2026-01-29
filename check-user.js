const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'seyyidoter3547@gmail.com';
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User from DB:', user);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
