// Helper to generate random number within range
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Regions list
const regions = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산'];

// Generate 200 mock branches
export const generateMockData = () => {
    return Array.from({ length: 200 }, (_, i) => {
        const totalSeats = random(50, 150);
        const occupiedSeats = random(10, totalSeats); // Ensure occupied <= total
        const occupancyRate = (occupiedSeats / totalSeats) * 100;

        // Revenue logic: correlated slightly with occupancy
        const dailySales = occupiedSeats * random(10000, 30000);

        // Refund logic: random chance
        const refundCount = Math.random() > 0.8 ? random(1, 5) : 0;
        const refundRate = (refundCount / (occupiedSeats + refundCount)) * 100; // Simplified rate

        // Status determination
        let status = 'normal';
        if (refundRate > 5 || occupancyRate < 20) status = 'warning';
        if (refundRate > 10 || occupancyRate < 10) status = 'danger';

        return {
            id: `br-${i + 1}`,
            name: `지점 ${i + 1}호점`,
            region: regions[random(0, regions.length - 1)],
            sales: dailySales,
            seats: {
                total: totalSeats,
                occupied: occupiedSeats,
                rate: occupancyRate.toFixed(1)
            },
            refunds: {
                count: refundCount,
                rate: refundRate.toFixed(1)
            },
            status // normal, warning, danger
        };
    });
};

export const MOCK_DATA = generateMockData();
