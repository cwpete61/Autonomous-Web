-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'OPS_ADMIN', 'SALES_ADMIN', 'FULFILLMENT_ADMIN', 'SUPPORT_ADMIN', 'CLIENT_OWNER', 'CLIENT_EDITOR', 'CLIENT_VIEWER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AdminType" AS ENUM ('SUPER', 'OPS', 'SALES', 'FULFILLMENT', 'SUPPORT');

-- CreateEnum
CREATE TYPE "ClientRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('USER', 'AGENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('DISCOVERED', 'RESEARCHED', 'AUDITED', 'QUALIFIED', 'DISQUALIFIED', 'ENRICHED', 'ENRICHMENT_FAILED', 'OUTREACH_PENDING', 'OUTREACH_APPROVED', 'OUTREACH_SENT', 'OUTREACH_FAILED', 'REPLIED', 'DEMO_PENDING', 'DEMO_SENT', 'DEMO_FAILED', 'PROPOSAL_SENT', 'INVOICE_SENT', 'PAID', 'BUILD_STARTED', 'BUILD_FAILED', 'REVIEW_PENDING', 'DELIVERED', 'CLOSED_WON', 'CLOSED_LOST', 'RE_ENGAGE');

-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "QualificationStatus" AS ENUM ('PENDING', 'QUALIFIED', 'DISQUALIFIED', 'NEEDS_REVIEW');

-- CreateEnum
CREATE TYPE "OutreachStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SENDING', 'SENT', 'FAILED', 'REPLIED', 'BOUNCED');

