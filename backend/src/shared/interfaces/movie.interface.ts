import { Movie as _Movie, Prisma } from "@prisma/client";


export interface Movie extends _Movie {
}

export interface MovieCreateInput extends Prisma.MovieCreateInput {
}
