import { SGDBGame, SGDBImage } from 'steamgriddb'

export type SGDBGameWithStringReleaseDate = SGDBGame & {
    releaseDateString: string | null
}

export type SGDBGameWithCover = SGDBGameWithStringReleaseDate & {
    cover: SGDBImage | undefined
}
