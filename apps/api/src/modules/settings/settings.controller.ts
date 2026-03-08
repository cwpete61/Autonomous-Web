import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /** GET /settings — returns all settings as { key: value } */
  @Get()
  async getAll(): Promise<Record<string, string>> {
    return this.settingsService.getAll();
  }

  /** PUT /settings — upserts key/value pairs */
  @Put()
  async setMany(@Body() data: Record<string, string>): Promise<{ ok: boolean }> {
    await this.settingsService.setMany(data);
    return { ok: true };
  }
}
