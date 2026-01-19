import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class DatabaseSeederService {
  private readonly logger = new Logger(DatabaseSeederService.name);
  private readonly TARGET_COUNT = 2000000; // 2 million users

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UsersService,
  ) {}

  async seedDatabaseIfEmpty(): Promise<void> {
    try {
      const count = await this.usersService.count();
      
      if (count === 0) {
        this.logger.log('Database is empty. Starting to seed 2 million users...');
        await this.seedUsers();
        this.logger.log('Database seeding completed successfully!');
      } else {
        this.logger.log(`Database already contains ${count} users. Skipping seed.`);
      }
    } catch (error) {
      this.logger.error('Error during database seeding:', error);
    }
  }

  private async seedUsers(): Promise<void> {
    const batchSize = 10000; // Process in batches of 10k
    const totalBatches = Math.ceil(this.TARGET_COUNT / batchSize);
    
    const firstNames = [
      'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Jessica',
      'Robert', 'Ashley', 'William', 'Amanda', 'Richard', 'Melissa', 'Joseph',
      'Deborah', 'Thomas', 'Stephanie', 'Charles', 'Rebecca', 'Christopher',
      'Sharon', 'Daniel', 'Laura', 'Matthew', 'Michelle', 'Anthony', 'Kimberly',
      'Mark', 'Amy', 'Donald', 'Angela', 'Steven', 'Brenda', 'Paul', 'Emma',
      'Andrew', 'Olivia', 'Joshua', 'Cynthia', 'Kenneth', 'Marie', 'Kevin',
      'Janet', 'Brian', 'Catherine', 'George', 'Frances', 'Timothy', 'Christine',
    ];

    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
      'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson',
      'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
      'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis',
      'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott',
      'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson',
      'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
    ];

    const domains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com',
      'test.com', 'mail.com', 'company.com', 'business.com', 'email.com',
    ];

    const generateRandomUser = (index: number) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${domains[Math.floor(Math.random() * domains.length)]}`;
      const phone = `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      
      // Generate random date of birth between 18 and 80 years ago
      const yearsAgo = 18 + Math.floor(Math.random() * 62);
      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - yearsAgo);
      dateOfBirth.setMonth(Math.floor(Math.random() * 12));
      dateOfBirth.setDate(Math.floor(Math.random() * 28) + 1);

      return {
        name,
        email,
        phone,
        dateOfBirth,
      };
    };

    for (let batch = 0; batch < totalBatches; batch++) {
      const batchUsers = [];
      const startIndex = batch * batchSize;
      const endIndex = Math.min(startIndex + batchSize, this.TARGET_COUNT);

      for (let i = startIndex; i < endIndex; i++) {
        batchUsers.push(generateRandomUser(i));
      }

      await this.usersService.createMany(batchUsers);
      
      const progress = ((batch + 1) / totalBatches * 100).toFixed(2);
      this.logger.log(`Seeded batch ${batch + 1}/${totalBatches} (${progress}%) - ${endIndex}/${this.TARGET_COUNT} users`);
    }
  }
}
