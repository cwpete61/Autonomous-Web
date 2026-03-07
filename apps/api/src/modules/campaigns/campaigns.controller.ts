import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CampaignStatus } from '@agency/db';

@ApiTags('campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
    constructor(private readonly campaignsService: CampaignsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a campaign and enqueue it' })
    create(@Body() dto: CreateCampaignDto) {
        return this.campaignsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all campaigns' })
    findAll() {
        return this.campaignsService.findAll();
    }

    @Get('queue')
    @ApiOperation({ summary: 'Return campaigns currently in queue (ACTIVE or PAUSED)' })
    findQueue() {
        return this.campaignsService.findQueue();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.campaignsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
        return this.campaignsService.update(id, dto);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update campaign status (active, paused, completed, archived)' })
    updateStatus(
        @Param('id') id: string,
        @Body() body: { status: CampaignStatus },
    ) {
        return this.campaignsService.updateStatus(id, body.status);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.campaignsService.remove(id);
    }
}
