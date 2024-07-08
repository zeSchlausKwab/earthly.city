import 'leaflet';

declare module 'leaflet' {
    interface PM {
        addControls(options: any): void;
        enableDraw(shape: string, options?: any): void;
        disableDraw(shape: string): void;
        setPathOptions(options: any): void;
        getGeomanDrawLayers(): L.Layer[];
    }

    interface Map {
        pm: PM;
    }

    interface Layer {
        pm: PM;
    }
}