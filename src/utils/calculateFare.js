import { PRICING_DATA, RATE_MULTIPLIER, COMMISSION_RATE} from '../config/pricing.js';

export function calculateFare({distanceKm, durationMin, category, tip=0}){
    const subtotal = PRICING_DATA.baseRate + (PRICING_DATA.pricePerKm * distanceKm) + (PRICING_DATA.pricePerMinute * durationMin);
    const multiplier = RATE_MULTIPLIER[category];
    const fare = Math.max(Math.round((subtotal * multiplier)/100) * 100, PRICING_DATA.minimumRate);
    const commission = fare * COMMISSION_RATE;
    const driverEarnings = fare + tip - commission;
    return { fare, driverEarnings, commission }
};

    

    