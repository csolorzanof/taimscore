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

export type TrendingReportDTO = {
    assessmentProfileName: string
    assessmentStandarName: string
    ratingsReports: RatingsReportDTO[]
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

export type BenchmarkRatingDataDTO = {
    assessmentName: string
    industryGroupName: string
    assessmentProfileName: string
    assessmentStandardName: string
    ratingScore: number
    averageScore: number
    error: boolean
    errorMessage: string
}
