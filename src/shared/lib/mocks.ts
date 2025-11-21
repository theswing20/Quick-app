export interface MarkerDetails {
    id: string;
    serialNumber: string;
    name: string;
    details: string;
    address: string;
    powerbankPosition: string;
    hours: {
        open: string;
        close: string;
    };
    images: string[];
    price: {
        firstHour: number;
        remaining23Hours: number;
        nextDay: number;
    };
    availability: {
        take: number;
        return: number;
    };
}

export const markerDetails: MarkerDetails[] = [
    {
        id: "1",
        serialNumber: "1-030-591",
        name: "Arena Cyber Club",
        details: "Computer Club",
        address: "Some Avenue, 12/2",
        powerbankPosition:"Bar Counter",
        hours: {
            open: "10:00",
            close: "22:00",
        },
        images: [],
        price: {
            firstHour: 449,
            remaining23Hours: 749,
            nextDay: 1198,
        },
        availability: {
            take: 7,
            return: 1,
        },
    },
    {
        id: "2",
        serialNumber: "1-030-592",
        name: "City Library",
        details: "Library",
        address: "Next Avenue, 12/2",
        powerbankPosition:"Main Entrance",
        hours: {
            open: "10:00",
            close: "21:00",
        },
        images: [],
        price: {
            firstHour: 449,
            remaining23Hours: 749,
            nextDay: 1198,
        },
        availability: {
            take: 3,
            return: 5,
        },
    },
    {
        id: "3",
        serialNumber: "1-030-593",
        name: "City Hall",
        details: "City Hall",
        address: "Main square, 1",
        powerbankPosition:"Main Entrance",
        hours: {
            open: "10:00",
            close: "19:00",
        },
        images: [],
        price: {
            firstHour: 449,
            remaining23Hours: 749,
            nextDay: 1198,
        },
        availability: {
            take: 8,
            return: 0,
        },
    },
];