# WinWin Travel MVP - Architecture Hints & Guidelines

> Detailed implementation hints for each architecture layer with code patterns, best practices, and integration tips.

---

## 📊 Architecture Diagrams

````carousel
![Main Architecture](C:/Users/Kamal/.gemini/antigravity/brain/89a8d260-9092-4a1e-a246-3c02d89f1ef8/architecture_diagram_1769347697473.png)
<!-- slide -->
![Search Orchestrator Flow](C:/Users/Kamal/.gemini/antigravity/brain/89a8d260-9092-4a1e-a246-3c02d89f1ef8/search_orchestrator_detail_1769347857630.png)
<!-- slide -->
![Integration Layer](C:/Users/Kamal/.gemini/antigravity/brain/89a8d260-9092-4a1e-a246-3c02d89f1ef8/integration_layer_detail_1769347880403.png)
<!-- slide -->
![AI Matching Service](C:/Users/Kamal/.gemini/antigravity/brain/89a8d260-9092-4a1e-a246-3c02d89f1ef8/ai_matching_detail_1769347905209.png)
<!-- slide -->
![Pricing & Availability](C:/Users/Kamal/.gemini/antigravity/brain/89a8d260-9092-4a1e-a246-3c02d89f1ef8/pricing_availability_detail_1769347953582.png)
<!-- slide -->
![User & Session](C:/Users/Kamal/.gemini/antigravity/brain/89a8d260-9092-4a1e-a246-3c02d89f1ef8/user_session_detail_1769347979998.png)
````

---

## 🎯 Layer 1: Search Orchestrator

### Purpose
The brain of the search system - receives user queries, fans out to providers, aggregates results, and applies personalization.

### Key Design Patterns

#### 1. Fan-Out/Fan-In Pattern
```typescript
async function searchHotels(request: SearchRequest): Promise<SearchResult> {
  // Fan-out: Query all integrations in parallel
  const promises = request.integrations.map(integration => 
    withTimeout(
      adapters[integration].search(request),
      5000 // 5 second timeout per provider
    ).catch(err => ({ error: err, integration }))
  );
  
  // Fan-in: Wait for all results
  const results = await Promise.allSettled(promises);
  
  // Aggregate successful results
  return aggregateResults(results);
}
```

#### 2. Circuit Breaker
```typescript
// Prevent cascading failures when a provider is down
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,      // Open after 5 failures
  resetTimeout: 30000,      // Try again after 30s
  monitorInterval: 10000,   // Check health every 10s
});

const hotelbedsWithBreaker = circuitBreaker.wrap(hotelbedsAdapter);
```

### Filter Engine Implementation

| Filter Type | Strategy | Performance |
|------------|----------|-------------|
| Price Range | In-memory filter | O(n) |
| Star Rating | Bitwise mask | O(1) per item |
| Amenities | Set intersection | O(m) where m = amenities |
| Geo Distance | Haversine formula | O(1) per item |
| Free Cancellation | Boolean check | O(1) per item |

```typescript
interface FilterPipeline {
  filters: Filter[];
  
  apply(hotels: HotelOffer[]): HotelOffer[] {
    return hotels.filter(hotel => 
      this.filters.every(f => f.matches(hotel))
    );
  }
}
```

### Sort Engine Implementation

```typescript
type SortOption = 
  | 'price_asc' 
  | 'price_desc' 
  | 'rating_desc' 
  | 'distance_asc'
  | 'relevance'; // AI-enhanced

const sortComparators: Record<SortOption, Comparator> = {
  price_asc: (a, b) => a.totalPrice - b.totalPrice,
  price_desc: (a, b) => b.totalPrice - a.totalPrice,
  rating_desc: (a, b) => b.reviewScore - a.reviewScore,
  distance_asc: (a, b) => a.distanceKm - b.distanceKm,
  relevance: (a, b) => b.personalizedScore - a.personalizedScore,
};
```

### Advanced Orchestration Details

#### 1. Streaming Discovery (Progressive Loading)
Instead of waiting for all providers to finish (which takes as long as the slowest provider), use a streaming approach with WebSockets to show results as they arrive.

```typescript
async function searchWithStreaming(request: SearchRequest, socketId: string) {
  const providers = request.integrations;
  
  providers.map(async (p) => {
    try {
      const results = await adapters[p].search(request);
      // Emit results immediately to the user's specific socket
      io.to(socketId).emit('search:partial_results', {
        provider: p,
        hotels: results
      });
    } catch (err) {
      io.to(socketId).emit('search:error', { provider: p });
    }
  });
}
```

