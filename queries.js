// queries.js
const { MongoClient } = require("mongodb");

async function run() {
    const client = new MongoClient("mongodb://localhost:27017");
    try {
        await client.connect();
        const db = client.db("steam_clone");

        // Извличане на всички потребители
        console.log(await db.collection("users").find().toArray());

        // Филтриране на игри по жанр
        console.log(await db.collection("games").find({ genre: "Shooter" }).toArray());

        // Филтриране на ревюта с повече от 8 точки
        console.log(await db.collection("reviews").find({ score: { $gt: 8 } }).toArray());

        // Update: повишаване на левъла на user
        await db.collection("users").updateOne({ username: "gamer01" }, { $inc: { "profile.level": 1 } });

        // Delete: изтриване на ревю с ниска оценка
        await db.collection("reviews").deleteOne({ score: { $lt: 5 } });

        // Aggregation: Брой ревюта на игра
        const reviewCounts = await db.collection("reviews").aggregate([
            { $group: { _id: "$game", count: { $sum: 1 } } }
        ]).toArray();
        console.log("Review count:", reviewCounts);

        // Aggregation: Средна цена на покупките
        const avgPurchase = await db.collection("purchases").aggregate([
            { $group: { _id: null, avgPrice: { $avg: "$price" } } }
        ]).toArray();
        console.log("Avg purchase:", avgPurchase);

        // Aggregation: Сортиране на игри по рейтинг
        const sortedGames = await db.collection("games").aggregate([
            { $sort: { rating: -1 } }
        ]).toArray();
        console.log("Sorted games:", sortedGames);

    } finally {
        await client.close();
    }
}

run();
