import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { hashValue } from '../common/helpers/hash';
import { instanceToPlain } from 'class-transformer';
import { FindUsersDto } from './dto/find-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(query: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOne(query);
  }

  instanceUserToPlain(user: User): UserProfileResponseDto {
    return <UserProfileResponseDto>instanceToPlain(user);
  }

  async signup(createUserDto: CreateUserDto): Promise<UserProfileResponseDto> {
    const { password } = createUserDto;
    const hashedPassword = await hashValue(password);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const userWithPassword = await this.usersRepository.save(newUser);
    return this.instanceUserToPlain(userWithPassword);
  }

  async findByUsername(
    username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.findOne({
      where: { username },
      select: ['id', 'username', 'createdAt', 'updatedAt', 'about', 'avatar'],
    });
    return this.instanceUserToPlain(user);
  }

  async findMany(query: FindManyOptions<User>): Promise<Array<User>> {
    return await this.usersRepository.find(query);
  }

  async findByMailOrName(
    body: FindUsersDto,
  ): Promise<Array<UserProfileResponseDto>> {
    const { query } = body;
    return await this.findMany({
      where: [{ username: query }, { email: query }],
    });
  }

  async findOneForValidate(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });
  }

  async updateOne(
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    if (!user) {
      throw new Error('User not found');
    }
    if (updateUserDto.password) {
      updateUserDto.password = await hashValue(updateUserDto.password);
    }
    const updatedUser = Object.assign(user, updateUserDto);
    const userWithPassword = await this.usersRepository.save(updatedUser);

    return this.instanceUserToPlain(userWithPassword);
  }

  async getWishes(username: string): Promise<Array<Wish>> {
    const options: FindOneOptions<User> = {
      where: { username },
      relations: ['wishes'],
    };
    const { wishes } = await this.usersRepository.findOne(options);
    return wishes;
  }

  async getOwnWishes(id: number): Promise<Array<Wish>> {
    const options: FindOneOptions<User> = {
      where: { id },
      relations: ['wishes', 'offers'],
    };
    const { wishes } = await this.usersRepository.findOne(options);
    return wishes;
  }
}