#### 2. Identity Resolution (Deduplication)
Hotels often have different names across providers (e.g., "The Ritz Paris" vs "Ritz Hotel Paris").
- **Exact Match**: Use `hotelId` mapping table if available.
- **Fuzzy Match**: Use a composite key of `levenshtein(name)` + `location_grid(lat, lon, 100m)`.

---

## 💾 Database & Persistence Hints

### 1. Performance Indexing (`schema.prisma`)
Crucial indexes for search and personalization performance:

```prisma
model Reaction {
  // ...
  @@index([userId, type]) // Fast lookup of all "Likes" for personalization
  @@index([hotelId])      // Fast calculation of "Global Popularity"
}

model Booking {
  // ...
  @@index([userId, status]) // Profile page speed
  @@index([checkIn, status]) // Revenue reporting & availability heatmaps
}
```

### 2. Full-Text Search
While PostgreSQL is great, consider **Elasticsearch** or **Typesense** for Layer 1 if you have >50,000 hotels.
- Index hotel names, amenities, and locations.
- Sync data from providers periodically using background jobs.

---

## 🔌 Layer 2: Integration Layer (Advanced)

### Purpose
Abstract away provider-specific APIs behind a unified interface. Each adapter translates between our domain model and the provider's API.

### Adapter Interface Contract

```typescript
interface IntegrationAdapter {
  readonly name: string;
  readonly priority: number; // For result ordering
  
  // Core operations
  search(request: NormalizedSearchRequest): Promise<HotelOffer[]>;
  getHotelDetails(hotelId: string): Promise<HotelDetails>;
  getRoomAvailability(hotelId: string, roomId: string, dates: DateRange): Promise<Availability>;
  createBooking(booking: BookingRequest): Promise<BookingConfirmation>;
  cancelBooking(bookingId: string): Promise<CancellationResult>;
  
  // Health & monitoring
  healthCheck(): Promise<HealthStatus>;
  getMetrics(): AdapterMetrics;
}
```

### Hotelbeds Adapter Implementation

```typescript
class HotelbedsAdapter implements IntegrationAdapter {
  private readonly apiKey: string;
  private readonly secret: string;
  private readonly baseUrl = 'https://api.hotelbeds.com/hotel-api/1.0';
  
  // Hotelbeds requires signature header
  private generateSignature(): string {
    const timestamp = Math.floor(Date.now() / 1000);
    return crypto
      .createHash('sha256')
      .update(`${this.apiKey}${this.secret}${timestamp}`)
      .digest('hex');
  }
  
  async search(request: NormalizedSearchRequest): Promise<HotelOffer[]> {
    const hotelbedsRequest = this.mapToHotelbedsFormat(request);
    
    const response = await fetch(`${this.baseUrl}/hotels`, {
      method: 'POST',
      headers: {
        'Api-key': this.apiKey,
        'X-Signature': this.generateSignature(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hotelbedsRequest),
    });
    
    const data = await response.json();
    return this.mapToUnifiedFormat(data.hotels);
  }
  
  // Map Hotelbeds response to our unified HotelOffer
  private mapToUnifiedFormat(hotels: HotelbedsHotel[]): HotelOffer[] {
    return hotels.map(h => ({
      integrationName: 'HOTELBEDS_INTEGRATION',
      hotelId: h.code.toString(),
      name: h.name,
      starRating: h.categoryCode ? parseInt(h.categoryCode[0]) : 0,
      // ... more mappings
    }));
  }
}
```

### Error Handling Strategy

```typescript
enum IntegrationErrorType {
  TIMEOUT = 'TIMEOUT',
  RATE_LIMITED = 'RATE_LIMITED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

class IntegrationError extends Error {
  constructor(
    public readonly type: IntegrationErrorType,
    public readonly integration: string,
    public readonly originalError?: Error,
    public readonly retryAfter?: number, // For rate limiting
  ) {
    super(`${integration}: ${type}`);
  }
}
```

### Rate Limiting

| Provider | Rate Limit | Strategy |
|----------|-----------|----------|
| Hotelbeds | 100 req/s | Token bucket |
| Booking.com | 50 req/s | Sliding window |
| Expedia | 200 req/s | Token bucket |

