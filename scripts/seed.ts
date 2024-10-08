const {PrismaClient} = require ("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
               {name: "Computer Science"},
               {name: "Music"},
               {name: "Fittness"},
               {name: "Photography"},
               {name: "Accounting"},
               {name: "Engineering"},
               {name: "Filming"}
            ]
        })
    } catch (error) {
        console.log("Error seeding the database categories");
    } finally {
        await database.$disconnect();
    }
}

main();