import { Module } from '@nestjs/common';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DiscordModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