```typescript
// Using p-limit for concurrency control
import pLimit from 'p-limit';

const hotelbedsLimiter = pLimit(100); // Max 100 concurrent

async function searchWithLimit(request) {
  return hotelbedsLimiter(() => hotelbedsAdapter.search(request));
}
```

### Hints & Tips

> [!TIP]
> **Mock Adapter**: Create a MockAdapter that returns static data for development. Toggle between real and mock using environment variables.

> [!CAUTION]
> **API Keys Security**: Never log full API keys. Use environment variables and secret management in production.

> [!NOTE]
> **Response Caching**: Some provider responses (hotel details, images) rarely change. Cache them for 24 hours to reduce API calls.

---

## 🤖 Layer 3: AI Matching Service

### Purpose
Personalize search results based on user behavior, reactions, and preferences. Power the GPT chatbot for natural language queries.

### Reaction System

```typescript
interface ReactionEvent {
  userId: string;
  sessionId: string;
  hotelId: string;
  integration: string;
  type: 'LIKE' | 'DISLIKE' | 'VIEW' | 'BOOK';
  context: {
    searchQuery: SearchRequest;
    position: number; // Position in results
    timestamp: Date;
  };
}

// Store reactions for analysis
async function recordReaction(event: ReactionEvent): Promise<void> {
  await prisma.reaction.upsert({
    where: {
      userId_hotelId_integration: {
        userId: event.userId,
        hotelId: event.hotelId,
        integration: event.integration,
      },
    },
    update: { type: event.type },
    create: event,
  });
  
  // Invalidate user preference cache
  await redis.del(`user:${event.userId}:preferences`);
}
```

### Preference Learning Algorithm

```typescript
interface UserPreferenceProfile {
  // Learned from reactions
  pricePreference: {
    avg: number;
    stdDev: number;
    sensitivity: 'low' | 'medium' | 'high';
  };
  
  starRatingPreference: number; // 1-5
  
  amenityWeights: Record<string, number>; // amenity -> importance
  
  locationPreference: {
    prefersCityCenter: boolean;
    maxDistanceKm: number;
  };
  
  // Negative signals from dislikes
  avoidPatterns: {
    lowRatings: boolean; // Disliked hotels < 7 rating
    noBreakfast: boolean;
    sharedBathroom: boolean;
  };
}

async function learnPreferences(userId: string): Promise<UserPreferenceProfile> {
  const reactions = await prisma.reaction.findMany({
    where: { userId },
    include: { hotel: true },
  });
  
  const likes = reactions.filter(r => r.type === 'LIKE');
  const dislikes = reactions.filter(r => r.type === 'DISLIKE');
  
  // Analyze patterns in likes vs dislikes
  return {
    pricePreference: analyzePricePattern(likes, dislikes),
    starRatingPreference: calculateAvgStarRating(likes),
    amenityWeights: extractAmenityPreferences(likes),
    locationPreference: analyzeLocationPattern(likes),
    avoidPatterns: extractNegativeSignals(dislikes),
  };
}
```

### Personalized Ranking

```typescript
function calculatePersonalizedScore(
  hotel: HotelOffer,
  profile: UserPreferenceProfile
): number {
  let score = 0;
  
  // Price match (0-30 points)
  const priceDiff = Math.abs(hotel.totalPrice - profile.pricePreference.avg);
  const priceScore = Math.max(0, 30 - (priceDiff / profile.pricePreference.stdDev) * 10);
  score += priceScore;
  
  // Star rating match (0-20 points)
  const starDiff = Math.abs(hotel.starRating - profile.starRatingPreference);
  score += Math.max(0, 20 - starDiff * 5);
  
  // Amenity match (0-30 points)
  const amenityScore = hotel.amenities.reduce((sum, amenity) => 
    sum + (profile.amenityWeights[amenity] || 0), 0
  );
  score += Math.min(30, amenityScore);
  
  // Avoid patterns penalty (-20 points each)
  if (profile.avoidPatterns.lowRatings && hotel.reviewScore < 7) {
    score -= 20;
  }
  
  return Math.max(0, score);
}
```

### GPT Chatbot Integration

```typescript
const systemPrompt = `You are a helpful hotel booking assistant for WinWin Travel.
You help users find hotels by understanding their natural language queries.

When a user asks about hotels, extract:
- Location (city, address, or landmark)
- Dates (check-in, check-out)
- Number of guests
- Budget (if mentioned)
- Preferences (amenities, style, etc.)

