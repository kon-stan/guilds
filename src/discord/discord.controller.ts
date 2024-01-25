import { Controller, UseInterceptors, Post } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile() {
    // @UploadedFiles() file: Express.Multer.File,
    // @Query('invite_link') inviteLink: string,
    // TODO ADD FILE PARSER TO THAT SHIT
    // PROXY AS 'http://username:password@192.168.0.1:1488
    return this.discordService.batchJoinGuild({
      inviteLink: 'mdmc',
      joinGuild: [
        {
          token: '',
          proxyUrl: '',
        },
      ],
    });
  }
}
