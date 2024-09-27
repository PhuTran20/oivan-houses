export namespace HousesModel {
    export type Response = {
        id?: string,
        type: string,
        links?: {
            self: string
        },
        attributes: {
            house_number: string,
            price: number,
            block_number: string,
            land_number: string,
            house_type: string,
            model: string,
            status: string
        }
    };
}