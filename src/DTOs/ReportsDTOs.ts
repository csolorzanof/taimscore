export type ComplianceControl = {
    controlSection: string
    score: number
}

export type PieChartDataDTO = {
    chartType: string
    data: any[][]
    title: string
}

export type ComplianceReportDTO = {
    assessmentName: string
    assessmentStandarName: string
    complianceControls: ComplianceControl[]
    pieChartData: PieChartDataDTO[]
}
