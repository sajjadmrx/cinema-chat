import { Module } from '@nestjs/common';
import { MemebersRepository } from './members.repository';



const providersAndExports = [MemebersRepository]

@Module({
    imports: [],
    providers: [...providersAndExports],
    exports: [...providersAndExports]
})
export class MembersModule { }
