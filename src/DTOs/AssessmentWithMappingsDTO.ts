export type AssessmentWithMappingsDTO = {
    userId: number
    tenantId: number
    assessmentName: string
    assessmentVersion: string
    mappings: Record<string, string>
    records: any[]
}
