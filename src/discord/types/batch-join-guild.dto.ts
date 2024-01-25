class JoinGuildDto {
  readonly token: string;
  readonly proxyUrl: string;
}

export class BatchJoinGuildDto {
  readonly joinGuild: JoinGuildDto[];
  readonly inviteLink: string;
}
