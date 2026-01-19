import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseSeederService } from './database-seeder.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
  ],
  providers: [DatabaseSeederService],
})
export class DatabaseSeederModule implements OnModuleInit {
  constructor(private readonly seederService: DatabaseSeederService) {}

  async onModuleInit() {
    // Seed database on startup if empty
    await this.seederService.seedDatabaseIfEmpty();
  }
}