Respond with a structured search query OR a helpful clarification question.

Available amenities: pool, spa, gym, wifi, parking, breakfast, pet-friendly, beach-access`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

async function processChatMessage(
  messages: ChatMessage[],
  userId: string
): Promise<ChatResponse> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    functions: [
      {
        name: 'search_hotels',
        parameters: searchRequestSchema,
      },
    ],
  });
  
  // If GPT wants to search, execute the search
  if (response.choices[0].message.function_call?.name === 'search_hotels') {
    const searchParams = JSON.parse(response.choices[0].message.function_call.arguments);
    const results = await searchOrchestrator.search(searchParams);
    return { type: 'search_results', results };
  }
  
  return { type: 'message', content: response.choices[0].message.content };
}
```

### Hints & Tips

> [!TIP]
> **Cold Start**: For new users with no reactions, use collaborative filtering: "Users in your location who booked similar dates preferred..."

> [!IMPORTANT]
> **Privacy**: Reactions are sensitive data. Allow users to clear their reaction history and opt out of personalization.

> [!NOTE]
> **A/B Testing**: Measure the impact of AI ranking by comparing click-through and booking rates vs. pure price sorting.

---

## 💰 Layer 4: Pricing & Availability

### Purpose
Manage real-time prices with intelligent caching, calculate total costs, and ensure availability accuracy.

### Price Cache Strategy

```typescript
// Cache key structure
const cacheKey = (hotelId: string, dates: DateRange) => 
  `price:${hotelId}:${dates.checkIn}:${dates.checkOut}`;

// TTL based on demand
function calculateTTL(hotel: HotelOffer): number {
  if (hotel.availableRooms <= 3) return 60;      // Hot: 1 minute
  if (hotel.availableRooms <= 10) return 300;    // Warm: 5 minutes
  return 900;                                      // Cold: 15 minutes
}

// Stale-while-revalidate pattern
async function getPrice(hotelId: string, dates: DateRange): Promise<PriceInfo> {
  const key = cacheKey(hotelId, dates);
  const cached = await redis.get(key);
  
  if (cached) {
    const data = JSON.parse(cached);
    
    // If stale, trigger background refresh but return cached
    if (Date.now() > data.refreshAt) {
      backgroundRefresh(hotelId, dates); // Don't await
    }
    
    return data.price;
  }
  
  // Cache miss: fetch fresh data
  return fetchAndCachePrice(hotelId, dates);
}
```

### Price Calculator

```typescript
interface PriceBreakdown {
  basePrice: number;
  nights: number;
  rooms: number;
  subtotal: number;
  
  taxes: {
    vat: number;
    cityTax: number;
    serviceFee: number;
  };
  
  discounts?: {
    earlyBird?: number;
    longStay?: number;
    loyalty?: number;
  };
  
  total: number;
  currency: string;
  
  perNight: number; // For display
}

function calculatePrice(params: {
  pricePerNight: number;
  nights: number;
  rooms: number;
  country: string;
  userTier?: 'standard' | 'gold' | 'platinum';
}): PriceBreakdown {
  const subtotal = params.pricePerNight * params.nights * params.rooms;
  
  // Tax rates by country
  const taxRates = TAX_RATES[params.country] || { vat: 0.1, cityTax: 2 };
  
  const taxes = {
    vat: subtotal * taxRates.vat,
    cityTax: taxRates.cityTax * params.nights,
    serviceFee: subtotal * 0.05, // 5% service fee
  };
  
  const discounts = calculateDiscounts(params);
  
  const total = subtotal 
    + taxes.vat + taxes.cityTax + taxes.serviceFee
    - (discounts.earlyBird || 0)
    - (discounts.longStay || 0)
    - (discounts.loyalty || 0);
  
  return {
    basePrice: params.pricePerNight,
    nights: params.nights,
    rooms: params.rooms,
    subtotal,
    taxes,
    discounts,
    total: Math.round(total * 100) / 100,
    currency: 'EUR',
    perNight: Math.round((total / params.nights) * 100) / 100,
  };
}
```

### Currency Conversion

