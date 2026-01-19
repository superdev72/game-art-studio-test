import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('add-user')
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`POST /api/v1/add-user - Received data: ${JSON.stringify(createUserDto)}`);
    return this.usersService.create(createUserDto);
  }

  @Get('get-users')
  async findAll(@Query() query: GetUsersQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get('get-user/:id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
