export namespace HouseModelsModel {
    export type Response = {
        id: string;
        type: 'house_models';
        links: {
            self: string;
        };
        attributes: {
            model: string;
            media: {
                title: string;
                video: string;
                banner: string;
                description: string;
            };
            house_type: string;
        };
    };
}