const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'seyyidoter3547@gmail.com';

    try {
        const user = await prisma.user.update({
            where: { email: email },
            data: { role: 'ADMIN' },
        });
        console.log(`User ${email} is now ADMIN.`);
    } catch (e) {
        // If update fails (e.g. user not found), try creating or just log
        console.error(`Could not update user ${email}:`, e.message);

        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (!existing) {
            console.log("User does not exist yet. Please login once via Google first.");
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
