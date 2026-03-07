import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LeadStatus } from '@agency/db';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto as any);
  }

  @Get()
  @ApiOperation({ summary: 'List all leads (with optional filters)' })
  @ApiQuery({ name: 'stage', enum: LeadStatus, required: false })
  @ApiQuery({ name: 'campaignId', required: false })
  findAll(
    @Query('stage') stage?: LeadStatus,
    @Query('campaignId') campaignId?: string,
  ) {
    return this.leadsService.findAll({ stage, campaignId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead details (including business, audit, contacts)' })
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get lead event timeline (audit logs)' })
  getTimeline(@Param('id') id: string) {
    return this.leadsService.getTimeline(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update basic lead info' })
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto as any);
  }

  @Patch(':id/stage')
  @ApiOperation({ summary: 'Transition lead to a new stage (validated against state machine)' })
  updateStage(
    @Param('id') id: string,
    @Body() body: { stage: LeadStatus },
  ) {
    return this.leadsService.updateStage(id, body.stage);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead' })
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}
