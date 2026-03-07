import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EmailSequencesService } from './email-sequences.service';
import { CreateEmailSequenceDto } from './dto/create-email-sequence.dto';
import { UpdateEmailSequenceDto } from './dto/update-email-sequence.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('email-sequences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('email-sequences')
export class EmailSequencesController {
    constructor(private readonly emailSequencesService: EmailSequencesService) { }

    @Post()
    @ApiOperation({ summary: 'Create an email sequence template with steps' })
    create(@Body() createEmailSequenceDto: CreateEmailSequenceDto) {
        return this.emailSequencesService.create(createEmailSequenceDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all email sequences (templates)' })
    @ApiQuery({ name: 'campaignId', required: false, description: 'Filter by campaign assignment' })
    findAll(@Query('campaignId') campaignId?: string) {
        return this.emailSequencesService.findAll(campaignId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get details of an email sequence (including all steps)' })
    findOne(@Param('id') id: string) {
        return this.emailSequencesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an email sequence and its steps' })
    update(
        @Param('id') id: string,
        @Body() updateEmailSequenceDto: UpdateEmailSequenceDto,
    ) {
        return this.emailSequencesService.update(id, updateEmailSequenceDto);
    }

    @Patch(':id/assign')
    @ApiOperation({ summary: 'Assign or unassign a sequence to a campaign' })
    assignToCampaign(
        @Param('id') id: string,
        @Body() body: { campaignId: string | null },
    ) {
        return this.emailSequencesService.assignToCampaign(id, body.campaignId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an email sequence template' })
    remove(@Param('id') id: string) {
        return this.emailSequencesService.remove(id);
    }
}
