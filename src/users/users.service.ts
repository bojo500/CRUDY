import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { CreateUserDto, RegisterDto, UpdateUserDto } from "./dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {
  }

  async create(CreateUserDto: CreateUserDto): Promise<any> {
    const user = await this.findOne(CreateUserDto.username);
    if (user) {
      throw new BadRequestException('The User is Already exists ');
    }
    try {
      await this.repository.save(CreateUserDto);
    } catch {
      throw new InternalServerErrorException();
    }
    return {
      message: 'User Created Successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  findAll() {
    return this.repository.find({ relations: ["blogOnes"] });
  }

  findOne(id: string) {
    return this.repository.findOne(id, { relations: ["blogOnes"] });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.repository.save({ ...updateUserDto, id });
    } catch {
      throw new InternalServerErrorException();
    }
    return {
      message: 'User Updated Successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async remove(id: string) {
    let item = await this.findOne(id);
    if (!item) {
      throw new NotFoundException();
    }
    try {
      await this.repository.delete(item.id);
    } catch {
      throw new InternalServerErrorException();
    }
    return {
      message: 'User Deleted Successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async createUser(createUserDto: RegisterDto): Promise<User> {
    const user = await this.repository.save(createUserDto);
    if (!user) {
      throw new BadRequestException();
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.repository.findOne(username);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.repository.findOne(email);
  }
}
