export interface PriceBreakdown {
    baseAmount: number;
    nights: number;
    subtotal: number;
    vat: number;
    cityTax: number;
    serviceFee: number;
    total: number;
    currency: string;
}

export class PricingService {
    private static VAT_RATE = 0.20; // 20%
    private static CITY_TAX_PER_NIGHT = 2.50; // Fixed 2.50 EUR
    private static SERVICE_FEE_RATE = 0.05; // 5% platform fee

    static calculateTotal(
        basePricePerNight: number,
        nights: number,
        currency: string = "EUR"
    ): PriceBreakdown {
        const subtotal = basePricePerNight * nights;
        const vat = subtotal * this.VAT_RATE;
        const cityTax = this.CITY_TAX_PER_NIGHT * nights;
        const serviceFee = subtotal * this.SERVICE_FEE_RATE;
        const total = subtotal + vat + cityTax + serviceFee;

        return {
            baseAmount: basePricePerNight,
            nights,
            subtotal,
            vat,
            cityTax,
            serviceFee,
            total: parseFloat(total.toFixed(2)),
            currency
        };
    }

    /**
     * Mock currency conversion. In production, this would use a real FX API.
     */
    static convert(amount: number, from: string, to: string): number {
        if (from === to) return amount;

        const rates: Record<string, number> = {
            "EUR": 1,
            "USD": 1.08,
            "GBP": 0.84
        };

        const inEur = amount / (rates[from] || 1);
        const converted = inEur * (rates[to] || 1);

        return parseFloat(converted.toFixed(2));
    }
}
