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

export type RatingsReportDTO = {
    assessmentName: string
    assessmentStandarName: string
    complianceControls: ComplianceControl[]
    ratingScore: number
    ratingValue: number
}

export type ControlGroupRatingDTO = {
    controlGroupName: string
    top20RatingSum: number
    value: number
}

export type MaturityReportDTO = {
    assessmentName: string
    assessmentStandarName: string
    complianceControls: ComplianceControl[]
    controlGroupRatings: ControlGroupRatingDTO[]
}
