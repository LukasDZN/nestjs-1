import { Injectable, Logger } from '@nestjs/common'
import { sql } from 'src/configs/databases/postgresql-db-1.config'

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name)

    // create(createUserDto: CreateUserDto) {
    //     return 'This action adds a new user'
    // }

    async findAll() {
        // return `This action returns all users`
        const users = await sql`SELECT * FROM users`
        return users
    }

    // findOne(id: number) {
    //     return `This action returns a #${id} user`
    // }

    // update(id: number, updateUserDto: UpdateUserDto) {
    //     return `This action updates a #${id} user`
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} user`
    // }
}
