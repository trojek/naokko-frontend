import * as NO_CAD from './no_cad.json';

import * as S561_1016 from './S561-1016.stp.json';
import * as S561_1018 from './S561-1018.stp.json';
import * as S561_1019 from './S561-1019.stp.json';
import * as S561_1020 from './S561-1020.stp.json';
import * as S561_3024 from './S561-3024.stp.json';
import * as S561_3025 from './S561-3025.stp.json';

import * as ZQ6_509_bok from './ZQ6-509_bok szuflady lewy.stp.json';
import * as ZQ6_510_bok from './ZQ6-510_bok szuflady prawy.stp.json';
import * as ZQ6_517_bok from './ZQ6-517_bok szuflady lewy.stp.json';
import * as ZQ6_518_bok from './ZQ6-518_bok szuflady prawy.stp.json';


export interface ModelDescription {
    index: string
}

export interface PointDto {
    x: number[]
    y: number[]
    z: number[]
}

export interface OpeningDto {
    x: number[]
    y: number[]
    z: number[]
    r: number[]
    depth: number[]
}

export interface CutDto {
    x1?: number[]
    x2?: number[]
    y1?: number[]
    y2?: number[]
    z1?: number[]
    z2?: number[]
    depth: number | number[]
    draw_only?: number
}

export interface PlaneDto {
    openings?: OpeningDto[]
    cuts?: CutDto[]
    image?: string
}

export interface ModelDto {
    index: string
    overall_size: PointDto
    top: PlaneDto
    back?: PlaneDto
    bottom?: PlaneDto
    left: PlaneDto
    right: PlaneDto
    front: PlaneDto
    rear: PlaneDto
}

export interface ModelWrapperDto {
    new: ModelDto,
    old: any,
}

export interface RegisterClient {
    getModels(query: string, limit: number): Promise<ModelDescription[]>

    getModel(index: string): Promise<ModelWrapperDto>
}

// export class HttpRegisterClient implements RegisterClient {
//     client = axios.create({
//         baseURL: process.env.REACT_APP_REGISTER_URL,
//         timeout: 1000,
//         headers: {'Accept': 'application/json'}
//     });
//
//     async getModels(query: string, limit: number): Promise<ModelDescription[]> {
//         const rsp = await this.client.get(`/models?query=${query}&limit=${limit}`)
//         return rsp.data['indexes'].map((i: string) => ({index: i}))
//     }
//
//     async getModel(index: string): Promise<ModelDto> {
//         const rsp = await this.client.get(`/models/${index}`)
//         return rsp.data
//     }
// }
//
// export class EmptyRegisterClientStub implements RegisterClient {
//     async getModels(query: string, limit: number): Promise<ModelDescription[]> {
//         await new Promise(r => setTimeout(r, 500))
//
//         return [
//             {index: 'INDEX ZXC125'}
//         ].filter(x => x.index.search(query) !== -1).splice(0, limit)
//     }
//
//     async getModel(index: string): Promise<ModelDto> {
//         await new Promise(r => setTimeout(r, 500))
//
//         const view = {openings: [], cuts: []}
//         return {
//             index: index,
//             overall_size: {x: [1, 0, 0, 0, 0, 0], y: [1, 0, 0, 0, 0, 0], z: [1, 0, 0, 0, 0, 0]},
//             top: view,
//             back: view,
//             left: view,
//             right: view,
//             front: view,
//             rear: view,
//         }
//     }
// }
//
// export class FilledRegisterClientStub implements RegisterClient {
//     async getModels(query: string, limit: number): Promise<ModelDescription[]> {
//         await new Promise(r => setTimeout(r, 500))
//
//         return [
//             {index: 'time'},
//             {index: 'person'},
//             {index: 'year'},
//             {index: 'way'},
//             {index: 'day'},
//             {index: 'thing'},
//             {index: 'man'},
//             {index: 'world'},
//             {index: 'life'},
//             {index: 'hand'},
//             {index: 'part'},
//             {index: 'child'},
//             {index: 'eye'},
//             {index: 'woman'},
//             {index: 'place'},
//             {index: 'work'},
//             {index: 'week'},
//             {index: 'case'},
//             {index: 'point'},
//             {index: 'government'},
//             {index: 'company'},
//             {index: 'number'},
//             {index: 'group'},
//             {index: 'problem'},
//             {index: 'fact'},
//         ].filter(x => x.index.search(query) !== -1).splice(0, limit)
//     }
//
//     async getModel(index: string): Promise<ModelDto> {
//         await new Promise(r => setTimeout(r, 500))
//
//         const view = {openings: [], cuts: []}
//
//         return {
//             index: index,
//             overall_size: {x: [1000, 0, 0, 0, 0, 0], y: [500, 0, 0, 0, 0, 0], z: [100, 0, 0, 0, 0, 0]},
//             top: {
//                 openings: [
//                     {
//                         x: [100, 0, 0, 0, 0, 0],
//                         y: [100, 0, 0, 0, 0, 0],
//                         z: [100, 0, 0, 0, 0, 0],
//                         r: [50, 0, 0, 0, 0, 0],
//                         depth: [50, 0, 0, 0, 0, 0],
//                     }
//                 ],
//                 cuts: [
//                     {
//                         x1: [100, 0, 0, 0, 0, 0],
//                         x2: [200, 0, 0, 0, 0, 0],
//                         y1: [100, 0, 0, 0, 0, 0],
//                         y2: [200, 0, 0, 0, 0, 0],
//                         depth: 2,
//                     }
//                 ]
//             },
//             back: view,
//             left: view,
//             right: view,
//             front: view,
//             rear: view,
//         }
//     }
// }


export class DummyHardCodedRegisterClient implements RegisterClient {
    getModel(index: string): Promise<ModelWrapperDto> {
        return Promise.resolve({
            "no_cad.stp": NO_CAD as unknown as ModelWrapperDto,
            "S561-1016.stp": S561_1016 as unknown as ModelWrapperDto,
            "S561-1018.stp": S561_1018 as unknown as ModelWrapperDto,
            "S561-1019.stp": S561_1019 as unknown as ModelWrapperDto,
            "S561-1020.stp": S561_1020 as unknown as ModelWrapperDto,
            "S561-3024.stp": S561_3024 as unknown as ModelWrapperDto,
            "S561-3025.stp": S561_3025 as unknown as ModelWrapperDto,
            "ZQ6-509_bok szuflady lewy.stp": ZQ6_509_bok as unknown as ModelWrapperDto,
            "ZQ6-510_bok szuflady prawy.stp": ZQ6_510_bok as unknown as ModelWrapperDto,
            "ZQ6-517_bok szuflady lewy.stp": ZQ6_517_bok as unknown as ModelWrapperDto,
            "ZQ6-518_bok szuflady prawy.stp": ZQ6_518_bok as unknown as ModelWrapperDto,
        }[index]!);
    }

    getModels(query: string, limit: number): Promise<ModelDescription[]> {
        return Promise.resolve([
            {index: "no_cad.stp"},
            {index: "S561-1016.stp"},
            {index: "S561-1018.stp"},
            {index: "S561-1019.stp"},
            {index: "S561-1020.stp"},
            {index: "S561-1020.stp"},
            {index: "S561-3025.stp"},
            {index: "ZQ6-509_bok szuflady lewy.stp"},
            {index: "ZQ6-510_bok szuflady prawy.stp"},
            {index: "ZQ6-517_bok szuflady lewy.stp"},
            {index: "ZQ6-518_bok szuflady prawy.stp"},
        ]);
    }
}
