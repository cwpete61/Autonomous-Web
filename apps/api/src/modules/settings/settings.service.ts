import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Return all settings as a plain { key: value } object */
  async getAll(): Promise<Record<string, string>> {
    const rows = await this.prisma.systemSetting.findMany();
    return rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);
  }

  /** Upsert one or more settings from a { key: value } map */
  async setMany(data: Record<string, string>): Promise<void> {
    const ops = Object.entries(data).map(([key, value]) =>
      this.prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    );
    await this.prisma.$transaction(ops);
  }
}
