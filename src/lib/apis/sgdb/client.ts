import SGDB from 'steamgriddb'

export function createSgdbClient(apiKey: string) {
    return new SGDB({ key: apiKey })
}
