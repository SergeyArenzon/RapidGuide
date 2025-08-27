import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository, wrap } from '@mikro-orm/postgresql';
import { User } from './user.entity';
import { CreateUserDto, UserDto } from '@rapid-guide-io/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async createOrFind(createUserDto: CreateUserDto): Promise<UserDto | null> {
    try {
      const user = await this.em.findOne(User, { email: createUserDto.email });
      if (user) {
        // @ts-ignore
        return user;
      }

      return await this.create(createUserDto);
    } catch (error) {
      console.log(error);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    // Start a new transaction with EntityManager
    const em = this.em.fork();
    // Create a new User entity
    const newUser = new User(createUserDto);
    // Persist the user in the transaction
    await em.persistAndFlush(newUser);
    // Commit the transaction
    await em.flush();
    // @ts-ignore
    return newUser;
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ id });
  }

  async findAll(query: Record<string, any> = {}): Promise<User[]> {
    return await this.userRepository.find(query);
  }

  async update(id: string, attrs: CreateUserDto) {
    const user = await this.userRepository.findOneOrFail(id);
    wrap(user).assign(attrs);
    await this.em.flush();
    return user;
  }
  async remove(id: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail(id);
    await this.em.removeAndFlush(user);
    return user;
  }
}