-- CreateEnum
CREATE TYPE "DemoGenerationStatus" AS ENUM ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVISION_NEEDED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'STALLED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'REVIEW', 'REVISION', 'STAGING', 'DELIVERED', 'LAUNCHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "RevisionStatus" AS ENUM ('REQUESTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CommunicationChannel" AS ENUM ('EMAIL', 'PHONE', 'SMS', 'WHATSAPP', 'SLACK', 'IN_APP');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('EMAIL', 'CHAT', 'NOTE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ContentAssetType" AS ENUM ('SERVICE_PAGE', 'LOCAL_PAGE', 'BLOG_POST', 'FAQ', 'CTA_BLOCK', 'META_DESCRIPTION', 'SOCIAL_POST');

-- CreateEnum
CREATE TYPE "AgentRunStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'NEEDS_REVIEW');

-- CreateEnum
CREATE TYPE "ErrorSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'MITIGATING', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "MaintenanceTaskType" AS ENUM ('QUEUE_RETRY_SWEEP', 'DEAD_LETTER_REVIEW', 'STALE_LOCK_CLEANUP', 'ORPHANED_ASSET_SCAN', 'FAILED_WEBHOOK_RETRY', 'BACKUP_VERIFICATION', 'RESTORE_VERIFICATION', 'STORAGE_CONSISTENCY', 'VECTOR_INDEX_MAINTENANCE', 'EXPIRED_DEMO_CLEANUP', 'INACTIVE_LEAD_CLEANUP', 'INCIDENT_ARCHIVE');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'RUNNING', 'COMPLETED', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "BackupType" AS ENUM ('FULL_DB', 'INCREMENTAL_ASSET', 'PRE_MIGRATION', 'PRE_RELEASE', 'MANUAL_SNAPSHOT');

-- CreateEnum
CREATE TYPE "BackupStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "RestoreStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "ApprovalType" AS ENUM ('OUTREACH', 'PREVIEW', 'DEMO', 'INVOICE', 'DELIVERY');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ApprovalPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'SLACK');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "fullName" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adminType" "AdminType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientRole" "ClientRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "phone" TEXT,
    "publicEmail" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "googleProfileUrl" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL,
    "priority" "LeadPriority",
    "source" TEXT,
    "discoveryNotes" TEXT,
    "qualificationScore" DOUBLE PRECISION,
    "qualificationStatus" "QualificationStatus",
    "currentOwnerAgent" TEXT,
    "campaignId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteAudit" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "visualQualityScore" INTEGER,
    "usabilityScore" INTEGER,
    "trustScore" INTEGER,
    "conversionScore" INTEGER,
    "localSeoScore" INTEGER,
    "technicalScore" INTEGER,
    "contentScore" INTEGER,
    "summary" TEXT,
    "issueListJson" JSONB,
    "opportunitySummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "fullName" TEXT,
    "role" TEXT,
    "email" TEXT NOT NULL,
    "emailConfidence" DOUBLE PRECISION,
    "alternateChannels" JSONB,
    "personalizationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachSequence" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "status" "OutreachStatus" NOT NULL,
    "subjectLine" TEXT,
    "firstEmail" TEXT,
    "followupOne" TEXT,
    "followupTwo" TEXT,
    "lastSentAt" TIMESTAMP(3),
    "nextSendAt" TIMESTAMP(3),
    "replyDetected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoAsset" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "blurredPreviewUrl" TEXT,
    "fullPreviewUrl" TEXT,
    "beforeAfterUrl" TEXT,
    "hostedDemoUrl" TEXT,
    "generationStatus" "DemoGenerationStatus" NOT NULL,
    "reviewStatus" "ReviewStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "clientId" TEXT,
    "channel" "CommunicationChannel" NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "messageType" "MessageType" NOT NULL,
    "content" TEXT NOT NULL,
    "classification" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "scopeJson" JSONB NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" "ProposalStatus" NOT NULL,
    "sentAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "proposalId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "InvoiceStatus" NOT NULL,
    "paymentLink" TEXT,
    "externalRef" TEXT,
    "issuedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "communicationPreference" "CommunicationChannel" NOT NULL DEFAULT 'EMAIL',
    "onboardingStatus" "OnboardingStatus" NOT NULL,
    "activeProjectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "scopeJson" JSONB NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "sitemapJson" JSONB,
    "contentChecklistJson" JSONB,
    "stagingUrl" TEXT,
    "deliveryUrl" TEXT,
    "launchDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevisionRequest" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "requestText" TEXT NOT NULL,
    "status" "RevisionStatus" NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevisionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAsset" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "clientId" TEXT,
    "assetType" "ContentAssetType" NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "status" "AgentRunStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "inputJson" JSONB,
    "outputJson" JSONB,
    "errorSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorEvent" (
    "id" TEXT NOT NULL,
    "severity" "ErrorSeverity" NOT NULL,
    "module" TEXT NOT NULL,
    "code" TEXT,
    "message" TEXT NOT NULL,
    "contextJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ErrorEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "severity" "IncidentSeverity" NOT NULL,
    "status" "IncidentStatus" NOT NULL,
    "rootCause" TEXT,
    "resolution" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceTask" (
    "id" TEXT NOT NULL,
    "taskType" "MaintenanceTaskType" NOT NULL,
    "status" "MaintenanceStatus" NOT NULL,
    "scheduledFor" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "resultJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackupJob" (
    "id" TEXT NOT NULL,
    "backupType" "BackupType" NOT NULL,
    "status" "BackupStatus" NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "checksum" TEXT,
    "artifactPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BackupJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestoreEvent" (
    "id" TEXT NOT NULL,
    "backupJobId" TEXT NOT NULL,
    "status" "RestoreStatus" NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestoreEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbeddingRecord" (
    "id" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector NOT NULL,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmbeddingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorType" "ActorType" NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "metadata" JSONB,
    "correlationId" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "approvalType" "ApprovalType" NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "leadId" TEXT,
    "requestedBy" TEXT,
    "reviewedBy" TEXT,
    "status" "ApprovalStatus" NOT NULL,
    "priority" "ApprovalPriority" NOT NULL DEFAULT 'NORMAL',
    "notes" TEXT,
    "rejectionReason" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "geography" TEXT NOT NULL,
    "sourceConfig" JSONB,
    "thresholds" JSONB,
    "status" "CampaignStatus" NOT NULL,
    "leadsFound" INTEGER NOT NULL DEFAULT 0,
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailSequenceId" TEXT,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "channel" "NotificationChannel" NOT NULL,
    "category" TEXT,
    "linkUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailSequence" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailStep" (
    "id" TEXT NOT NULL,
    "sequenceId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "delayDays" INTEGER NOT NULL DEFAULT 0,
    "subject" TEXT,
    "body" TEXT,

    CONSTRAINT "EmailStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_userId_key" ON "AdminUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientUser_userId_clientId_key" ON "ClientUser"("userId", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteAudit_leadId_key" ON "WebsiteAudit"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_leadId_key" ON "Client"("leadId");

-- CreateIndex
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "ApprovalRequest_status_approvalType_idx" ON "ApprovalRequest"("status", "approvalType");

-- CreateIndex
CREATE INDEX "ApprovalRequest_leadId_idx" ON "ApprovalRequest"("leadId");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientUser" ADD CONSTRAINT "ClientUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientUser" ADD CONSTRAINT "ClientUser_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteAudit" ADD CONSTRAINT "WebsiteAudit_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachSequence" ADD CONSTRAINT "OutreachSequence_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoAsset" ADD CONSTRAINT "DemoAsset_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevisionRequest" ADD CONSTRAINT "RevisionRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAsset" ADD CONSTRAINT "ContentAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_emailSequenceId_fkey" FOREIGN KEY ("emailSequenceId") REFERENCES "EmailSequence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailStep" ADD CONSTRAINT "EmailStep_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "EmailSequence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
