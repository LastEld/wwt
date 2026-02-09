import { PrismaClient, ReactionType, BookingStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding WinWin Travel database...");

  // ============================================
  // 1. Seed Users (1 admin, 1 regular)
  // ============================================

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@winwintravel.com" },
    update: {},
    create: {
      id: "seed-admin-001",
      email: "admin@winwintravel.com",
      name: "Admin User",
      emailVerified: new Date("2025-01-01T00:00:00Z"),
      image: null,
    },
  });
  console.log(`  Upserted admin user: ${adminUser.email}`);

  const regularUser = await prisma.user.upsert({
    where: { email: "traveler@example.com" },
    update: {},
    create: {
      id: "seed-user-001",
      email: "traveler@example.com",
      name: "Jane Traveler",
      emailVerified: new Date("2025-03-15T00:00:00Z"),
      image: null,
    },
  });
  console.log(`  Upserted regular user: ${regularUser.email}`);

  // ============================================
  // 2. Seed UserPreferences for both users
  // ============================================

  await prisma.userPreferences.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      defaultCurrency: "EUR",
      defaultAdults: 2,
      defaultChildren: 0,
      emailNotifications: true,
      priceAlerts: true,
      marketingEmails: false,
      enablePersonalization: true,
      prefersDarkMode: true,
    },
  });

  await prisma.userPreferences.upsert({
    where: { userId: regularUser.id },
    update: {},
    create: {
      userId: regularUser.id,
      defaultCurrency: "USD",
      defaultAdults: 2,
      defaultChildren: 1,
      emailNotifications: true,
      priceAlerts: true,
      marketingEmails: true,
      enablePersonalization: true,
      prefersDarkMode: false,
    },
  });
  console.log("  Upserted user preferences");

  // ============================================
  // 3. Seed 5 Demo Hotels (via SupplierData)
  // ============================================

  const hotels = [
    {
      hotelId: "hotel-kyiv-001",
      integration: "hotelbeds",
      name: "Premier Palace Hotel Kyiv",
      description:
        "A grand five-star hotel in the heart of Kyiv, offering luxurious rooms, a full-service spa, and panoramic views of the city skyline. Located steps away from Shevchenko Park and the historic centre.",
      amenities: ["spa", "pool", "restaurant", "bar", "gym", "wifi", "parking", "concierge"],
      locationName: "Kyiv, Ukraine",
      starRating: 5,
      priceRange: "$200-$500",
      themes: ["luxury", "city", "spa"],
      contentHash: "kyiv-001-v1",
    },
    {
      hotelId: "hotel-paris-001",
      integration: "hotelbeds",
      name: "Le Marais Boutique Hotel",
      description:
        "An intimate four-star boutique hotel tucked in the cobblestone streets of Le Marais. Blending 17th-century architecture with contemporary Parisian design, each room features curated artwork and floor-to-ceiling windows.",
      amenities: ["restaurant", "bar", "wifi", "concierge", "room-service"],
      locationName: "Paris, France",
      starRating: 4,
      priceRange: "$180-$400",
      themes: ["boutique", "romantic", "city"],
      contentHash: "paris-001-v1",
    },
    {
      hotelId: "hotel-dubai-001",
      integration: "booking",
      name: "Azure Sands Resort & Spa",
      description:
        "A spectacular five-star beachfront resort on the Palm Jumeirah, featuring an infinity pool overlooking the Arabian Gulf, six gourmet restaurants, and an award-winning underwater spa experience.",
      amenities: ["spa", "pool", "beach", "restaurant", "bar", "gym", "wifi", "kids-club", "concierge"],
      locationName: "Dubai, UAE",
      starRating: 5,
      priceRange: "$300-$800",
      themes: ["luxury", "beach", "resort", "family"],
      contentHash: "dubai-001-v1",
    },
    {
      hotelId: "hotel-bali-001",
      integration: "hotelbeds",
      name: "Tegallalang Rice Terrace Villa",
      description:
        "A serene four-star eco-resort nestled among the iconic rice terraces of Ubud. Private pool villas with open-air living spaces offer an authentic Balinese experience with modern comforts.",
      amenities: ["pool", "spa", "restaurant", "yoga", "wifi", "shuttle"],
      locationName: "Bali, Indonesia",
      starRating: 4,
      priceRange: "$80-$250",
      themes: ["eco", "wellness", "nature", "romantic"],
      contentHash: "bali-001-v1",
    },
    {
      hotelId: "hotel-nyc-001",
      integration: "booking",
      name: "The Greenwich Luxe",
      description:
        "A sleek three-star design hotel in Greenwich Village, Manhattan. Floor-to-ceiling city views, a rooftop cocktail bar, and direct subway access make it the perfect base for exploring New York.",
      amenities: ["bar", "gym", "wifi", "concierge", "business-centre"],
      locationName: "New York, USA",
      starRating: 3,
      priceRange: "$150-$350",
      themes: ["city", "design", "nightlife"],
      contentHash: "nyc-001-v1",
    },
  ];

  for (const hotel of hotels) {
    await prisma.supplierData.upsert({
      where: { hotelId: hotel.hotelId },
      update: {},
      create: {
        hotelId: hotel.hotelId,
        integration: hotel.integration,
        name: hotel.name,
        description: hotel.description,
        amenities: hotel.amenities,
        locationName: hotel.locationName,
        starRating: hotel.starRating,
        priceRange: hotel.priceRange,
        themes: hotel.themes,
        contentHash: hotel.contentHash,
        indexedAt: new Date(),
      },
    });
  }
  console.log(`  Upserted ${hotels.length} demo hotels (SupplierData)`);

  // ============================================
  // 4. Seed SearchHistory entries (realistic coordinates)
  // ============================================

  // We use a fixed session ID so upserts work on re-runs.
  // SearchHistory has no unique constraint beyond id, so we use
  // a deterministic id for idempotency.

  const searches = [
    {
      id: "seed-search-001",
      userId: regularUser.id,
      sessionId: "seed-session-001",
      query: { destination: "Paris", checkIn: "2025-07-01", checkOut: "2025-07-05", adults: 2 },
      destination: "Paris, France",
      latitude: 48.8566,
      longitude: 2.3522,
      checkIn: new Date("2025-07-01"),
      checkOut: new Date("2025-07-05"),
      adults: 2,
      children: 0,
      rooms: 1,
      resultsCount: 42,
    },
    {
      id: "seed-search-002",
      userId: regularUser.id,
      sessionId: "seed-session-001",
      query: { destination: "Dubai", checkIn: "2025-12-20", checkOut: "2025-12-27", adults: 2, children: 1 },
      destination: "Dubai, UAE",
      latitude: 25.2048,
      longitude: 55.2708,
      checkIn: new Date("2025-12-20"),
      checkOut: new Date("2025-12-27"),
      adults: 2,
      children: 1,
      rooms: 1,
      resultsCount: 78,
    },
  ];

  for (const search of searches) {
    await prisma.searchHistory.upsert({
      where: { id: search.id },
      update: {},
      create: search,
    });
  }
  console.log("  Upserted search history entries");

  // ============================================
  // 5. Seed 2 Sample Bookings
  // ============================================

  const bookings = [
    {
      id: "seed-booking-001",
      userId: regularUser.id,
      hotelId: "hotel-paris-001",
      hotelName: "Le Marais Boutique Hotel",
      roomId: "room-paris-deluxe-01",
      roomType: "Deluxe Double",
      integration: "hotelbeds",
      checkIn: new Date("2025-07-01T14:00:00Z"),
      checkOut: new Date("2025-07-05T11:00:00Z"),
      nights: 4,
      guests: 2,
      rooms: 1,
      pricePerNight: new Decimal("220.00"),
      subtotal: new Decimal("880.00"),
      taxes: new Decimal("88.00"),
      fees: new Decimal("15.00"),
      totalPrice: new Decimal("983.00"),
      currency: "EUR",
      status: BookingStatus.CONFIRMED,
      confirmationId: "HB-2025-PARIS-9A3F",
      guestName: "Jane Traveler",
      guestEmail: "traveler@example.com",
      guestPhone: "+1-555-0199",
      specialRequests: "Late check-in requested, arriving after 22:00.",
      confirmedAt: new Date("2025-05-20T10:30:00Z"),
    },
    {
      id: "seed-booking-002",
      userId: adminUser.id,
      hotelId: "hotel-dubai-001",
      hotelName: "Azure Sands Resort & Spa",
      roomId: "room-dubai-suite-01",
      roomType: "Ocean View Suite",
      integration: "booking",
      checkIn: new Date("2025-12-20T15:00:00Z"),
      checkOut: new Date("2025-12-27T12:00:00Z"),
      nights: 7,
      guests: 2,
      rooms: 1,
      pricePerNight: new Decimal("450.00"),
      subtotal: new Decimal("3150.00"),
      taxes: new Decimal("157.50"),
      fees: new Decimal("25.00"),
      totalPrice: new Decimal("3332.50"),
      currency: "EUR",
      status: BookingStatus.PENDING,
      confirmationId: null,
      guestName: "Admin User",
      guestEmail: "admin@winwintravel.com",
      guestPhone: null,
      specialRequests: null,
      confirmedAt: null,
    },
  ];

  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: { id: booking.id },
      update: {},
      create: booking,
    });
  }
  console.log(`  Upserted ${bookings.length} sample bookings`);

  // ============================================
  // 6. Seed Reactions (user preferences on hotels)
  // ============================================

  const reactions = [
    {
      id: "seed-reaction-001",
      userId: regularUser.id,
      hotelId: "hotel-paris-001",
      roomId: null,
      integration: "hotelbeds",
      type: ReactionType.LIKE,
      priceAtReaction: new Decimal("220.00"),
      starRating: 4,
      amenities: ["restaurant", "bar", "wifi", "concierge"],
    },
    {
      id: "seed-reaction-002",
      userId: regularUser.id,
      hotelId: "hotel-nyc-001",
      roomId: null,
      integration: "booking",
      type: ReactionType.DISLIKE,
      priceAtReaction: new Decimal("280.00"),
      starRating: 3,
      amenities: ["bar", "gym", "wifi"],
    },
  ];

  for (const reaction of reactions) {
    // Upsert on the composite unique: userId + hotelId + integration
    await prisma.reaction.upsert({
      where: {
        userId_hotelId_integration: {
          userId: reaction.userId,
          hotelId: reaction.hotelId,
          integration: reaction.integration,
        },
      },
      update: {},
      create: reaction,
    });
  }
  console.log("  Upserted reactions");

  // ============================================
  // 7. Seed DemandSignals
  // ============================================

  const demandSignals = [
    { destination: "Paris, France", searchCount: 1542, bookingCount: 312, strength: 0.85, trend: "RISING" },
    { destination: "Dubai, UAE", searchCount: 2103, bookingCount: 489, strength: 0.92, trend: "RISING" },
    { destination: "Bali, Indonesia", searchCount: 987, bookingCount: 201, strength: 0.65, trend: "STABLE" },
    { destination: "Kyiv, Ukraine", searchCount: 345, bookingCount: 67, strength: 0.35, trend: "RISING" },
    { destination: "New York, USA", searchCount: 1876, bookingCount: 401, strength: 0.78, trend: "STABLE" },
  ];

  for (const signal of demandSignals) {
    await prisma.demandSignal.upsert({
      where: { destination: signal.destination },
      update: {
        searchCount: signal.searchCount,
        bookingCount: signal.bookingCount,
        strength: signal.strength,
        trend: signal.trend,
      },
      create: signal,
    });
  }
  console.log("  Upserted demand signals");

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