```typescript
// Fetch rates daily from ECB or similar
const exchangeRates = new Map<string, number>();

async function refreshExchangeRates(): Promise<void> {
  const response = await fetch('https://api.exchangerate.host/latest?base=EUR');
  const data = await response.json();
  
  for (const [currency, rate] of Object.entries(data.rates)) {
    exchangeRates.set(currency, rate as number);
  }
}

function convertCurrency(amount: number, from: string, to: string): number {
  if (from === to) return amount;
  
  // Convert to EUR first, then to target
  const inEur = from === 'EUR' ? amount : amount / exchangeRates.get(from)!;
  return to === 'EUR' ? inEur : inEur * exchangeRates.get(to)!;
}
```

### Hints & Tips

> [!WARNING]
> **Price Accuracy**: Always show "Price may vary" disclaimer. Final price is confirmed only at booking time.

> [!TIP]
> **Background Refresh**: Use BullMQ to schedule price refreshes for hotels with high view counts.

> [!CAUTION]
> **Overbooking**: Never cache availability for more than 60 seconds for rooms with ≤3 left.

---

## 👤 Layer 5: User & Session

### Purpose
Handle authentication, session management, and user preferences across anonymous and authenticated states.

### NextAuth.js Configuration

```typescript
// src/lib/auth.config.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
  ],
  
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    
    async signIn({ user, account }) {
      // Merge anonymous session data on sign-in
      const anonymousSessionId = cookies().get('anonymous_session')?.value;
      if (anonymousSessionId) {
        await mergeAnonymousSession(anonymousSessionId, user.id);
      }
      return true;
    },
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};
```

### Anonymous Session Handling

```typescript
// Middleware to create/validate anonymous sessions
export async function sessionMiddleware(req: NextRequest) {
  let sessionId = req.cookies.get('anonymous_session')?.value;
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    
    // Store in Redis with 30-day TTL
    await redis.setex(
      `anon:${sessionId}`,
      30 * 24 * 60 * 60,
      JSON.stringify({
        createdAt: new Date(),
        reactions: [],
        searches: [],
        compareList: [],
      })
    );
  }
  
  // Add session ID to response
  const response = NextResponse.next();
  response.cookies.set('anonymous_session', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
  });
  
  return response;
}

// Merge anonymous data when user logs in
async function mergeAnonymousSession(
  anonymousId: string,
  userId: string
): Promise<void> {
  const anonData = await redis.get(`anon:${anonymousId}`);
  if (!anonData) return;
  
  const { reactions, searches, compareList } = JSON.parse(anonData);
  
  // Migrate reactions to database
  for (const reaction of reactions) {
    await prisma.reaction.upsert({
      where: {
        userId_hotelId_integration: {
          userId,
          hotelId: reaction.hotelId,
          integration: reaction.integration,
        },
      },
      update: { type: reaction.type },
      create: { ...reaction, userId },
    });
  }
  
  // Delete anonymous session
  await redis.del(`anon:${anonymousId}`);
}
```

### User Preferences Schema

```typescript
interface UserPreferences {
  // Display
  currency: 'EUR' | 'USD' | 'GBP' | 'UAH';
  language: 'en' | 'uk' | 'de' | 'fr';
  
  // Defaults
  defaultAdults: number;
  defaultChildren: number[];
  
  // Notifications
  emailNotifications: {
    priceDrops: boolean;
    bookingReminders: boolean;
    promotions: boolean;
  };
  
  // Privacy
  personalizedResults: boolean;
  shareDataForAnalytics: boolean;
}

// API to update preferences
app.patch('/api/user/preferences', async (req, res) => {
  const { userId } = await getSession(req);
  
  await prisma.userPreferences.upsert({
    where: { userId },
    update: req.body,
    create: { userId, ...req.body },
  });
  
  // Invalidate preference cache
  await redis.del(`user:${userId}:preferences`);
  
  res.json({ success: true });
});
```

### Hints & Tips

> [!TIP]
> **Session Merge UX**: Show a toast after login: "We've saved your 3 liked hotels to your account!"

> [!IMPORTANT]
> **GDPR Compliance**: Implement data export and deletion endpoints. Log all data access for audit.

> [!NOTE]
> **Rate Limiting**: Use user ID for authenticated requests, IP for anonymous. Authenticated users get higher limits.

---

## 🌐 Layer 6: Realtime Gateway

### Purpose
WebSocket-based real-time updates for price changes, availability alerts, and chat functionality.

### Socket.io Server Setup

