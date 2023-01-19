import axios from "axios";
import {ModelDto} from "./register";
// import * as rsp from './measurement.json'

export enum Corner {
    Left, Right
}

export interface MeasurementClient {
    measureLeft(model: ModelDto): Promise<ModelDto>
    measureRight(model: ModelDto): Promise<ModelDto>
}

export class HttpMeasurementClient implements MeasurementClient {
    client = axios.create({
        baseURL: process.env.REACT_APP_MEASUREMENT_URL,
        timeout: 180_000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
    async measureLeft(model: any): Promise<ModelDto> {
        const url = '/measure_part_in_left_corner'
        let rsp = await this.client.post(url, {...model});
        console.log("measure-left")
        return await new Promise(res=>setTimeout(res,2000))
    }
    async measureRight(model: any): Promise<ModelDto> {
        const url = '/measure_part_in_right_corner'
        let rsp = (await this.client.post(url, {...model})).data;
        let raw = rsp as any;
        let response: ModelDto = raw;
        //@ts-ignore
        console.log("measure-right")
        // response.top.image = raw.top_plane_image;
        await new Promise(res=>setTimeout(res,3000))
        return response;
    }
}
