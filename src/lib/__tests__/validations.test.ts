import { describe, it, expect } from 'vitest'
import {
    SearchRequestSchema,
    BookingRequestSchema,
    ChatRequestSchema,
    ReactionRequestSchema,
    validateRequest,
} from '../validations'

describe('SearchRequestSchema', () => {
    it('accepts valid search with all fields', () => {
        const input = {
            destination: 'Paris',
            location: { name: 'Paris', lat: 48.8566, lng: 2.3522, radius: 10 },
            dates: { checkIn: '2026-03-01', checkOut: '2026-03-05' },
            occupancy: { adults: 2, children: [5, 8], rooms: 1 },
            currency: 'EUR',
            sort: 'price_asc',
            query: 'luxury hotel near Eiffel Tower',
        }
        const result = validateRequest(SearchRequestSchema, input)
        expect(result.success).toBe(true)
    })

    it('accepts minimal search (empty object)', () => {
        const result = validateRequest(SearchRequestSchema, {})
        expect(result.success).toBe(true)
    })

    it('rejects invalid sort value', () => {
        const result = validateRequest(SearchRequestSchema, { sort: 'invalid' })
        expect(result.success).toBe(false)
    })

    it('rejects adults > 10', () => {
        const result = validateRequest(SearchRequestSchema, {
            occupancy: { adults: 99 },
        })
        expect(result.success).toBe(false)
    })

    it('rejects query > 500 chars', () => {
        const result = validateRequest(SearchRequestSchema, {
            query: 'a'.repeat(501),
        })
        expect(result.success).toBe(false)
    })
})

describe('BookingRequestSchema', () => {
    it('accepts valid INITIALIZE action', () => {
        const input = {
            action: 'INITIALIZE',
            data: {
                hotelId: 'hotel-123',
                roomType: 'deluxe',
                integration: 'hotelbeds',
                pricePerNight: 150,
                totalPrice: 600,
                currency: 'EUR',
                checkIn: '2026-03-01',
                checkOut: '2026-03-05',
                nights: 4,
            },
        }
        const result = validateRequest(BookingRequestSchema, input)
        expect(result.success).toBe(true)
    })

    it('accepts valid CONFIRM action', () => {
        const input = {
            action: 'CONFIRM',
            data: {
                lockId: 'lock-abc',
                guestName: 'John Doe',
                guestEmail: 'john@example.com',
                specialRequests: 'Late check-in',
            },
        }
        const result = validateRequest(BookingRequestSchema, input)
        expect(result.success).toBe(true)
    })

    it('rejects unknown action', () => {
        const result = validateRequest(BookingRequestSchema, {
            action: 'DELETE',
            data: {},
        })
        expect(result.success).toBe(false)
    })

    it('rejects CONFIRM with invalid email', () => {
        const result = validateRequest(BookingRequestSchema, {
            action: 'CONFIRM',
            data: {
                lockId: 'lock-abc',
                guestName: 'John',
                guestEmail: 'not-an-email',
            },
        })
        expect(result.success).toBe(false)
    })
})

describe('ChatRequestSchema', () => {
    it('accepts valid messages array', () => {
        const input = {
            messages: [
                { role: 'user', content: 'Find me a hotel in Dubai' },
            ],
        }
        const result = validateRequest(ChatRequestSchema, input)
        expect(result.success).toBe(true)
    })

    it('rejects empty messages', () => {
        const result = validateRequest(ChatRequestSchema, { messages: [] })
        expect(result.success).toBe(false)
    })

    it('rejects invalid role', () => {
        const result = validateRequest(ChatRequestSchema, {
            messages: [{ role: 'hacker', content: 'test' }],
        })
        expect(result.success).toBe(false)
    })
})

describe('ReactionRequestSchema', () => {
    it('accepts valid LIKE reaction', () => {
        const input = {
            hotelId: 'hotel-456',
            type: 'LIKE',
            starRating: 5,
        }
        const result = validateRequest(ReactionRequestSchema, input)
        expect(result.success).toBe(true)
    })

    it('rejects missing hotelId', () => {
        const result = validateRequest(ReactionRequestSchema, { type: 'LIKE' })
        expect(result.success).toBe(false)
    })

    it('rejects invalid reaction type', () => {
        const result = validateRequest(ReactionRequestSchema, {
            hotelId: 'h1',
            type: 'LOVE',
        })
        expect(result.success).toBe(false)
    })
})
