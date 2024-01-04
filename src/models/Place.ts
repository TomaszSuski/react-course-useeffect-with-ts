export type Place = {
    id: string;
    title: string;
    image: {
        src: any;
        alt: string;
    };
    lat: number;
    lon: number;
}