```typescript
// src/services/realtime/realtime-gateway.ts
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

export function createRealtimeGateway(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
  });
  
  // Redis adapter for horizontal scaling
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
  
  io.on('connection', async (socket) => {
    const session = await authenticateSocket(socket);
    
    // Join user-specific room
    if (session.userId) {
      socket.join(`user:${session.userId}`);
    }
    socket.join(`session:${session.sessionId}`);
    
    // Handle subscriptions
    socket.on('subscribe:hotel', (hotelId) => {
      socket.join(`hotel:${hotelId}`);
    });
    
    socket.on('subscribe:search', (searchId) => {
      socket.join(`search:${searchId}`);
    });
    
    // Chat handling
    socket.on('chat:message', async (message) => {
      const response = await gptChatbot.process(message, session);
      socket.emit('chat:response', response);
    });
  });
  
  return io;
}
```

### Event Types & Payloads

```typescript
// Event definitions
interface RealtimeEvents {
  // Price updates
  'price:update': {
    hotelId: string;
    roomId: string;
    oldPrice: number;
    newPrice: number;
    currency: string;
    changePercent: number;
  };
  
  // Availability alerts
  'availability:update': {
    hotelId: string;
    roomId: string;
    roomsLeft: number;
    status: 'available' | 'limited' | 'sold_out';
  };
  
  // Booking status
  'booking:status': {
    bookingId: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    message?: string;
  };
  
  // Search progress
  'search:progress': {
    searchId: string;
    integration: string;
    status: 'loading' | 'done' | 'error';
    resultsCount?: number;
  };
  
  // Chat
  'chat:message': {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
}

// Emit price update
function emitPriceUpdate(hotelId: string, update: PriceUpdate) {
  io.to(`hotel:${hotelId}`).emit('price:update', update);
  
  // Also notify users who liked this hotel
  const interestedUsers = await getUsersWhoLiked(hotelId);
  for (const userId of interestedUsers) {
    io.to(`user:${userId}`).emit('price:update', update);
  }
}
```

### Client-Side Integration

```typescript
// React hook for realtime updates
function useRealtimeUpdates(hotelId: string) {
  const [price, setPrice] = useState<number | null>(null);
  const [availability, setAvailability] = useState<string>('checking');
  
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL);
    
    socket.emit('subscribe:hotel', hotelId);
    
    socket.on('price:update', (update) => {
      if (update.hotelId === hotelId) {
        setPrice(update.newPrice);
        // Show toast for significant changes
        if (Math.abs(update.changePercent) > 5) {
          toast({
            title: update.changePercent < 0 ? '🎉 Price dropped!' : '⚠️ Price increased',
            description: `Now €${update.newPrice} (${update.changePercent}%)`,
          });
        }
      }
    });
    
    socket.on('availability:update', (update) => {
      if (update.hotelId === hotelId) {
        setAvailability(update.status);
      }
    });
    
    return () => {
      socket.disconnect();
    };
  }, [hotelId]);
  
  return { price, availability };
}
```

### Hints & Tips

> [!TIP]
> **Connection Efficiency**: Use Socket.io rooms to avoid broadcasting to all clients. Only subscribed users receive updates.

> [!WARNING]
> **Scaling**: For production, use Redis adapter to share events across multiple server instances.

> [!NOTE]
> **Fallback**: If WebSocket fails, poll `/api/prices` every 30 seconds as a fallback.

---

## 🚀 Quick Start Checklist

### Prerequisites
- [ ] Node.js 18+
- [ ] PostgreSQL 14+
- [ ] Redis 7+
- [ ] Hotelbeds API credentials
- [ ] OpenAI API key
- [ ] OAuth app credentials (Google, Facebook, Apple)

### Environment Setup
```bash
# Clone and install
git clone <repo>
cd evidenceWWT
npm install

# Database setup
npx prisma migrate dev

# Start development
npm run dev
```

### First API Test
```bash
# Health check
curl http://localhost:3000/api/health

# Search test
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "location": { "latitude": 52.377956, "longitude": 4.89707, "radius": 10 },
    "stay": { "checkIn": "2026-02-01", "checkOut": "2026-02-04" },
    "guests": { "adults": 2 },
    "integrations": ["MOCK_INTEGRATION"]
  }'
```

---

## 📚 Additional Resources

- [Hotelbeds API Documentation](https://developer.hotelbeds.com/)
- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [Socket.io Scaling Guide](https://socket.io/docs/v4/redis-adapter/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
