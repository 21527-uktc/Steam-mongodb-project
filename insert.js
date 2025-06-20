
const { MongoClient } = require("mongodb");

async function run() {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();
    const db = client.db("steam_clone");

    await Promise.all([
      db.collection("users").deleteMany({}),
      db.collection("games").deleteMany({}),
      db.collection("reviews").deleteMany({}),
      db.collection("purchases").deleteMany({}),
      db.collection("developers").deleteMany({}),
    ]);

    const users = Array.from({ length: 10 }, (_, i) => ({
      username: `user${i + 1}`,
      email: `user${i + 1}@mail.com`,
      age: 15 + i,
      favorites: i % 2 === 0 ? ["CS2", "Dota 2"] : ["PUBG", "Fortnite"],
      profile: {
        country: i % 3 === 0 ? "Bulgaria" : "USA",
        level: 1 + i,
      },
    }));
    await db.collection("users").insertMany(users);

    const games = [
      { title: "CS2", genre: "Shooter", price: 0, rating: 9.1, tags: ["fps", "competitive"] },
      { title: "Dota 2", genre: "MOBA", price: 0, rating: 8.5, tags: ["strategy", "team"] },
      { title: "PUBG", genre: "Shooter", price: 10, rating: 7.8, tags: ["fps", "battle royale"] },
      { title: "Fortnite", genre: "Shooter", price: 0, rating: 7.0, tags: ["fps", "battle royale"] },
      { title: "Minecraft", genre: "Sandbox", price: 26.95, rating: 9.0, tags: ["creative", "adventure"] },
      { title: "Cyberpunk", genre: "RPG", price: 60, rating: 7.5, tags: ["rpg", "open world"] },
      { title: "Among Us", genre: "Party", price: 5, rating: 7.3, tags: ["multiplayer", "social"] },
      { title: "The Witcher 3", genre: "RPG", price: 40, rating: 9.8, tags: ["rpg", "story"] },
      { title: "Stardew Valley", genre: "Simulation", price: 15, rating: 8.9, tags: ["farming", "rpg"] },
      { title: "Hades", genre: "Roguelike", price: 25, rating: 9.2, tags: ["roguelike", "action"] },
    ];
    await db.collection("games").insertMany(games);

    const reviews = [];
    for (let i = 1; i <= 10; i++) {
      reviews.push({
        game: games[i % games.length].title,
        user: `user${i}`,
        score: Math.floor(Math.random() * 5) + 6, // 6 - 10
        comment: `Review comment ${i}`,
        date: new Date(Date.now() - i * 86400000),
      });
    }
    await db.collection("reviews").insertMany(reviews);

    const purchases = [];
    for (let i = 1; i <= 10; i++) {
      purchases.push({
        user: `user${i}`,
        game: games[i % games.length].title,
        date: new Date(Date.now() - i * 86400000 * 2),
        price: games[i % games.length].price,
      });
    }
    await db.collection("purchases").insertMany(purchases);
    
    const developers = [
      { name: "Valve", founded: 1996, games: ["CS2", "Dota 2"], country: "USA" },
      { name: "Bluehole", founded: 2007, games: ["PUBG"], country: "South Korea" },
      { name: "Epic Games", founded: 1991, games: ["Fortnite"], country: "USA" },
      { name: "Mojang", founded: 2009, games: ["Minecraft"], country: "Sweden" },
      { name: "CD Projekt", founded: 1994, games: ["Cyberpunk", "The Witcher 3"], country: "Poland" },
      { name: "Innersloth", founded: 2015, games: ["Among Us"], country: "USA" },
      { name: "ConcernedApe", founded: 2012, games: ["Stardew Valley"], country: "USA" },
      { name: "Supergiant Games", founded: 2009, games: ["Hades"], country: "USA" },
      { name: "Unknown Dev 1", founded: 2000, games: ["Game1"], country: "Unknown" },
      { name: "Unknown Dev 2", founded: 2010, games: ["Game2"], country: "Unknown" },
    ];
    await db.collection("developers").insertMany(developers);

    console.log("Всички документи са добавени.");
  } finally {
    await client.close();
  }
}

run();

