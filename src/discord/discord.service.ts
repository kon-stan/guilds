import { Injectable, Logger } from '@nestjs/common';
import { BatchJoinGuildDto } from './types/batch-join-guild.dto';
import { Solver } from '2captcha';
import * as ProxyAgent from 'proxy-agent';
import * as Discord from 'discord.js-selfbot-v13';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private solver = new Solver(process.env.TWOCAPTCHA_KEY);

  async batchJoinGuild({ inviteLink, joinGuild }: BatchJoinGuildDto) {
    const invalidTokens = [];

    for (const { token, proxyUrl } of joinGuild) {
      await this.joinGuild(token, inviteLink, proxyUrl);
    }

    return invalidTokens;
  }

  async joinGuild(token: string, inviteLink: string, proxyUrl: string) {
    const proxy = new ProxyAgent(proxyUrl);

    const client = new Discord.Client({
      ws: {
        agent: proxy, // WebSocket Proxy
      },
      http: {
        agent: proxy, // REST Proxy
      },
      captchaSolver: (captcha, UA) => {
        return this.solver
          .hcaptcha(captcha.captcha_sitekey, 'discord.com', {
            invisible: 1,
            userAgent: UA,
            data: captcha.captcha_rqdata,
          })
          .then((res) => res.data);
      },
    });

    if (process.env.NODE_ENV === 'debug') {
      client.on('debug', console.log);
    }

    client.on('ready', async () => {
      this.logger.log('Logged as:', client.user.tag);
      const resp = await client.acceptInvite(inviteLink);
      this.logger.log('Joined to guild:', resp.toString());
    });

    client.login(token);
  }
}
