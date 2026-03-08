import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IncidentsService {
    private readonly logger = new Logger(IncidentsService.name);

    constructor(private prisma: PrismaService) { }

    async logIncident(params: {
        title: string;
        severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        module: string;
        message: string;
        context?: any;
    }) {
        const { title, severity, module, message, context } = params;

        const incident = await this.prisma.incident.create({
            data: {
                title,
                severity,
                status: 'OPEN',
                openedAt: new Date(),
            },
        });

        await this.prisma.errorEvent.create({
            data: {
                severity,
                module,
                message,
                contextJson: context,
            },
        });

        this.logger.error(`[Incident ${severity}] ${title}: ${message} (Module: ${module})`);
        return incident;
    }

    async listIncidents() {
        return this.prisma.incident.findMany({
            orderBy: { openedAt: 'desc' },
            take: 20,
        });
    }

    async resolveIncident(id: string, resolution: string) {
        return this.prisma.incident.update({
            where: { id },
            data: {
                status: 'RESOLVED',
                resolvedAt: new Date(),
                resolution,
            },
        });
    }
}
